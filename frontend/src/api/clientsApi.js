const API_URL = 'http://localhost:5200/api/clients';

export async function getAllClients() {
    const res = await fetch(`${API_URL}/getAllClients`);

    if (!res.ok) {
        throw new Error(`Failed to fetch clients ${res}`);
    }

    return await res.json();
}

export async function deleteClientContact(clientId, contactId) {
    const res = await fetch(`${API_URL}/${clientId}/contacts/${contactId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete client-contact association");
    }
}
