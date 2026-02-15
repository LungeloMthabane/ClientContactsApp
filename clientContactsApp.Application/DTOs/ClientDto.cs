using clientContactsApp.Domain.Entities;


namespace clientContactsApp.Application.DTOs;

public class ClientDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public string Code { get; set; }
    
    public List<Contact>  Contacts { get; set; }

    public ClientDto(int id, string name, string code, List<Contact> contacts)
    {
        Id = id;
        Name = name;
        Code = code;
        Contacts = contacts;
    }
}