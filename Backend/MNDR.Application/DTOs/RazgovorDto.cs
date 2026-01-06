namespace MNDR.Application.DTOs
{
    public class RazgovorDto
    {
        public int RazgovorId { get; set; }
        public int KupacId { get; set; }
        public int MajstorId { get; set; }
        public int OglasId { get; set; }
        public DateTime DatumKreiranja { get; set; }
        public DateTime DatumUpdate { get; set; }
        public DateTime? DatumZavrsetka { get; set; }
        public string? KupacIme { get; set; }
        public string? MajstorIme { get; set; }
        public List<RazgovorPorukaDetailDto> Poruke { get; set; } = new();
    }

    public class CreateRazgovorDto
    {
        public int KupacId { get; set; }
        public int MajstorId { get; set; }
        public int OglasId { get; set; }
    }
}
