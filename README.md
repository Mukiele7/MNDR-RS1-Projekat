# 📱 MNDR - Marketplace za Zanatske Usluge

Moderna marketplace aplikacija izgrađena sa **Clean Architecture**, **Vertical Slice Architecture** i **CQRS** obrascem. Platforma omogućava povezivanje kupaca i majstora (zanatskih radnika) za pružanje i korištenje različitih usluga.

![Status](https://img.shields.io/badge/Status-U%20Razvoju-yellow)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![.NET](https://img.shields.io/badge/.NET-10.0-purple)
![Angular](https://img.shields.io/badge/Angular-21-red)

## 🏗️ Arhitektura

### Backend (.NET 10)

Projekat koristi **Clean Architecture** sa **Vertical Slice Architecture** pristupom za application layer:

```
MNDR.Domain/           - Domain entiteti i jezgro poslovne logike
MNDR.Application/      - Vertical Slices (Modules) sa CQRS pattern-om
  └── Modules/
      ├── Auth/        - Autentifikacija (Login, Register, RefreshToken)
      ├── Oglasi/      - Upravljanje oglasima
      ├── Krediti/     - Sistem kredita
      ├── Razgovori/   - Chat i komunikacija
      ├── Ugovori/     - Upravljanje ugovorima
      ├── Recenzije/   - Ocjene i recenzije
      └── Notifikacije/ - Sistem notifikacija
MNDR.Infrastructure/   - Entity Framework Core, DbContext, JWT servisi
MNDR.API/              - ASP.NET Core Web API
MNDR.Shared/           - Dijeljeni DTOs i konstante
MNDR.Test/             - Testovi
```

**Ključne tehnologije:**
- **MediatR** - CQRS implementacija
- **FluentValidation** - Validacija ulaznih podataka
- **AutoMapper** - DTO mapiranje
- **Entity Framework Core 10** - ORM
- **ASP.NET Core Identity** - Password hashing (PBKDF2)
- **JWT** - Access i Refresh token autentifikacija

### Frontend (Angular 21)
```
src/app/
├── pages/
│   ├── landing-page/     - Početna stranica
│   ├── auth/             - Login i registracija
│   ├── oglasi/           - Pregled i pretraga oglasa
│   ├── razgovori/        - Chat interfejs
│   ├── recenzije/        - Recenzije majstora
│   ├── krediti/          - Kupovina i upravljanje kreditima
│   └── ugovori/          - Pregled ugovora
├── services/             - HTTP servisi za API komunikaciju
└── app.routes.ts         - Rutiranje
```

## 📦 Instalacija

### Preduslovi
- **.NET 10 SDK** - [Preuzmi](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 20+** - [Preuzmi](https://nodejs.org/)
- **SQL Server 2022** (ili SQL Server Express)
- **Angular CLI 21** - `npm install -g @angular/cli`

### 1. Backend Setup

```bash
# Kloniraj projekat i navigiraj do Backend foldera
cd Backend

# Instaliraj pakete
dotnet restore

# Konfiguriši connection string u appsettings.json
# (vidi sekciju "Baza podataka" ispod)

# Primijeni migracije na bazu
cd MNDR.Infrastructure
dotnet ef database update --startup-project ../MNDR.API

# Pokreni API
cd ../MNDR.API
dotnet run
```

API će biti dostupan na: **`https://localhost:7070`** ili **`http://localhost:5000`**

### 2. Frontend Setup

```bash
# Navigiraj do Frontend foldera
cd Frontend/rs1-frontend-2025-26

# Instaliraj npm pakete
npm install

# Pokreni development server
ng serve
```

Frontend će biti dostupan na: **`http://localhost:4200`**
Domenski Model

### Korisničke Uloge
- **Administrator** - Upravljanje platformom, moderiranje sadržaja
- **Majstor** - Pružalac usluga (objavljuje oglase, prima recenzije)
- **Kupac** - Tražilac usluga (pretražuje oglase, kontaktira majstore)

### Glavni Entiteti

| Entitet | Opis | Ključna Polja |
|---------|------|---------------|
| **Korisnik** | Bazni korisnik sistema | Ime, Email, Uloga, Grad, Telefon |
| **Oglas** | Oglašena usluga majstora | Naslov, Opis, Status, MajstorId, Kategorije |
| **Razgovor** | Chat komunikacija | KupacId, MajstorId, Poruke |
| **Ugovor** | Formalni ugovor za uslugu | KupacId, MajstorId, Cena, Status, OpisUsluge |
| **Recenzija** | Ocjena i feedback | Ocjena (1-5), Komentar, Datum |
| **Kredit** | Virtualna valuta | Iznos, Tip (Kupovina/Potrošnja) |
| **Badge** | Postignuća/nagrade | Naziv, Opis, Datum dodjele |
| **Notifikacija** | Obavještenja | Sadržaj, Tip, Pročitano |
| **RefreshToken** | JWT token refresh | TokenHash, ExpiresAt, Device Fingerprint |

**BaseEntity Pattern:**
Svi entiteti nasljeđuju `BaseEntity` koji pruža:
- `Id` - Jedinstveni identifikator
- `CreatedAtUtc` - Vrijeme kreiranja
- `ModifiedAtUtc` - Vrijeme zadnje izmjene
- `IsDeleted` - Soft delete flag;Database=MndrDb;...`
- SQL Server Express: `Server=localhost\\SQLEXPRESS;Database=MndrDb;...`

### Kreiranje Baze

**Opcija 1: EF Core Migracije (Preporučeno)**
```bash
cd Backend/MNDR.Infrastructure
dotnet ef database update --startup-project ../MNDR.API
```

**Opcija 2: SQL Skripta**
```sql
-- Lokacija: Database/CreateMndrDatabase.sql
-- Izvrši u SQL Server Management Studio (SSMS)
```

### Entity Framework Migracije

Kreiranje nove migracije:
```bash
cd Backend/MNDR.Infrastructure
dotnet ef migrations add NazivMigracije --startup-project ../MNDR.API
dotnet ef database update --startup-project ../MNDR.API
```

## 📊 Entiteti

### Korisničke uloge
- **Administrator** - Upravljanje platformom
- **Majstor** - Pružalac usluga (može objavljivati oglase)
- **Kupac** - Tražilac usluga (može zatražiti usluge)

### Glavni entiteti
| Entitet | Opis |
|---------|------|
| **🔐 Autentifikacija (`/api/auth`)
```http
POST   /api/auth/register          - Registracija novog korisnika
POST   /api/auth/login             - Login (vraća Access + Refresh token)
POST   /api/auth/refresh-token     - Obnavljanje access tokena
POST   /api/auth/logout            - Logout korisnika
```

### 📢 Oglasi (`/api/oglasi`)
```http
GET    /api/oglasi                 - Lista oglasa (paginacija, filtriranje)
GET    /api/oglasi/{id}            - Detalji oglasa
POST   /api/oglasi                 - Kreiranje oglasa (Majstor)
PUT    /api/oglasi/{id}            - Ažuriranje oglasa
DELETE /api/oglasi/{id}            - Brisanje oglasa
```

### 💬 Razgovori (`/api/razgovori`)
```http
GET    /api/razgovori              - Lista razgovora korisnika
GET    /api/razgovori/{id}         - Detalji razgovora sa porukama
POST   /api/razgovori              - Početak novog razgovora
POST   /api/razgovori/{id}/poruke  - Slanje poruke
```

### ⭐ Recenzije (`/api/recenzije`)
```http
GET    /api/recenzije              - Lista svih recenzija
GET    /api/recenzije/{id}         - Pojedinačna recenzija
POST   /api/recenzije              - Dodavanje recenzije
PUT    /api/recenzije/{id}         - Izmjena recenzije
DELETE /api/recenzije/{id}         - Brisanje recenzije
```

### 💰 Krediti (`/api/krediti`)
```http
GET    /api/krediti                - Historija kredita korisnika
POST   /api/krediti/kupi           - Kupovina kredita
POST   /api/krediti/potroši        - Potrošnja kredita
```

### 📄 Ugovori (`/api/ugovori`)
```http
GET    /api/ugovori                - Lista ugovora korisnika
GET    /api/ugovori/{id}           - Detalji ugovora
POST   /api/ugovori                - Kreiranje ugovora
PUT    /apiStranice
- **LandingPageComponent** - Početna stranica sa hero sekcijom
- **LoginComponent** - Prijava korisnika
- **RegisterComponent** - Registracija (Kupac/Majstor)
- **OglasiComponent** - Pretraživanje i filtriranje oglasa
- **RazgovoriComponent** - Chat interfejs za komunikaciju
- **RecenzijeComponent** - Pregled i dodavanje recenzija
- **KreditiComponent** - Kupovina i historija kredita
- **UgovoriComponent** - Upravljanje ugovorima

### Servisi
- **AuthService** - Autentifikacija (login, register, token refresh)
- **OglasService** - CRUD operacije za oglase
- **RazgovorService** - Chat funkcionalnosti
- **RecenzijaService** - Upravljanje recenzijama
- **KreditService** - Transakcije kredita

## 🔐 Autentifikacija i Sigurnost

### JWT Token Mehanizam

Sistem koristi **Access Token** i **Refresh Token** strategiju:

**Login Request:**
```json
POST /api/auth/login
{
  "email": "korisnik@example.com",
  "password": "password123",
  "deviceFingerprint": "browser_hash_optional"
}
```

**Login Response:**
```json
{
  "a✅ Implementirano

**Backend:**
- ✅ Clean Architecture + Vertical Slice Architecture
- ✅ CQRS pattern sa MediatR
- ✅ FluentValidation za sve commands
- ✅ AutoMapper za DTO transformacije
- ✅ JWT autentifikacija (Access + Refresh tokens)
- ✅ PBKDF2 password hashing (ASP.NET Core Identity)
- ✅ BaseEntity pattern (audit trail + soft delete)
- ✅ Entity Framework Core sa migracijama
- ✅ CRUD operacije za sve module
- ✅ Paginacija i filtriranje
- ✅ Exception handling middleware
- ✅ Swagger/OpenAPI dokumentacija

**Frontend:**
- ✅ Angular 21 sa Material Design
- ✅ Responjeri Korištenja

### Frontend - Autentifikacija i Token Refresh

```typescript
// Login sa device fingerprint-om
login(email: string, password: string) {
  const fingerprint = this.generateDeviceFingerprint();
  
  this.authService.login({ email, password, deviceFingerprint: fingerprint })
    .subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Login failed', err)
    });
}

// Automatsko obnavljanje tokena kada access token istekne
refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const fingerprint = this.generateDeviceFingerprint();
  
  return this.authService.refreshToken({ refreshToken, deviceFingerprint: fingerprint })
    .pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
}
```

### Backend - Vertical Slice CQRS Pattern

```csharp
// Primjer: Kreiranje oglasa

// 1. Command (Request)
public sealed class CreateOglasCommand : IRequest<CreateOglasCommandDto>
{Unit Testovi

```bash
cd Backend/MNDR.Test
dotnet test --verbosity normal
```

### Integration Testovi

```bash
# Testovi sa stvarnom bazom (in-memory)
dotnet test --filter "Category=Integration"
```

## 📚 Dokumentacija

### API Dokumentacija

Swagger UI dostupan na:
- **Development:** `https://localhost:7070/swagger`
- **OpenAPI Spec:** `https://localhost:7070/swagger/v1/swagger.json`

### Dodatna Dokumentacija

- `STRUKTURA.md` - Detaljna struktura projekta
- `Database/CreateMndrDatabase.sql` - SQL skripta za kreiranje baze
- `Dokumenti/` - Dodatna tehnička dokumentacija
    {
        RuleFor(x => x.Naslov).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Opis).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.MajstorId).GreaterThan(0);
    }
}

