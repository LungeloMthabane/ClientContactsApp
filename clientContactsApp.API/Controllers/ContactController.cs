using clientContactsApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace clientContactsApp.API.Controllers;

[Route("api/contacts")]
public class ContactController : Controller
{
    private readonly IContactRepository _contactRepository;

    public ContactController(IContactRepository contactRepository)
    {
        _contactRepository = contactRepository;
    }
    
    [HttpGet("getAllContacts")]
    public async Task<IActionResult> GetClients()
    {
        var contacts = await _contactRepository.GetAllClients();
        return Ok(contacts);
    }
    
    [HttpDelete("{id}/clients/{clientId}")]
    public async Task<IActionResult> DeleteClientContact(int id, int clientId)
    {
        var deleted = await _contactRepository.DeleteClientContactAsync(id, clientId);
    
        if (!deleted)
            return NotFound();
    
        return NoContent();
    }
}