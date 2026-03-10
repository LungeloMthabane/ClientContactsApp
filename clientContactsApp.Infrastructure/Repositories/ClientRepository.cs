using clientContactsApp.Application.DTOs;
using Microsoft.EntityFrameworkCore;
using clientContactsApp.Domain.Entities;
using clientContactsApp.Infrastructure.Data;
using clientContactsApp.Application.Interfaces;
using clientContactsApp.Domain.Services;

namespace clientContactsApp.Infrastructure.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly AppDbContext _dbContext;

    public ClientRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    /**
     * Function used to get client details by id
     * @param id - Unique id used to identify get the client details
     * 
     * @returns - Client details matching the received id
     */
    public async Task<ClientDto?> GetClientById(int id)
    {
        var client = await _dbContext.Clients
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new ClientDto(
                c.Id,
                c.Name,
                c.Code,
                c.ClientContacts
                    .Select(cc => new Contact(
                        cc.Contact.Id,
                        cc.Contact.Name,
                        cc.Contact.Email,
                        cc.Contact.Surname))
                    .ToList()
            ))
            .FirstOrDefaultAsync();

        return client ?? new ClientDto(id, "", "", new List<Contact>());
    }
    
    /**
     * Function used to get all clients
     * 
     * @returns - list of clients 
     */
    public async Task<List<ClientDto>> GetAllClients()
    {
        return await _dbContext.Clients
            .AsNoTracking()
            .Select(c => new ClientDto(
                c.Id,
                c.Name,
                c.Code,
                c.ClientContacts
                    .Select(cc => new Contact(
                        cc.Contact.Id,
                        cc.Contact.Name,
                        cc.Contact.Email,
                        cc.Contact.Surname))
                    .ToList()
            )).ToListAsync();
    }

    /**
     * Function used to remove clientContact record
     * @param clientId The client id
     * @param contactId The contact id
     */
    public async Task<bool> DeleteClientContactAsync(int clientId, int contactId)
    {
        var clientContact = await _dbContext.ClientContacts
            .FirstOrDefaultAsync(cc => cc.ClientId == clientId && cc.ContactId == contactId);

        if (clientContact == null) return false;

        _dbContext.ClientContacts.Remove(clientContact);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    /**
     * Function used to add new client record
     * @param createClientWithContactsDto
     */
    public async Task<(bool Success, string Message, Client? Client)> CreateClientWithContactsAsync(UpsertClientWithContactsDto upsertClientWithContactsDto)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            if (await _dbContext.Clients.AnyAsync(c => c.Name.ToLower() == upsertClientWithContactsDto.Name.ToLower()))
            {
                return (false, $"Client with the name, {upsertClientWithContactsDto.Name} already exists. Client name must be unique.", null);
            }
            
            var nextId = 1;

            if (await _dbContext.Clients.AnyAsync())
            {
                nextId = await _dbContext.Clients.MaxAsync(c => c.Id) + 1;
            }
            
            var existingCodes = await _dbContext.Clients
                .Select(c => c.Code)
                .ToListAsync();

            var code = ClientCodeGenerator.Generate(upsertClientWithContactsDto.Name, existingCodes);
            
            var client = new Client(
                nextId,
                upsertClientWithContactsDto.Name,
                code
            );

            _dbContext.Clients.Add(client);

            if (upsertClientWithContactsDto.ContactIds.Count > 0 && upsertClientWithContactsDto.ContactIds.Any())
            {
                var contacts = await _dbContext.Contacts
                    .Where(c => upsertClientWithContactsDto.ContactIds.Contains(c.Id))
                    .ToListAsync();

                foreach (var contact in contacts)
                {
                    _dbContext.ClientContacts.Add(new ClientContact
                    {
                        ClientId = client.Id,
                        ContactId = contact.Id
                    });
                }
            }

            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            return (true, "Client created successfully", client);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    /**
     *
     */
    public async Task<(bool Success, string Message, Client? Client)> UpdateClientAsync(int id,
        UpsertClientWithContactsDto upsertClientWithContactsDto)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var client = await _dbContext.Clients
                .Include(x => x.ClientContacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (client == null)
            {
                return (false, "Client not found", null);
            }
            
            var clientNameExists = await _dbContext.Clients.AnyAsync(c => c.Name.ToLower() == upsertClientWithContactsDto.Name.ToLower() && c.Id != id);

            if (clientNameExists)
            {
                return (false, $"Client with the name, {upsertClientWithContactsDto.Name} already exists. Client name must be unique.", null);
            }
            
            client.UpdateName(upsertClientWithContactsDto.Name);
            
            // Existing contact relationships
            var existingContactIds = client.ClientContacts
                .Where(x => x.ClientId == client.Id)
                .Select(cc => cc.ContactId)
                .ToList();
            
            // Contacts to add
            var contactsToAdd = upsertClientWithContactsDto.ContactIds
                .Where(id => !existingContactIds.Contains(id))
                .ToList();
            
            foreach (var contactId in contactsToAdd)
            {
                client.ClientContacts.Add(new ClientContact
                {
                    ClientId = client.Id,
                    ContactId = contactId
                });
            }

            _dbContext.Clients.Update(client);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
            
            return (true, "Client updated successfully", client);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}