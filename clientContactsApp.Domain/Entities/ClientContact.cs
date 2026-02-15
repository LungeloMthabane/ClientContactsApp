using System.Text.Json.Serialization;

namespace clientContactsApp.Domain.Entities;

public class ClientContact
{
    public int ClientId { get; set; }
    [JsonIgnore]
    public Client Client { get; set; }
    public int ContactId { get; set; }
    [JsonIgnore]
    public Contact Contact { get; set; }
}