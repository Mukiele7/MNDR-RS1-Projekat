namespace MNDR.Application.DTOs
{
    public class RecenzijaDto
    {
        public int RecenzijaId { get; set; }
        public int Ocjena { get; set; }
        public string Komentar { get; set; } = "";
        public int OdMajstora { get; set; }
        public int ZaMajstora { get; set; }
        public DateTime DatumKreiranja { get; set; }
    }

    public class RecenzijaDetailDto
    {
        public int RecenzijaId { get; set; }
        public int Ocjena { get; set; }
        public string Komentar { get; set; } = "";
        public string OdMajstoraIme { get; set; } = "";
        public string ZaMajstoraIme { get; set; } = "";
        public DateTime DatumKreiranja { get; set; }
    }

    public class CreateRecenzijaDto
    {
        public int Ocjena { get; set; }
        public string Komentar { get; set; } = "";
        public int OdMajstora { get; set; }
        public int ZaMajstora { get; set; }
    }
}