// 3. Handler
public class CreateOglasCommandHandler : IRequestHandler<CreateOglasCommand, CreateOglasCommandDto>
{
    private readonly IAppDbContext _context;
    
    public async Task<CreateOglasCommandDto> Handle(
        CreateOglasCommand request, 
        CancellationToken cancellationToken)
    {
        // Biznis logika
        var oglas = new Oglas
        {
            Naslov = request.Naslov,
            Opis = request.Opis,
            MajstorId = request.MajstorId,
            Status = "Aktivan"
        };
        
        _context.Oglasi.Add(oglas);
        await _context.SaveChangesAsync(cancellationToken);
        
        return new CreateOglasCommandDto { OglasId = oglas.OglasId };
    }
}

// 4. Controller - samo poziva mediator
[HttpPost]
public async Task<ActionResult<CreateOglasCommandDto>> CreateOglas(
    [FromBody] CreateOglasCommand command)
{
    var result = await _mediator.Send(command);
    return Ok(result);
}
- **CreateServiceWizardComponent** - 3-step forma za kreiranje usluge

## 🔐 Autentifikacija

### Login (Privremeni - bez JWT)
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register
```bash
POST /api/auth/register
{
  "email": "newuser@example.com",
  "password": "password123",
  "ime": "Ime",
  "prezime": "Prezime",
  "uloga": "Kupac" // ili "Majstor"
}
```

