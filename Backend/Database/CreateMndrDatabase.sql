USE master;
GO

-- Drop database if exists
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'MNDRDB')
BEGIN
    ALTER DATABASE MNDRDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE MNDRDB;
END
GO

CREATE DATABASE MNDRDB;
GO

USE MNDRDB;
GO

-- 1. Korisnik (Base table for users)
CREATE TABLE Korisnik (
    KorisnikId INT PRIMARY KEY IDENTITY(1,1),
    Ime NVARCHAR(50) NOT NULL,
    Prezime NVARCHAR(50) NOT NULL,
    KorisnikoIme NVARCHAR(MAX) NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Lozinka NVARCHAR(255) NOT NULL,
    Telefon NVARCHAR(20) NOT NULL,
    Uloga NVARCHAR(20) NOT NULL,
    DatumRegistracije DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    Grad NVARCHAR(50) NULL,
    Opcina NVARCHAR(50) NULL,
    OpisProfila NVARCHAR(500) NULL,
    SlikaProfila NVARCHAR(255) NULL
);

-- 2. Administrator
CREATE TABLE Administrator (
    AdministratorId INT PRIMARY KEY IDENTITY(1,1),
    NivoPristupa NVARCHAR(50) NOT NULL,
    KorisnikId INT NOT NULL,
    DatumDodavanja DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    Aktivan BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId)
);

-- 3. Kupac (inherits from Korisnik)
CREATE TABLE Kupac (
    KorisnikId INT PRIMARY KEY,
    BrojNarudzbi INT NOT NULL DEFAULT 0,
    OcjenaPouzdanosti DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId)
);

-- 4. Majstor (inherits from Korisnik)
CREATE TABLE Majstor (
    KorisnikId INT PRIMARY KEY,
    DetaljanOpisProfila NVARCHAR(500) NULL,
    GodineIskustva INT NOT NULL DEFAULT 0,
    ProsjecnaOcjena DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    BrojZavrsenihPoslova INT NOT NULL DEFAULT 0,
    Specijalizacija NVARCHAR(100) NOT NULL,
    CijenaMjesecne DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId)
);

-- 5. Badge
CREATE TABLE Badge (
    BadgeId INT PRIMARY KEY IDENTITY(1,1),
    Naziv NVARCHAR(100) NOT NULL,
    Opis NVARCHAR(300) NULL,
    DatumDodjele DATETIME2(7) NOT NULL DEFAULT GETUTCDATE()
);

-- 6. BadgeNagrada (Junction table)
CREATE TABLE BadgeNagrada (
    BadgeNagradaId INT PRIMARY KEY IDENTITY(1,1),
    BadgeId INT NOT NULL,
    MajstorId INT NOT NULL,
    DatumDodjele DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (BadgeId) REFERENCES Badge(BadgeId),
    FOREIGN KEY (MajstorId) REFERENCES Majstor(KorisnikId)
);

-- 7. Kategorija
CREATE TABLE Kategorija (
    KategorijaId INT PRIMARY KEY IDENTITY(1,1),
    Naziv NVARCHAR(100) NOT NULL,
    Opis NVARCHAR(300) NULL
);

-- 8. Kredit (TransactionCredit)
CREATE TABLE Kredit (
    TransakcijaKreditaId INT PRIMARY KEY IDENTITY(1,1),
    MajstorId INT NOT NULL,
    Iznos DECIMAL(10,2) NOT NULL,
    BrojKupljenihKredita INT NOT NULL,
    DatumTransakcija DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    NacinPlacanja NVARCHAR(50) NOT NULL,
    StatusTransakcije NVARCHAR(20) NOT NULL,
    FOREIGN KEY (MajstorId) REFERENCES Majstor(KorisnikId)
);

-- 9. Oglas (Advertisement)
CREATE TABLE Oglas (
    OglasId INT PRIMARY KEY IDENTITY(1,1),
    MajstorId INT NOT NULL,
    Naslov NVARCHAR(200) NOT NULL,
    Opis NVARCHAR(1000) NOT NULL,
    DatumObjave DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) NOT NULL,
    FOREIGN KEY (MajstorId) REFERENCES Majstor(KorisnikId)
);

