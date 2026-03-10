namespace clientContactsApp.Application.DTOs;

public class UpsertClientWithContactsDto
{
    public string Name { get; set; } = string.Empty;
    public List<int> ContactIds { get; set; } = new();
}