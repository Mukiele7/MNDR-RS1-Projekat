-- ============================================================================
-- MNDR Marketplace Database Setup
-- SQL Server 2022
-- ============================================================================

-- Provera postojanja baze
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'MNDR')
BEGIN
    ALTER DATABASE MNDR SET SINGLE_USER WITH ROLLBACK IMMEDIATE
    DROP DATABASE MNDR
END

-- Kreiranje baze podataka
CREATE DATABASE MNDR
GO

USE MNDR
GO

-- ============================================================================
-- 1. TABELA: Korisnik (bazna tabela za sve korisnike)
-- ============================================================================
CREATE TABLE Korisnik (
    KorisnikId INT IDENTITY(1,1) PRIMARY KEY,
    Ime NVARCHAR(100) NOT NULL,
    Prezime NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Lozinka NVARCHAR(255) NOT NULL,
    Telefon NVARCHAR(20),
    Adresa NVARCHAR(255),
    Grad NVARCHAR(100),
    DatumRegistracije DATETIME DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) DEFAULT 'Aktivan',
    Slika NVARCHAR(MAX),
    INDEX IX_Email (Email),
    INDEX IX_Status (Status)
)

-- ============================================================================
-- 2. TABELE: Nasleđivanje (Administrator, Kupac, Majstor)
-- ============================================================================
CREATE TABLE Administrator (
    AdministratorId INT PRIMARY KEY,
    KorisnikId INT NOT NULL UNIQUE,
    NivoDozvola INT DEFAULT 1,
    DatumPromoције DATETIME,
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId) ON DELETE CASCADE
)

CREATE TABLE Kupac (
    KupacId INT PRIMARY KEY,
    KorisnikId INT NOT NULL UNIQUE,
    DatumOd DATETIME DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) DEFAULT 'Aktivan',
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId) ON DELETE CASCADE
)

CREATE TABLE Majstor (
    MajstorId INT PRIMARY KEY,
    KorisnikId INT NOT NULL UNIQUE,
    Sertifikati NVARCHAR(MAX),
    GodinasnjuIskustvo INT DEFAULT 0,
    ProveroKorisnicima NVARCHAR(MAX),
    Verifikovan BIT DEFAULT 0,
    DatumVerifikacije DATETIME,
    Status NVARCHAR(20) DEFAULT 'Aktivan',
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId) ON DELETE CASCADE,
    INDEX IX_Verifikovan (Verifikovan)
)

-- ============================================================================
-- 3. TABELA: Badge (Gamifikacija)
-- ============================================================================
CREATE TABLE Badge (
    BadgeId INT IDENTITY(1,1) PRIMARY KEY,
    Naziv NVARCHAR(100) NOT NULL,
    Opis NVARCHAR(500),
    Ikonica NVARCHAR(50),
    UslovZaDobijanje NVARCHAR(500)
)

-- ============================================================================
-- 4. TABELA: BadgeNagrada (Veza između Majstora i Badge)
-- ============================================================================
CREATE TABLE BadgeNagrada (
    BadgeNagradaId INT IDENTITY(1,1) PRIMARY KEY,
    MajstorId INT NOT NULL,
    BadgeId INT NOT NULL,
    DatumDobijanja DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (MajstorId) REFERENCES Majstor(MajstorId) ON DELETE CASCADE,
    FOREIGN KEY (BadgeId) REFERENCES Badge(BadgeId),
    UNIQUE(MajstorId, BadgeId),
    INDEX IX_MajstorId (MajstorId)
)

-- ============================================================================
-- 5. TABELA: Kategorija
-- ============================================================================
CREATE TABLE Kategorija (
    KategorijaId INT IDENTITY(1,1) PRIMARY KEY,
    Naziv NVARCHAR(100) NOT NULL UNIQUE,
    Opis NVARCHAR(500),
    Ikonica NVARCHAR(50)
)

-- ============================================================================
-- 6. TABELA: Oglas (Oglašavane usluge)
-- ============================================================================
CREATE TABLE Oglas (
    OglasId INT IDENTITY(1,1) PRIMARY KEY,
    MajstorId INT NOT NULL,
    Naslov NVARCHAR(200) NOT NULL,
    Opis NVARCHAR(1000) NOT NULL,
    DatumObjave DATETIME DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) DEFAULT 'Aktivan',
    FOREIGN KEY (MajstorId) REFERENCES Majstor(MajstorId) ON DELETE CASCADE,
    INDEX IX_MajstorId (MajstorId),
    INDEX IX_Status (Status)
)

-- ============================================================================
-- 7. TABELA: OglasKategorija (Veza između Oglasa i Kategorija)
-- ============================================================================
CREATE TABLE OglasKategorija (
    OglasKategorijaId INT IDENTITY(1,1) PRIMARY KEY,
    OglasId INT NOT NULL,
    KategorijaId INT NOT NULL,
    FOREIGN KEY (OglasId) REFERENCES Oglas(OglasId) ON DELETE CASCADE,
    FOREIGN KEY (KategorijaId) REFERENCES Kategorija(KategorijaId),
    UNIQUE(OglasId, KategorijaId),
    INDEX IX_OglasId (OglasId)
)

