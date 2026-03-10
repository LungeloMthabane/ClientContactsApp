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
    public async Task<(bool Success, string Message, Contact? Contact)> CreateContactWithClientAsync(UpsertContactWithClientsDto upsertContactWithClientsDto)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            if (await _dbContext.Contacts.AnyAsync(c => c.Email.ToLower() == upsertContactWithClientsDto.Email.ToLower()))
            {
                return (false, $"A Contact with the email address, {upsertContactWithClientsDto.Email} already exists. Email address must be unique.", null);
            }

            
            var nextId = 1;

            if (await _dbContext.Contacts.AnyAsync())
            {
                nextId = await _dbContext.Contacts.MaxAsync(c => c.Id) + 1;
            }
            
            var contact = new Contact(
                nextId,
                upsertContactWithClientsDto.Name,
                upsertContactWithClientsDto.Email,
                upsertContactWithClientsDto.Surname);

            _dbContext.Contacts.Add(contact);

            if (upsertContactWithClientsDto.ClientIds.Count > 0 && upsertContactWithClientsDto.ClientIds.Any())
            {
                var clients = await _dbContext.Clients
                    .Where(c => upsertContactWithClientsDto.ClientIds.Contains(c.Id))
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

    /**
     * 
     */
    public async Task<(bool Success, string Message, Contact? Contact)> UpdateContactAsync(int id, UpsertContactWithClientsDto upsertContactWithClientsDto)
    {
        using var transaction = await _dbContext.Database.BeginTransactionAsync();

        try
        {
            var contact = await _dbContext.Contacts
                .Include(x => x.ClientContacts)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
            {
                return (false, "Contact not found", null);
            }
            
            var contactEmailExists = await _dbContext.Contacts.AnyAsync(c => c.Email.ToLower() == upsertContactWithClientsDto.Email.ToLower() 
                                                                             && c.Id != id);

            if (contactEmailExists)
            {
                return (false,
                    $"A Contact with the email address, {upsertContactWithClientsDto.Email} already exists. Email address must be unique.",
                    null);
            }
            
            contact.UpdateContactDetails(upsertContactWithClientsDto.Name, upsertContactWithClientsDto.Surname, upsertContactWithClientsDto.Email);
            
            var existingClientIds = contact.ClientContacts
                .Where(x => x.ContactId == contact.Id)
                .Select(cc => cc.ClientId)
                .ToList();
            
            var clientsToAdd = upsertContactWithClientsDto.ClientIds
                .Where(id => !existingClientIds.Contains(id))
                .ToList();
            
            foreach (var clientId in clientsToAdd)
            {
                contact.ClientContacts.Add(new ClientContact
                {
                    ClientId = clientId,
                    ContactId = contact.Id
                });
            }
            
            _dbContext.Contacts.Update(contact);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
            
            return (true, "Contact updated successfully", contact);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}