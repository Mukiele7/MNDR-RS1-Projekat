namespace MNDR.Application.DTOs
{
    public class NotifikacijaDto
    {
        public int NotifikacijaId { get; set; }
        public int MajstorId { get; set; }
        public string Poruka { get; set; } = "";
        public string Tip { get; set; } = "";
        public bool Procitana { get; set; }
        public DateTime DatumKreiranja { get; set; }
    }

    public class CreateNotifikacijuDto
    {
        public int MajstorId { get; set; }
        public string Poruka { get; set; } = "";
        public string Tip { get; set; } = "";
    }
}
