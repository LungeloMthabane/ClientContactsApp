# Client Contacts App — Setup & Run Guide

This project contains a **.NET 8 Web API backend** and a **React (JavaScript) frontend**.

---

## 1. Prerequisites

Install the following:

* .NET SDK 8+
* Node.js 18+
* npm or yarn
* (Optional) DataGrip / DB Browser for SQLite

Verify installations:

```bash
dotnet --version
node --version
npm --version
```

---

## 2. Clone Repository

```bash
git clone <repo-url>
cd clientContactsApp
```

---

## 3. Backend Setup (API)

Navigate to API project:

```bash
cd clientContactsApp.API
```

Restore packages:

```bash
dotnet restore
```

Build solution:

```bash
dotnet build
```

---

## 4. Database Setup (SQLite)

Run migrations to create the database:

```bash
dotnet ef database update \
--project ../clientContactsApp.Infrastructure \
--startup-project .
```

This will create:

```
ClientContactsDb.db
```

inside the API folder.

---

## 5. Run Backend

```bash
dotnet run
```

API will start on:

```
https://localhost:5200 
```

Swagger available at (please confirm on terminal):

```
https://localhost:5200/swagger
```

---

## 6. Frontend Setup (React)

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## 7. Configure API URL

In:

```
src/api/clientApi.js && src/api/contactApi.js
```

Ensure API URL matches backend:

```js
const API_URL = "https://localhost:5200/api/clients";
const API_URL = "https://localhost:5200/api/contacts";
```

---

## 8. Run Frontend

```bash
npm start
```

App will open at:

```
http://localhost:3000
```

---

## 9. Common Issues

### HTTPS Certificate Error

Accept the .NET dev certificate:

```bash
dotnet dev-certs https --trust
```

---

### Migration Not Found

If migrations fail:

```bash
dotnet ef migrations add InitialCreate \
--project ../clientContactsApp.Infrastructure \
--startup-project .
dotnet ef database update \
--project ../clientContactsApp.Infrastructure \
--startup-project .
```

---

## 10. Project Structure

```
clientContactsApp
 ├── clientContactsApp.API          → Controllers / Startup
 ├── clientContactsApp.Application  → Interfaces & Services
 ├── clientContactsApp.Domain       → Entities & Business Rules
 ├── clientContactsApp.Infrastructure → EF Core & Repositories
 └── frontend                       → React Frontend
```

---

## 11. Running Order

1. Start Backend

```bash
dotnet run
```

2. Start Frontend

```bash
npm start
```

---

You are now ready to use the application
