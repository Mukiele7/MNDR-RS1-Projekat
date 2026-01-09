-- Insert test portfolio images for existing Majstori

-- Check if data already exists, if not insert
IF NOT EXISTS (SELECT 1 FROM PortfolioSlika WHERE MajstorId = 1)
BEGIN
    -- Majstor 1 (Elektricar) - Portfolio slike
    INSERT INTO [dbo].[PortfolioSlika] (MajstorId, SlikaUrl, Opis)
    VALUES 
    (1, 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800', 'Elektricne instalacije u novogradnji'),
    (1, 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800', 'LED rasvjeta - dnevni boravak'),
    (1, 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800', 'Elektricni ormar - industrijski objekat'),
    (1, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', 'Kabliranje i organizacija');
    
    PRINT 'Inserted 4 portfolio images for Majstor 1 (Elektricar)';
END
ELSE
BEGIN
    PRINT 'Portfolio images for Majstor 1 already exist';
END

IF NOT EXISTS (SELECT 1 FROM PortfolioSlika WHERE MajstorId = 2)
BEGIN
    -- Majstor 2 (Keramika) - Portfolio slike
    INSERT INTO [dbo].[PortfolioSlika] (MajstorId, SlikaUrl, Opis)
    VALUES 
    (2, 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800', 'Keramicke plocice - moderna kuhinja'),
    (2, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Postavljanje podnih plocica'),
    (2, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 'Kupatilo - mozaik detalji'),
    (2, 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', 'Zidne plocice - hodnik'),
    (2, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', 'Vanjska terasa - protivklizne plocice'),
    (2, 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800', 'Dekorativni zid - prirodni kamen');
    
    PRINT 'Inserted 6 portfolio images for Majstor 2 (Keramika)';
END
ELSE
BEGIN
    PRINT 'Portfolio images for Majstor 2 already exist';
END

-- Verify inserted data
SELECT MajstorId, COUNT(*) as BrojSlika 
FROM PortfolioSlika 
GROUP BY MajstorId
ORDER BY MajstorId;