-- ============================================================================
-- 8. TABELA: Razgovor (Komunikacija između Kupca i Majstora)
-- ============================================================================
CREATE TABLE Razgovor (
    RazgovorId INT IDENTITY(1,1) PRIMARY KEY,
    KupacId INT NOT NULL,
    MajstorId INT NOT NULL,
    OglasId INT NOT NULL,
    DatumKreiranja DATETIME DEFAULT GETUTCDATE(),
    DatumUpdate DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (KupacId) REFERENCES Kupac(KupacId) ON DELETE CASCADE,
    FOREIGN KEY (MajstorId) REFERENCES Majstor(MajstorId) ON DELETE CASCADE,
    FOREIGN KEY (OglasId) REFERENCES Oglas(OglasId),
    INDEX IX_KupacId (KupacId),
    INDEX IX_MajstorId (MajstorId)
)

-- ============================================================================
-- 9. TABELA: RazgovorPoruka (Poruke u razgovoru)
-- ============================================================================
CREATE TABLE RazgovorPoruka (
    RazgovorPorukaId INT IDENTITY(1,1) PRIMARY KEY,
    RazgovorId INT NOT NULL,
    PosiljaocId INT NOT NULL,
    Sadrzaj NVARCHAR(1000) NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Poslana',
    VrijemeSlanja DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (RazgovorId) REFERENCES Razgovor(RazgovorId) ON DELETE CASCADE,
    FOREIGN KEY (PosiljaocId) REFERENCES Korisnik(KorisnikId),
    INDEX IX_RazgovorId (RazgovorId),
    INDEX IX_VrijemeSlanja (VrijemeSlanja)
)

-- ============================================================================
-- 10. TABELA: Ugovor (Ugovori između Kupca i Majstora)
-- ============================================================================
CREATE TABLE Ugovor (
    UgovorId INT IDENTITY(1,1) PRIMARY KEY,
    KupacId INT NOT NULL,
    OglasId INT NOT NULL,
    DatumOd DATETIME NOT NULL,
    DatumDo DATETIME NOT NULL,
    Cena DECIMAL(10, 2) NOT NULL,
    Opis NVARCHAR(1000),
    Status NVARCHAR(20) DEFAULT 'Aktivan',
    DatumKreiranja DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (KupacId) REFERENCES Kupac(KupacId) ON DELETE CASCADE,
    FOREIGN KEY (OglasId) REFERENCES Oglas(OglasId),
    INDEX IX_KupacId (KupacId),
    INDEX IX_Status (Status)
)

-- ============================================================================
-- 11. TABELA: Recenzija (Ocene i povratne informacije)
-- ============================================================================
CREATE TABLE Recenzija (
    RecenzijaId INT IDENTITY(1,1) PRIMARY KEY,
    UgovorId INT NOT NULL,
    MajstorId INT NOT NULL,
    KupacId INT NOT NULL,
    Ocena INT NOT NULL CHECK (Ocena >= 1 AND Ocena <= 5),
    Komentar NVARCHAR(1000),
    DatumRecenzije DATETIME DEFAULT GETUTCDATE(),
    FOREIGN KEY (UgovorId) REFERENCES Ugovor(UgovorId),
    FOREIGN KEY (MajstorId) REFERENCES Majstor(MajstorId) ON DELETE CASCADE,
    FOREIGN KEY (KupacId) REFERENCES Kupac(KupacId) ON DELETE CASCADE,
    INDEX IX_MajstorId (MajstorId)
)

-- ============================================================================
-- 12. TABELA: Kredit (Virtualna valuta)
-- ============================================================================
CREATE TABLE Kredit (
    KreditId INT IDENTITY(1,1) PRIMARY KEY,
    KorisnikId INT NOT NULL,
    Kolicina DECIMAL(10, 2) NOT NULL,
    Tip NVARCHAR(50) NOT NULL, -- 'Uplata' ili 'Trošak'
    DatumTransakcije DATETIME DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) DEFAULT 'Završena',
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId) ON DELETE CASCADE,
    INDEX IX_KorisnikId (KorisnikId),
    INDEX IX_DatumTransakcije (DatumTransakcije)
)

-- ============================================================================
-- 13. TABELA: Notifikacija (Obaveštenja za korisnike)
-- ============================================================================
CREATE TABLE Notifikacija (
    NotifikacijaId INT IDENTITY(1,1) PRIMARY KEY,
    KorisnikId INT NOT NULL,
    Naslov NVARCHAR(200) NOT NULL,
    Poruka NVARCHAR(1000) NOT NULL,
    Tip NVARCHAR(50), -- 'Poruka', 'Oglas', 'Ugovor', itd.
    DatumSlanja DATETIME DEFAULT GETUTCDATE(),
    Procitana BIT DEFAULT 0,
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId) ON DELETE CASCADE,
    INDEX IX_KorisnikId (KorisnikId),
    INDEX IX_Procitana (Procitana)
)

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Dodavanje test korisnika
INSERT INTO Korisnik (Ime, Prezime, Email, Lozinka, Telefon, Grad, Adresa)
VALUES 
    ('Marko', 'Marković', 'marko@example.com', 'hashed_password_1', '0611234567', 'Beograd', 'Knez Mihajlova 1'),
    ('Petar', 'Petrović', 'petar@example.com', 'hashed_password_2', '0612345678', 'Beograd', 'Brankova 2'),
    ('Ana', 'Anić', 'ana@example.com', 'hashed_password_3', '0613456789', 'Novi Sad', 'Danube 3');

