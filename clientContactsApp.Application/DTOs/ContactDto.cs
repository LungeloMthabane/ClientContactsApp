using clientContactsApp.Domain.Entities;

namespace clientContactsApp.Application.DTOs;

public class ContactDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }   
    public List<Client> Clients { get; set; }

    public ContactDto(int id, string name, string surname, string email, List<Client> clients)
    {
        Id = id;
        Name = name;
        Surname = surname;
        Email = email;
        Clients = clients;
    }
}