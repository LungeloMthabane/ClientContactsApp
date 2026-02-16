using clientContactsApp.Application.DTOs;
using clientContactsApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using clientContactsApp.API.Responses;
using clientContactsApp.Domain.Entities;

namespace clientContactsApp.API.Controllers;

[Route("api/clients")]
public class ClientController : Controller
{
    private readonly IClientRepository _clientRepository;

    public ClientController(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    [HttpGet("getClientById/{id}")]
    public async Task<IActionResult> GetClientById(int id)
    {
        var clientDetails = await _clientRepository.GetClientById(id);

        if (clientDetails == null)
            return Ok(ApiResponse<string>.FailureResponse("Client not found"));
        
        return Ok(ApiResponse<ClientDto>.SuccessResponse(clientDetails));
    }

    [HttpGet("getAllClients")]
    public async Task<IActionResult> GetClients()
    {
        var clients = await _clientRepository.GetAllClients();
        return Ok(clients);
    }
    
    [HttpDelete("{id}/contacts/{contactId}")]
    public async Task<IActionResult> DeleteClientContact(int id, int contactId)
    {
        var deleted = await _clientRepository.DeleteClientContactAsync(id, contactId);
    
        if (!deleted)
            return NotFound();
    
        return NoContent();
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateClientWithContacts([FromBody] CreateClientWithContactsDto dto)
    {
        var result = await _clientRepository.CreateClientWithContactsAsync(dto);
        
        return !result.Success ? Ok(ApiResponse<string>.FailureResponse(result.Message)) : Ok(ApiResponse<Client>.SuccessResponse(result.Client!, result.Message));
    }
}
