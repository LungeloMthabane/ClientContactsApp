using clientContactsApp.Application.DTOs;
using Microsoft.EntityFrameworkCore;
using clientContactsApp.Domain.Entities;
using clientContactsApp.Infrastructure.Data;
using clientContactsApp.Application.Interfaces;

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
            .OrderBy(c => c.Name)
            .ToListAsync();
    }
    
    /**
     * 
     */
    public Task AddClient(Client client)
    {
        
        
        throw new NotImplementedException();
    }
    
    /**
     * 
     */
    public void UpdateClient(Client client)
    {
        throw new NotImplementedException();
    }
    
    /**
     * 
     */
    public async Task SaveChangesAsync()
    {
        await  _dbContext.SaveChangesAsync();
    }
}