## ✨ Funkcionalnosti

### Implementirane
✅ Kompletan CRUD za sve entitete  
✅ Paginacija i filtriranje  
✅ CQRS sa MediatR  
✅ Validacija sa FluentValidation  
✅ AutoMapper za DTO mapiranje  
✅ Material Design UI  
✅ Responsive layout  
✅ Async/await kod  

### 🚧 Planirano

- ⏳ Real-time chat (SignalR)
- ⏳ File upload za slike oglasa
- ⏳ Napredna pretraga i filteri
- ⏳ Email notifikacije
- ⏳ Payment integracija
- ⏳ Push notifikacije
- ⏳ Admin dashboard
- ⏳ Report sistem
- ⏳ Analytics

## 📝 Primjeri Korištenja

### Frontend - Autentifikacija i Token Refresh

```typescript
// Login sa device fingerprint-om
login(email: string, password: string) {
  const fingerprint = this.generateDeviceFingerprint();
  
  this.authService.login({ email, password, deviceFingerprint: fingerprint })
    .subscribe({
      next: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Login failed', err)
    });
}

// Automatsko obnavljanje tokena kada access token istekne
refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const fingerprint = this.generateDeviceFingerprint();
  
  return this.authService.refreshToken({ refreshToken, deviceFingerprint: fingerprint })
    .pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
}
```

