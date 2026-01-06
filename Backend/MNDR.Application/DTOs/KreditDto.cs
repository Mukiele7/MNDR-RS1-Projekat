namespace MNDR.Application.DTOs
{
    public class KreditDto
    {
        public int KreditId { get; set; }
        public int MajstorId { get; set; }
        public decimal Iznos { get; set; }
        public decimal Ostalo { get; set; }
        public string Status { get; set; } = "";
        public DateTime DatumKreiranja { get; set; }
    }

    public class KreditDetailDto
    {
        public int KreditId { get; set; }
        public int MajstorId { get; set; }
        public string MajstorIme { get; set; } = "";
        public decimal Iznos { get; set; }
        public decimal Ostalo { get; set; }
        public string Status { get; set; } = "";
        public DateTime DatumKreiranja { get; set; }
        public DateTime? DatumIspunjenosti { get; set; }
    }

    public class AddKreditDto
    {
        public int MajstorId { get; set; }
        public decimal Iznos { get; set; }
    }
}
