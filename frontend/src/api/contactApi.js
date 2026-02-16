const API_URL = 'http://localhost:5200/api/contacts';

export async function getAllContacts() {
    const res = await fetch(`${API_URL}/getAllContacts`);

    if (!res.ok) {
        throw new Error(`Failed to fetch contacts ${res}`);
    }

    return await res.json();
}

export async function deleteClientContact(contactId, clientId) {
    const res = await fetch(`${API_URL}/${contactId}/clients/${clientId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete client-contact association");
    }
}
