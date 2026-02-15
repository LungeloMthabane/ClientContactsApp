using clientContactsApp.Application.DTOs;

namespace clientContactsApp.Application.Interfaces;

public interface IContactRepository
{
    Task<List<ContactDto>> GetAllClients();
    Task<bool> DeleteClientContactAsync(int contactId, int clientId);
}