-- 10. OglasKategorija (Junction table)
CREATE TABLE OglasKategorija (
    OglasKategorijaId INT PRIMARY KEY IDENTITY(1,1),
    OglasId INT NOT NULL,
    KategorijaId INT NOT NULL,
    FOREIGN KEY (OglasId) REFERENCES Oglas(OglasId),
    FOREIGN KEY (KategorijaId) REFERENCES Kategorija(KategorijaId)
);

-- 11. Razgovor (Conversation)
CREATE TABLE Razgovor (
    RazgovorId INT PRIMARY KEY IDENTITY(1,1),
    KupacId INT NOT NULL,
    MajstorId INT NOT NULL,
    OglasId INT NOT NULL,
    DatumKreiranja DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    DatumUpdate DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    DatumZavrsetka DATETIME2(7) NULL,
    FOREIGN KEY (KupacId) REFERENCES Kupac(KorisnikId),
    FOREIGN KEY (MajstorId) REFERENCES Majstor(KorisnikId),
    FOREIGN KEY (OglasId) REFERENCES Oglas(OglasId)
);

-- 12. RazgovorPoruka (Conversation Message)
CREATE TABLE RazgovorPoruka (
    RazgovorPorukaId INT PRIMARY KEY IDENTITY(1,1),
    RazgovorId INT NOT NULL,
    PosiljaocId INT NOT NULL,
    Sadrzaj NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    VrijemeSlanja DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (RazgovorId) REFERENCES Razgovor(RazgovorId),
    FOREIGN KEY (PosiljaocId) REFERENCES Korisnik(KorisnikId)
);

-- 13. Ugovor (Contract)
CREATE TABLE Ugovor (
    UgovorId INT PRIMARY KEY IDENTITY(1,1),
    OglasId INT NOT NULL,
    KupacId INT NOT NULL,
    DatumSklapanja DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    Status NVARCHAR(20) NOT NULL,
    OpisPosla NVARCHAR(1000) NULL,
    FOREIGN KEY (OglasId) REFERENCES Oglas(OglasId),
    FOREIGN KEY (KupacId) REFERENCES Kupac(KorisnikId)
);

-- 14. Recenzija (Review)
CREATE TABLE Recenzija (
    RecenzijaId INT PRIMARY KEY IDENTITY(1,1),
    UgovorId INT NOT NULL,
    Ocjena INT NOT NULL,
    Komentar NVARCHAR(1000) NULL,
    DatumRecenzije DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (UgovorId) REFERENCES Ugovor(UgovorId)
);

-- 15. Notifikacija (Notification)
CREATE TABLE Notifikacija (
    NotifikacijaId INT PRIMARY KEY IDENTITY(1,1),
    KorisnikId INT NOT NULL,
    Sadrzaj NVARCHAR(500) NOT NULL,
    TipNotifikacije NVARCHAR(50) NOT NULL,
    Procitano BIT NOT NULL DEFAULT 0,
    DatumSlanja DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    FOREIGN KEY (KorisnikId) REFERENCES Korisnik(KorisnikId)
);

-- Create Indexes for better performance
CREATE INDEX IX_Korisnik_Email ON Korisnik(Email);
CREATE INDEX IX_Korisnik_Uloga ON Korisnik(Uloga);
CREATE INDEX IX_Administrator_KorisnikId ON Administrator(KorisnikId);
CREATE INDEX IX_BadgeNagrada_MajstorId ON BadgeNagrada(MajstorId);
CREATE INDEX IX_Kredit_MajstorId ON Kredit(MajstorId);
CREATE INDEX IX_Oglas_MajstorId ON Oglas(MajstorId);
CREATE INDEX IX_Oglas_Status ON Oglas(Status);
CREATE INDEX IX_Razgovor_KupacId ON Razgovor(KupacId);
CREATE INDEX IX_Razgovor_MajstorId ON Razgovor(MajstorId);
CREATE INDEX IX_RazgovorPoruka_RazgovorId ON RazgovorPoruka(RazgovorId);
CREATE INDEX IX_Ugovor_OglasId ON Ugovor(OglasId);
CREATE INDEX IX_Ugovor_KupacId ON Ugovor(KupacId);
CREATE INDEX IX_Ugovor_Status ON Ugovor(Status);
CREATE INDEX IX_Notifikacija_KorisnikId ON Notifikacija(KorisnikId);
CREATE INDEX IX_Notifikacija_Procitano ON Notifikacija(Procitano);

