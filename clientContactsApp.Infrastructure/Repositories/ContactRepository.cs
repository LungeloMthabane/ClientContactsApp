using clientContactsApp.Application.DTOs;
using Microsoft.EntityFrameworkCore;
using clientContactsApp.Domain.Entities;
using clientContactsApp.Infrastructure.Data;
using clientContactsApp.Application.Interfaces;

namespace clientContactsApp.Infrastructure.Repositories;

public class ContactRepository : IContactRepository
{
    private readonly AppDbContext _dbContext;
    
    public ContactRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    /**
     * Function used to get all contacts
     *
     * @returns - list of contacts
    */
    public async Task<List<ContactDto>> GetAllClients()
    {
        return await _dbContext.Contacts
            .AsNoTracking()
            .Select(c => new ContactDto(
                c.Id,
                c.Name,
                c.Surname,
                c.Email,
                c.ClientContacts
                    .Select(cc => new Client(
                        cc.Client.Id,
                        cc.Client.Name,
                        cc.Client.Code))
                    .ToList()
            ))
            .ToListAsync();
    }

    /**
     * Function used to remove clientContact record
     * @param contactId The contact id
     * @param clientId The client id
     */
    public async Task<bool> DeleteClientContactAsync(int contactId, int clientId)
    {
        var clientContact = await _dbContext.ClientContacts
            .FirstOrDefaultAsync(cc => cc.ClientId == clientId && cc.ContactId == contactId);

        if (clientContact == null) return false;

        _dbContext.ClientContacts.Remove(clientContact);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    /**
     * Function used to add new contact record
     * @param createContactWithClientsDto
     */
    public async Task<(bool Success, string Message, Contact? Contact)> CreateContactWithClientAsync(CreateContactWithClientsDto createContactWithClientsDto)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            if (await _dbContext.Contacts.AnyAsync(c => c.Email.ToLower() == createContactWithClientsDto.Email.ToLower()))
            {
                return (false, $"A Contact with the email address, {createContactWithClientsDto.Email} already exists. Email address must be unique.", null);
            }

            
            var nextId = 1;

            if (await _dbContext.Contacts.AnyAsync())
            {
                nextId = await _dbContext.Contacts.MaxAsync(c => c.Id) + 1;
            }
            
            var contact = new Contact(
                nextId,
                createContactWithClientsDto.Name,
                createContactWithClientsDto.Email,
                createContactWithClientsDto.Surname);

            _dbContext.Contacts.Add(contact);

            if (createContactWithClientsDto.ClientIds.Count > 0 && createContactWithClientsDto.ClientIds.Any())
            {
                var clients = await _dbContext.Clients
                    .Where(c => createContactWithClientsDto.ClientIds.Contains(c.Id))
                    .ToListAsync();

                foreach (var client in clients)
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

            return (true, "Contact created successfully", contact);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}