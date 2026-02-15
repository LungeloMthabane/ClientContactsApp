namespace clientContactsApp.Domain.Entities;

public class Contact
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Surname { get; private set; }
    public string Email { get; private set; }
    
    public ICollection<ClientContact> ClientContacts { get; private set; } = new List<ClientContact>();
    
    private Contact() {}

    public Contact(int id, string name, string email,  string surname)
    {
        Id = id;
        Name = name;
        Email = email;
        Surname = surname;
    }
}