-- Insert sample data
-- Test credentials:
--   Majstor: petar@mail.com / Petar123
--   Majstor: marko@mail.com / Marko123
--   Kupac:   ana@mail.com   / Ana123
--   Admin:   admin@test.com / Admin123
INSERT INTO Korisnik (Ime, Prezime, Email, Lozinka, Telefon, Uloga, Grad, Opcina, OpisProfila)
VALUES 
    ('Petar', 'Petrovic', 'petar@mail.com', 'AQAAAAIAAYagAAAAELU4GRi5Z1/J6MipL2muHEW6XRZhVqSdIBn9MC4AUZ2iImSdzDbLvwNhsebkwfZnUQ==', '06123456789', 'Majstor', 'Beograd', 'Voždovac', 'Iskusan vodoinstalatera'),
    ('Marko', 'Markovic', 'marko@mail.com', 'AQAAAAIAAYagAAAAEBHS462nGvkD8wJ+Y2sE4v2FBMyLPFt+bRDYj71rDNJmXmNafEoBmEdx/vIZnuWNqg==', '06987654321', 'Majstor', 'Novi Sad', 'Novo Naselje', 'Keramicar sa iskustvom'),
    ('Ana', 'Anic', 'ana@mail.com', 'AQAAAAIAAYagAAAAEDA+1PMRKS9SYV3y3iBFziltcqBA2sRapMpjLElZcri2m0tfoaYP6jn+8cUxzfYZsA==', '06111111111', 'Kupac', 'Beograd', 'Voždovac', 'Trebam vodoinstalatera'),
    ('Admin', 'Test', 'admin@test.com', 'AQAAAAIAAYagAAAAEAutilOyW1MejNFpdhk+ItAvOd4OBUg1mrgyPstJgvToufbBWXDt6MSLlXe/JQBAMA==', '0612345678', 'Administrator', 'Beograd', 'Voždovac', 'Test administratorski nalog');

INSERT INTO Administrator (KorisnikId, NivoPristupa)
VALUES (4, 'Standard');

INSERT INTO Majstor (KorisnikId, DetaljanOpisProfila, GodineIskustva, ProsjecnaOcjena, BrojZavrsenihPoslova, Specijalizacija, CijenaMjesecne)
VALUES 
    (1, 'Popravka cevi i vodoinstalacrskih sistema', 15, 4.8, 250, 'Vodoinstalacije', 1500.00),
    (2, 'Postavljanje plocica i keramike', 12, 4.9, 180, 'Keramika', 1800.00);

INSERT INTO Kupac (KorisnikId, BrojNarudzbi, OcjenaPouzdanosti)
VALUES 
    (3, 5, 4.7);

INSERT INTO Kategorija (Naziv, Opis)
VALUES 
    ('Vodoinstalacije', 'Sve vrste vodnih sistema'),
    ('Keramika', 'Postavljanje plocica i keramike'),
    ('Grejanje', 'Sistemi za grejanje'),
    ('Elektrika', 'Elektricni sistemi');

INSERT INTO Oglas (MajstorId, Naslov, Opis, Status)
VALUES 
    (1, 'Popravka curi cevi', 'Hitan posao, voda curi iz pljuvaonice', 'Aktivan'),
    (2, 'Postavljanje plocica', 'Postavljam plocice u kupatilu', 'Aktivan');

INSERT INTO OglasKategorija (OglasId, KategorijaId)
VALUES 
    (1, 1),
    (2, 2);

INSERT INTO Badge (Naziv, Opis)
VALUES 
    ('Super Majstor', 'Majstor sa 100+ zavrsenih poslova'),
    ('Pouzdani Profesionalac', 'Najmanje 4.5 zvezdice ocenjivanja');

INSERT INTO BadgeNagrada (BadgeId, MajstorId)
VALUES 
    (1, 1),
    (2, 2);

PRINT 'Baza podataka MNDRDB je uspesno kreirana sa svim tabelama!';
