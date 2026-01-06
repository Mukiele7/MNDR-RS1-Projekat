namespace MNDR.Application.DTOs
{
    public class RazgovorPorukaDto
    {
        public int RazgovorPorukaId { get; set; }
        public int RazgovorId { get; set; }
        public int PosiljaocId { get; set; }
        public string Sadrzaj { get; set; } = "";
        public DateTime VrijemeSlanja { get; set; }
    }

    public class RazgovorPorukaDetailDto
    {
        public int RazgovorPorukaId { get; set; }
        public int PosiljaocId { get; set; }
        public string Sadrzaj { get; set; } = "";
        public DateTime VrijemeSlanja { get; set; }
        public string PosiljaocIme { get; set; } = "";
    }

    public class SendRazgovorPorukaDto
    {
        public int RazgovorId { get; set; }
        public int PosiljaocId { get; set; }
        public string Sadrzaj { get; set; } = "";
    }
}
