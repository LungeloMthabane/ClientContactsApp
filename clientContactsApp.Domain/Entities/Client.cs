namespace clientContactsApp.Domain.Entities;

public class Client
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Code {get; private set;}
    
    public ICollection<ClientContact> ClientContacts { get; private set; } = new List<ClientContact>();

    private Client() {}

    public Client(int id, string name, string code)
    {
        Id = id;
        Name = name;
        Code = code;
    }
}