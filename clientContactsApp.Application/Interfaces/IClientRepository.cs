using clientContactsApp.Application.DTOs;
using clientContactsApp.Domain.Entities;

namespace clientContactsApp.Application.Interfaces;

public interface IClientRepository
{
   Task<ClientDto?> GetClientById(int id);
   Task<List<ClientDto>> GetAllClients();
   Task<bool> DeleteClientContactAsync(int clientId, int contactId);
   Task<(bool Success, string Message, Client? Client)> CreateClientWithContactsAsync(UpsertClientWithContactsDto upsertClientWithContactsDto);
   Task<(bool Success, string Message, Client? Client)> UpdateClientAsync(int id, 
      UpsertClientWithContactsDto upsertClientWithContactsDto);
}