### Backend - Vertical Slice CQRS Pattern

```csharp
// Primjer: Kreiranje oglasa

// 1. Command (Request)
public sealed class CreateOglasCommand : IRequest<CreateOglasCommandDto>
{
    public required string Naslov { get; init; }
    public required string Opis { get; init; }
    public required int MajstorId { get; init; }
    public List<int> KategorijeIds { get; init; } = new();
}

// 2. Validator
public class CreateOglasCommandValidator : AbstractValidator<CreateOglasCommand>
{
    public CreateOglasCommandValidator()
    {
        RuleFor(x => x.Naslov).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Opis).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.MajstorId).GreaterThan(0);
    }
}

// 3. Handler
public class CreateOglasCommandHandler : IRequestHandler<CreateOglasCommand, CreateOglasCommandDto>
{
    private readonly IAppDbContext _context;
    
    public async Task<CreateOglasCommandDto> Handle(
        CreateOglasCommand request, 
        CancellationToken cancellationToken)
    {
        // Biznis logika
        var oglas = new Oglas
        {
            Naslov = request.Naslov,
            Opis = request.Opis,
            MajstorId = request.MajstorId,
            Status = "Aktivan"
        };
        
        _context.Oglasi.Add(oglas);
        await _context.SaveChangesAsync(cancellationToken);
        
        return new CreateOglasCommandDto { OglasId = oglas.OglasId };
    }
}

// 4. Controller - samo poziva mediator
[HttpPost]
public async Task<ActionResult<CreateOglasCommandDto>> CreateOglas(
    [FromBody] CreateOglasCommand command)
{
    var result = await _mediator.Send(command);
    return Ok(result);
}
```

## 🧪 Testiranje

### Unit Testovi

```bash
cd Backend/MNDR.Test
dotnet test --verbosity normal
```

### Integration Testovi

```bash
# Testovi sa stvarnom bazom (in-memory)
dotnet test --filter "Category=Integration"
```

## 📚 Dokumentacija

### API Dokumentacija

Swagger UI dostupan na:
- **Development:** `https://localhost:7070/swagger`
- **OpenAPI Spec:** `https://localhost:7070/swagger/v1/swagger.json`

### Dodatna Dokumentacija

- `STRUKTURA.md` - Detaljna struktura projekta
- `Database/CreateMndrDatabase.sql` - SQL skripta za kreiranje baze
- `Dokumenti/` - Dodatna tehnička dokumentacija

## 🛠️ Tehnologije

### Backend Stack
| Tehnologija | Verzija | Namjena |
|-------------|---------|---------|
| .NET | 10.0 | Runtime framework |
| ASP.NET Core | 10.0 | Web API framework |
| Entity Framework Core | 10.0 | ORM (Object-Relational Mapping) |
| MediatR | 12.x | CQRS implementacija |
| FluentValidation | 11.x | Input validacija |
| AutoMapper | 12.x | Object mapping |
| ASP.NET Core Identity | 10.0 | Password hashing (PBKDF2) |
| JWT Bearer | 10.0 | Token autentifikacija |
| Swashbuckle | 6.x | OpenAPI/Swagger dokumentacija |

### Frontend Stack
| Tehnologija | Verzija | Namjena |
|-------------|---------|---------|
| Angular | 21 | Frontend framework |
| Angular Material | 21 | UI komponente |
| TypeScript | 5.6+ | Programski jezik |
| RxJS | 7.x | Reactive programming |
| SCSS | - | Stilizacija |

### Baza Podataka
- **SQL Server 2022** (ili 2019+)
- **Entity Framework Core Migrations** - Schema management

### Development Tools
- Visual Studio Code / Visual Studio 2022
- SQL Server Management Studio (SSMS)
- Postman (API testiranje)
- Git

## 🤝 Doprinos

Za doprinos projektu:
1. Forkuj repo
2. Kreiraj feature branch (`git checkout -b feature/NovaFunkcionalnost`)
3. Commituj izmjene (`git commit -m 'Dodavanje nove funkcionalnosti'`)
4. Push na branch (`git push origin feature/NovaFunkcionalnost`)
5. Otvori Pull Request

## 📄 Licenca

Ovaj projekat je razvijen u akademske svrhe.

## 👨‍💻 Autor

Razvijeno kao dio studijskog projekta.

## 📞 Kontakt

Za pitanja i sugestije, kontaktirajte razvojni tim.

---

**Napomena:** Projekat je u aktivnom razvoju. Nove funkcionalnosti se dodaju redovno.
