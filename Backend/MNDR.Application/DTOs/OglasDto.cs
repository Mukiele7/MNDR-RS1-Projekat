namespace MNDR.Application.DTOs
{
    public class OglasDto
    {
        public int OglasId { get; set; }
        public int MajstorId { get; set; }
        public string Naslov { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public DateTime DatumObjave { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? MajstorIme { get; set; }
        public List<int> KategorijeIds { get; set; } = new();
    }

    public class CreateOglasDto
    {
        public int MajstorId { get; set; }
        public string Naslov { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public List<int> KategorijeIds { get; set; } = new();
    }

    public class UpdateOglasDto
    {
        public int OglasId { get; set; }
        public string Naslov { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
