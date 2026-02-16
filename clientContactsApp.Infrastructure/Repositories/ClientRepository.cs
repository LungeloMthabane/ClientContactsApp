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
            ))
            .ToListAsync();
    }

    public async Task<bool> DeleteClientContactAsync(int clientId, int contactId)
    {
        var clientContact = await _dbContext.ClientContacts
            .FirstOrDefaultAsync(cc => cc.ClientId == clientId && cc.ContactId == contactId);

        if (clientContact == null) return false;

        _dbContext.ClientContacts.Remove(clientContact);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<Client> CreateClientWithContactsAsync(CreateClientWithContactsDto createClientWithContactsDto)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var nextId = 1;

            if (await _dbContext.Contacts.AnyAsync())
            {
                nextId = await _dbContext.Clients.MaxAsync(c => c.Id) + 1;
            }
            
            var existingCodes = await _dbContext.Clients
                .Select(c => c.Code)
                .ToListAsync();

            var code = ClientCodeGenerator.Generate(createClientWithContactsDto.Name, existingCodes);
            
            var client = new Client(
                nextId,
                createClientWithContactsDto.Name,
                code
            );

            _dbContext.Clients.Add(client);

            if (createClientWithContactsDto.ContactIds.Count > 0 && createClientWithContactsDto.ContactIds.Any())
            {
                var contacts = await _dbContext.Contacts
                    .Where(c => createClientWithContactsDto.ContactIds.Contains(c.Id))
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

            return client;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}