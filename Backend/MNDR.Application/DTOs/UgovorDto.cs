namespace MNDR.Application.DTOs
{
    public class UgovorDto
    {
        public int UgovorId { get; set; }
        public int MajstorId { get; set; }
        public int KupacId { get; set; }
        public int OglasId { get; set; }
        public string Status { get; set; } = "";
        public DateTime DatumKreiranja { get; set; }
    }

    public class UgovorDetailDto
    {
        public int UgovorId { get; set; }
        public int MajstorId { get; set; }
        public int KupacId { get; set; }
        public int OglasId { get; set; }
        public string Status { get; set; } = "";
        public string MajstorIme { get; set; } = "";
        public string KupacIme { get; set; } = "";
        public string OglasNaslov { get; set; } = "";
        public DateTime DatumKreiranja { get; set; }
    }

    public class CreateUgovorDto
    {
        public int MajstorId { get; set; }
        public int KupacId { get; set; }
        public int OglasId { get; set; }
    }
}
