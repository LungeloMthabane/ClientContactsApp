namespace clientContactsApp.Application.DTOs;

public class CreateClientWithContactsDto
{
    public string Name { get; set; } = string.Empty;
    public List<int> ContactIds { get; set; } = new();
}