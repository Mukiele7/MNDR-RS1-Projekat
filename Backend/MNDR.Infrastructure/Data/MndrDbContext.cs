using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Domain.Common;
using MNDR.Domain.Entities;

namespace MNDR.Infrastructure.Data
{
    /// <summary>
    /// DbContext koji implementira IAppDbContext interfejs.
    /// Ovo omogućava Clean Architecture - Application layer zavisi samo od interfejsa.
    /// </summary>
    public class MndrDbContext : DbContext, IAppDbContext
    {
        public MndrDbContext(DbContextOptions<MndrDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<Administrator> Administratori { get; set; }
        public DbSet<Kupac> Kupci { get; set; }
        public DbSet<Majstor> Majstori { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<BadgeNagrada> BadgeNagrade { get; set; }
        public DbSet<Kategorija> Kategorije { get; set; }
        public DbSet<Kredit> Krediti { get; set; }
        public DbSet<Oglas> Oglasi { get; set; }
        public DbSet<OglasKategorija> OglasKategorije { get; set; }
        public DbSet<Razgovor> Razgovori { get; set; }
        public DbSet<RazgovorPoruka> RazgovorPoruke { get; set; }
        public DbSet<Ugovor> Ugovori { get; set; }
        public DbSet<Recenzija> Recenzije { get; set; }
        public DbSet<Notifikacija> Notifikacije { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<OmiljeniMajstor> OmiljeniMajstori { get; set; }
        public DbSet<PortfolioSlika> PortfolioSlike { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Korisnik Configuration
            modelBuilder.Entity<Korisnik>()
                .ToTable("Korisnik")
                .HasKey(k => k.KorisnikId);
            
            modelBuilder.Entity<Korisnik>()
                .HasIndex(k => k.Email)
                .IsUnique();
            
            modelBuilder.Entity<Korisnik>()
                .HasIndex(k => k.Uloga);

            // Administrator Configuration (One-to-One)
            modelBuilder.Entity<Administrator>()
                .ToTable("Administrator")
                .HasKey(a => a.AdministratorId);
            
            modelBuilder.Entity<Administrator>()
                .HasOne(a => a.Korisnik)
                .WithOne(k => k.Administrator)
                .HasForeignKey<Administrator>(a => a.KorisnikId);

            // Kupac Configuration (One-to-One, PK as FK)
            modelBuilder.Entity<Kupac>()
                .ToTable("Kupac")
                .HasKey(k => k.KorisnikId);
            
            modelBuilder.Entity<Kupac>()
                .HasOne(k => k.Korisnik)
                .WithOne(k => k.Kupac)
                .HasForeignKey<Kupac>(k => k.KorisnikId);

            // Majstor Configuration (One-to-One, PK as FK)
            modelBuilder.Entity<Majstor>()
                .ToTable("Majstor")
                .HasKey(m => m.KorisnikId);
            
            modelBuilder.Entity<Majstor>()
                .HasOne(m => m.Korisnik)
                .WithOne(k => k.Majstor)
                .HasForeignKey<Majstor>(m => m.KorisnikId);

            // Badge Configuration
            modelBuilder.Entity<Badge>()
                .ToTable("Badge")
                .HasKey(b => b.BadgeId);

            // BadgeNagrada Configuration (Many-to-Many through junction table)
            modelBuilder.Entity<BadgeNagrada>()
                .ToTable("BadgeNagrada")
                .HasKey(bn => bn.BadgeNagradaId);
            
            modelBuilder.Entity<BadgeNagrada>()
                .HasOne(bn => bn.Badge)
                .WithMany(b => b.BadgeNagrade)
                .HasForeignKey(bn => bn.BadgeId);
            
            modelBuilder.Entity<BadgeNagrada>()
                .HasOne(bn => bn.Majstor)
                .WithMany(m => m.BadgeNagrade)
                .HasForeignKey(bn => bn.MajstorId)
                .HasPrincipalKey(m => m.KorisnikId);

            // Kategorija Configuration
            modelBuilder.Entity<Kategorija>()
                .ToTable("Kategorija")
                .HasKey(k => k.KategorijaId);

            // Kredit Configuration
            modelBuilder.Entity<Kredit>()
                .ToTable("Kredit")
                .HasKey(k => k.TransakcijaKreditaId);
            
            modelBuilder.Entity<Kredit>()
                .HasOne(k => k.Majstor)
                .WithMany(m => m.Krediti)
                .HasForeignKey(k => k.MajstorId)
                .HasPrincipalKey(m => m.KorisnikId);

            // Oglas Configuration
            modelBuilder.Entity<Oglas>()
                .ToTable("Oglas")
                .HasKey(o => o.OglasId);
            
            modelBuilder.Entity<Oglas>()
                .HasOne(o => o.Majstor)
                .WithMany(m => m.Oglasi)
                .HasForeignKey(o => o.MajstorId)
                .HasPrincipalKey(m => m.KorisnikId);
            
            modelBuilder.Entity<Oglas>()
                .HasIndex(o => o.Status);

            // OglasKategorija Configuration (Many-to-Many through junction table)
            modelBuilder.Entity<OglasKategorija>()
                .ToTable("OglasKategorija")
                .HasKey(ok => ok.OglasKategorijaId);
            
            modelBuilder.Entity<OglasKategorija>()
                .HasOne(ok => ok.Oglas)
                .WithMany(o => o.OglasKategorije)
                .HasForeignKey(ok => ok.OglasId);
            
            modelBuilder.Entity<OglasKategorija>()
                .HasOne(ok => ok.Kategorija)
                .WithMany(k => k.OglasKategorije)
                .HasForeignKey(ok => ok.KategorijaId);

            // Razgovor Configuration
            modelBuilder.Entity<Razgovor>()
                .ToTable("Razgovor")
                .HasKey(r => r.RazgovorId);
            
            modelBuilder.Entity<Razgovor>()
                .HasOne(r => r.Kupac)
                .WithMany(k => k.Razgovori)
                .HasForeignKey(r => r.KupacId);
            
            modelBuilder.Entity<Razgovor>()
                .HasOne(r => r.Majstor)
                .WithMany(m => m.Razgovori)
                .HasForeignKey(r => r.MajstorId)
                .HasPrincipalKey(m => m.KorisnikId);
            
            modelBuilder.Entity<Razgovor>()
                .HasOne(r => r.Oglas)
                .WithMany(o => o.Razgovori)
                .HasForeignKey(r => r.OglasId);

            // RazgovorPoruka Configuration
            modelBuilder.Entity<RazgovorPoruka>()
                .ToTable("RazgovorPoruka")
                .HasKey(rp => rp.RazgovorPorukaId);
            
            modelBuilder.Entity<RazgovorPoruka>()
                .HasOne(rp => rp.Razgovor)
                .WithMany(r => r.Poruke)
                .HasForeignKey(rp => rp.RazgovorId);
            
            modelBuilder.Entity<RazgovorPoruka>()
                .HasOne(rp => rp.Posiljaoc)
                .WithMany(k => k.RazgovorPoruke)
                .HasForeignKey(rp => rp.PosiljaocId);

            // Ugovor Configuration
            modelBuilder.Entity<Ugovor>()
                .ToTable("Ugovor")
                .HasKey(u => u.UgovorId);
            
            modelBuilder.Entity<Ugovor>()
                .Ignore(u => u.MajstorId)
                .Ignore(u => u.DatumOd)
                .Ignore(u => u.DatumDo)
                .Ignore(u => u.Cena)
                .Ignore(u => u.Opis);
            
            modelBuilder.Entity<Ugovor>()
                .Property(u => u.DatumKreiranja)
                .HasColumnName("DatumSklapanja");
            
            modelBuilder.Entity<Ugovor>()
                .HasOne(u => u.Oglas)
                .WithMany(o => o.Ugovori)
                .HasForeignKey(u => u.OglasId);
            
            modelBuilder.Entity<Ugovor>()
                .HasOne(u => u.Kupac)
                .WithMany(k => k.Ugovori)
                .HasForeignKey(u => u.KupacId);
            
            modelBuilder.Entity<Ugovor>()
                .HasOne(u => u.Majstor)
                .WithMany(m => m.Ugovori)
                .HasForeignKey(u => u.OglasId)
                .HasPrincipalKey(m => m.KorisnikId)
                .OnDelete(DeleteBehavior.NoAction);
            
            modelBuilder.Entity<Ugovor>()
                .HasIndex(u => u.Status);

            // Recenzija Configuration
            modelBuilder.Entity<Recenzija>()
                .ToTable("Recenzija")
                .HasKey(r => r.RecenzijaId);
            
            modelBuilder.Entity<Recenzija>()
                .HasOne(r => r.Ugovor)
                .WithMany(u => u.Recenzije)
                .HasForeignKey(r => r.UgovorId);

            // Notifikacija Configuration
            modelBuilder.Entity<Notifikacija>()
                .ToTable("Notifikacija")
                .HasKey(n => n.NotifikacijaId);
            
            modelBuilder.Entity<Notifikacija>()
                .HasOne(n => n.Korisnik)
                .WithMany(k => k.Notifikacije)
                .HasForeignKey(n => n.KorisnikId);
            
            modelBuilder.Entity<Notifikacija>()
                .HasIndex(n => n.Procitano);

            // RefreshToken Configuration
            modelBuilder.Entity<RefreshToken>()
                .ToTable("RefreshTokens")
                .HasKey(rt => rt.Id);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.TokenHash)
                .IsUnique();

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.UserId);

            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany()
                .HasForeignKey(rt => rt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.ExpiresAtUtc);

            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.IsRevoked);

            // OmiljeniMajstor Configuration
            modelBuilder.Entity<OmiljeniMajstor>()
                .ToTable("OmiljeniMajstor")
                .HasKey(om => om.Id);

            modelBuilder.Entity<OmiljeniMajstor>()
                .HasOne(om => om.Kupac)
                .WithMany()
                .HasForeignKey(om => om.KupacId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OmiljeniMajstor>()
                .HasOne(om => om.Majstor)
                .WithMany()
                .HasForeignKey(om => om.MajstorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<OmiljeniMajstor>()
                .HasIndex(om => new { om.KupacId, om.MajstorId })
                .IsUnique();

            // PortfolioSlika Configuration
            modelBuilder.Entity<PortfolioSlika>()
                .ToTable("PortfolioSlika")
                .HasKey(ps => ps.PortfolioSlikaId);

            modelBuilder.Entity<PortfolioSlika>()
                .HasOne(ps => ps.Majstor)
                .WithMany(m => m.PortfolioSlike)
                .HasForeignKey(ps => ps.MajstorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PortfolioSlika>()
                .Property(ps => ps.SlikaUrl)
                .IsRequired()
                .HasMaxLength(500);

            modelBuilder.Entity<PortfolioSlika>()
                .Property(ps => ps.Opis)
                .HasMaxLength(200);
        }

        /// <summary>
        /// Override SaveChangesAsync da automatski setuje CreatedAtUtc i ModifiedAtUtc.
        /// Ovo radi za sve entitete koji naslede BaseEntity.
        /// </summary>
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAtUtc = DateTime.UtcNow;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ModifiedAtUtc = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}

