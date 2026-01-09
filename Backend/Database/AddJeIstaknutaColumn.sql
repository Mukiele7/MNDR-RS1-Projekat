-- Proveri da li kolona vec postoji
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'PortfolioSlika' AND COLUMN_NAME = 'JeIstaknuta')
BEGIN
    -- Dodaj kolonu JeIstaknuta u PortfolioSlika tabelu
    ALTER TABLE [dbo].[PortfolioSlika]
    ADD [JeIstaknuta] BIT NOT NULL DEFAULT 0;

    PRINT 'Kolona JeIstaknuta dodana';

    -- Postavi prvih 3 slike majstora 2 kao istaknutе
    UPDATE TOP (3) [dbo].[PortfolioSlika]
    SET [JeIstaknuta] = 1
    WHERE [MajstorId] = 2;

    PRINT 'Postavljene 3 istaknutе slike za Majstora 2';
END
ELSE
BEGIN
    PRINT 'Kolona JeIstaknuta vec postoji';
END