-- Dodavanje Majstora
INSERT INTO Majstor (MajstorId, KorisnikId, GodinasnjuIskustvo, Verifikovan)
VALUES 
    (1, 1, 5, 1),
    (2, 2, 3, 1);

-- Dodavanje Kupca
INSERT INTO Kupac (KupacId, KorisnikId)
VALUES 
    (1, 3);

-- Dodavanje Kategorija
INSERT INTO Kategorija (Naziv, Opis, Ikonica)
VALUES 
    ('Računari', 'Popravka i održavanje računara', 'computer'),
    ('Elektrika', 'Elektroinstalacije i popravke', 'bolt'),
    ('Voda', 'Instalacije vodovodnih sistema', 'plumbing'),
    ('Preuređenje', 'Unutrašnje i spoljašnje preuređenje', 'paint');

-- Dodavanje Oglasa
INSERT INTO Oglas (MajstorId, Naslov, Opis, Status)
VALUES 
    (1, 'Popravka računara', 'Brza i kvalitetna popravka svih vrsta računara', 'Aktivan'),
    (2, 'Elektroinstalacije', 'Profesionalne elektroinstalacije sa garantijom', 'Aktivan');

-- Dodavanje OglasKategorija
INSERT INTO OglasKategorija (OglasId, KategorijaId)
VALUES 
    (1, 1),
    (2, 2);

-- Dodavanje Razgovora
INSERT INTO Razgovor (KupacId, MajstorId, OglasId)
VALUES 
    (1, 1, 1);

-- Dodavanje Poruka
INSERT INTO RazgovorPoruka (RazgovorId, PosiljaocId, Sadrzaj)
VALUES 
    (1, 3, 'Pozdrav! Zanima me vaša usluga popravke računara.'),
    (1, 1, 'Zdravo! Slobodan sam sutra. Koja je cena?');

-- Dodavanje Kredita
INSERT INTO Kredit (KorisnikId, Kolicina, Tip)
VALUES 
    (3, 100.00, 'Uplata'),
    (1, 50.00, 'Uplata');

-- Dodavanje Ugovora
INSERT INTO Ugovor (KupacId, OglasId, DatumOd, DatumDo, Cena, Status)
VALUES 
    (1, 1, '2024-01-16 09:00:00', '2024-01-16 17:00:00', 50.00, 'Aktivan');

-- Dodavanje Recenzija
INSERT INTO Recenzija (UgovorId, MajstorId, KupacId, Ocena, Komentar)
VALUES 
    (1, 1, 1, 5, 'Odličan rad! Sve je rađeno brzo i profesionalno. Preporučujem!');

-- Dodavanje Badge-eva
INSERT INTO Badge (Naziv, Opis, Ikonica)
VALUES 
    ('Super Majstor', 'Usluga obavljena sa 5 zvezdica', 'star'),
    ('Brz Odgovor', 'Odgovorio u roku od 1 sata', 'timer');

-- Dodavanje BadgeNagrada
INSERT INTO BadgeNagrada (MajstorId, BadgeId)
VALUES 
    (1, 1),
    (1, 2);

-- Dodavanje Notifikacija
INSERT INTO Notifikacija (KorisnikId, Naslov, Poruka, Tip)
VALUES 
    (1, 'Nova poruka', 'Petar je poslao poruku', 'Poruka'),
    (3, 'Oglas objavljen', 'Vaš oglas je uspešno objavljen', 'Oglas');

-- ============================================================================
-- INDEKSI ZA PERFORMANSE
-- ============================================================================

CREATE INDEX IX_Korisnik_Email_Status ON Korisnik(Email, Status)
CREATE INDEX IX_Oglas_MajstorId_Status ON Oglas(MajstorId, Status)
CREATE INDEX IX_Razgovor_DatumUpdate ON Razgovor(DatumUpdate)
CREATE INDEX IX_Recenzija_MajstorId_Ocena ON Recenzija(MajstorId, Ocena)
CREATE INDEX IX_Kredit_KorisnikId_Datum ON Kredit(KorisnikId, DatumTransakcije)

-- ============================================================================
-- CONFIRMATION
-- ============================================================================
PRINT '==========================================='
PRINT 'MNDR Database Setup Completed Successfully'
PRINT '==========================================='
PRINT 'Total Tables: 13'
PRINT 'Sample Data Inserted'
PRINT 'Ready for Application Use'
GO
