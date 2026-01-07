-- Kreiranje OmiljeniMajstor tabele za favorites funkcionalnost
USE MNDRDB;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OmiljeniMajstor')
BEGIN
    CREATE TABLE OmiljeniMajstor (
        Id INT PRIMARY KEY IDENTITY(1,1),
        KupacId INT NOT NULL,
        MajstorId INT NOT NULL,
        DatumDodavanja DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        
        CONSTRAINT FK_OmiljeniMajstor_Kupac FOREIGN KEY (KupacId) 
            REFERENCES Korisnik(KorisnikId) ON DELETE CASCADE,
        
        CONSTRAINT FK_OmiljeniMajstor_Majstor FOREIGN KEY (MajstorId) 
            REFERENCES Korisnik(KorisnikId) ON DELETE NO ACTION,
        
        CONSTRAINT UQ_OmiljeniMajstor_KupacMajstor UNIQUE (KupacId, MajstorId)
    );
    
    CREATE INDEX IX_OmiljeniMajstor_KupacId ON OmiljeniMajstor(KupacId);
    CREATE INDEX IX_OmiljeniMajstor_MajstorId ON OmiljeniMajstor(MajstorId);
    
    PRINT 'OmiljeniMajstor tabela uspešno kreirana.';
END
ELSE
BEGIN
    PRINT 'OmiljeniMajstor tabela već postoji.';
END
GO
