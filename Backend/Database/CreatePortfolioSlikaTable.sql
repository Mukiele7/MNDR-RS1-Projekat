-- Create PortfolioSlika table
CREATE TABLE [dbo].[PortfolioSlika] (
    [PortfolioSlikaId] INT IDENTITY(1,1) NOT NULL,
    [MajstorId] INT NOT NULL,
    [SlikaUrl] NVARCHAR(500) NOT NULL,
    [Opis] NVARCHAR(200) NULL,
    [DatumKreiranja] DATETIME2 NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT [PK_PortfolioSlika] PRIMARY KEY ([PortfolioSlikaId]),
    CONSTRAINT [FK_PortfolioSlika_Majstor] FOREIGN KEY ([MajstorId]) 
        REFERENCES [dbo].[Majstor]([KorisnikId]) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX [IX_PortfolioSlika_MajstorId] ON [dbo].[PortfolioSlika]([MajstorId]);
