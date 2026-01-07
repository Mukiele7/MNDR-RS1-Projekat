namespace MNDR.Domain.Entities;

public class OmiljeniMajstor
{
    public int Id { get; set; }
    public int KupacId { get; set; }
    public int MajstorId { get; set; }
    public DateTime DatumDodavanja { get; set; }

    // Navigation properties
    public Korisnik? Kupac { get; set; }
    public Korisnik? Majstor { get; set; }
}
