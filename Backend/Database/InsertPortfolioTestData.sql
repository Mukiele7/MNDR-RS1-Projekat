-- Insert test portfolio images for Majstor ID 2 (Electrical work)
INSERT INTO [dbo].[PortfolioSlika] ([MajstorId], [SlikaUrl], [Opis], [DatumKreiranja])
VALUES
(2, 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800', 'Instalacija elektrike u novom stanu', GETDATE()),
(2, 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800', 'Rasvjeta - moderno LED osvjetljenje', GETDATE()),
(2, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800', 'Elektro ormar - industrijski objekat', GETDATE()),
(2, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', 'Kabliranje i mrežna instalacija', GETDATE()),
(2, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800', 'Smart home sistem - automatizacija', GETDATE()),
(2, 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=800', 'Solarne ploče - zelena energija', GETDATE());

-- Insert test portfolio images for Majstor ID 1 (General construction)
INSERT INTO [dbo].[PortfolioSlika] ([MajstorId], [SlikaUrl], [Opis], [DatumKreiranja])
VALUES
(1, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', 'Renovacija kuhinje - prije i poslije', GETDATE()),
(1, 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800', 'Ugradnja keramičkih pločica', GETDATE()),
(1, 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800', 'Kompletna adaptacija kupatila', GETDATE()),
(1, 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800', 'Gipsani radovi - salon', GETDATE());

-- Insert test portfolio images for Majstor ID 3 (Plumbing)
INSERT INTO [dbo].[PortfolioSlika] ([MajstorId], [SlikaUrl], [Opis], [DatumKreiranja])
VALUES
(3, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', 'Instalacija modernog kupatila', GETDATE()),
(3, 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800', 'Hidroizolacija i pločice', GETDATE()),
(3, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', 'Ugradnja sanitarija premium kvaliteta', GETDATE());
