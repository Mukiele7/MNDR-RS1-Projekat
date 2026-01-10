-- Add Latitude and Longitude columns to Majstor table
ALTER TABLE [dbo].[Majstor]
ADD [Latitude] FLOAT NULL,
    [Longitude] FLOAT NULL;

-- Update existing majstors with sample Sarajevo locations
UPDATE [dbo].[Majstor]
SET 
    [Latitude] = 43.8563 + (CAST(CHECKSUM(NEWID()) AS FLOAT) / CAST(2147483647 AS FLOAT) * 0.1),
    [Longitude] = 18.4131 + (CAST(CHECKSUM(NEWID()) AS FLOAT) / CAST(2147483647 AS FLOAT) * 0.1)
WHERE [Latitude] IS NULL;

GO
