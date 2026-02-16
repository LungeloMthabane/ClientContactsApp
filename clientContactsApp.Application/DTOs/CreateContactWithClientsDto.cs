namespace clientContactsApp.Application.DTOs;

public class CreateContactWithClientsDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<int> ClientIds { get; set; } = new();
}