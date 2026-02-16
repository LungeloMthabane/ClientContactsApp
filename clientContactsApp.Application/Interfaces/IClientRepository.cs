using clientContactsApp.Application.DTOs;
using clientContactsApp.Domain.Entities;

namespace clientContactsApp.Application.Interfaces;

public interface IClientRepository
{
   Task<ClientDto?> GetClientById(int id);
   Task<List<ClientDto>> GetAllClients();
   Task<bool> DeleteClientContactAsync(int clientId, int contactId);
   Task<Client> CreateClientWithContactsAsync(CreateClientWithContactsDto createClientWithContactsDto);
}