namespace MNDR.Application.DTOs
{
    public class ServiceDto
    {
        public int ServiceId { get; set; }
        public string Naziv { get; set; } = "";
        public string Opis { get; set; } = "";
        public decimal Cijena { get; set; }
    }

    public class CreateServiceDto
    {
        public string Naziv { get; set; } = "";
        public string Opis { get; set; } = "";
        public decimal Cijena { get; set; }
    }
}
