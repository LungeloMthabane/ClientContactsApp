using clientContactsApp.Application.DTOs;
using clientContactsApp.Domain.Entities;

namespace clientContactsApp.Application.Interfaces;

public interface IContactRepository
{
    Task<List<ContactDto>> GetAllClients();
    Task<bool> DeleteClientContactAsync(int contactId, int clientId);
    Task<Contact> CreateContactWithClientAsync(CreateContactWithClientsDto createContactWithClientsDto);
}
