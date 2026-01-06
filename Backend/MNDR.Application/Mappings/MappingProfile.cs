using AutoMapper;
using MNDR.Domain.Entities;
using MNDR.Application.DTOs;

namespace MNDR.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Korisnik mappings
            CreateMap<Korisnik, KorisnikDto>().ReverseMap();
            CreateMap<CreateKorisnikDto, Korisnik>();
            CreateMap<UpdateKorisnikDto, Korisnik>();

            // Oglas mappings
            CreateMap<Oglas, OglasDto>()
                .ForMember(dest => dest.MajstorIme, opt => 
                    opt.MapFrom(src => src.Majstor != null ? src.Majstor.Korisnik!.Ime + " " + src.Majstor.Korisnik.Prezime : ""))
                .ForMember(dest => dest.KategorijeIds, opt => 
                    opt.MapFrom(src => src.OglasKategorije.Select(ok => ok.KategorijaId).ToList()));
            
            CreateMap<CreateOglasDto, Oglas>()
                .ForMember(dest => dest.DatumObjave, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => "Aktivan"));
            
            CreateMap<UpdateOglasDto, Oglas>();

            // Majstor mappings
            CreateMap<Majstor, MajstorDto>()
                .ForMember(dest => dest.Ime, opt => opt.MapFrom(src => src.Korisnik!.Ime))
                .ForMember(dest => dest.Prezime, opt => opt.MapFrom(src => src.Korisnik!.Prezime))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Korisnik!.Email))
                .ForMember(dest => dest.Telefon, opt => opt.MapFrom(src => src.Korisnik!.Telefon))
                .ForMember(dest => dest.Grad, opt => opt.MapFrom(src => src.Korisnik!.Grad ?? ""))
                .ForMember(dest => dest.OpisProfila, opt => opt.MapFrom(src => src.DetaljanOpisProfila))
                .ForMember(dest => dest.DatumRegistracije, opt => opt.MapFrom(src => src.Korisnik!.DatumRegistracije))
                .ForMember(dest => dest.ProsjecnaOcjena, opt => opt.MapFrom(src => src.ProsjecnaOcjena))
                .ForMember(dest => dest.CijenaMjesecne, opt => opt.MapFrom(src => src.CijenaMjesecne));

            // Razgovor mappings
            CreateMap<Razgovor, RazgovorDto>()
                .ForMember(dest => dest.KupacIme, opt => 
                    opt.MapFrom(src => src.Kupac != null && src.Kupac.Korisnik != null 
                        ? src.Kupac.Korisnik.Ime + " " + src.Kupac.Korisnik.Prezime : ""))
                .ForMember(dest => dest.MajstorIme, opt => 
                    opt.MapFrom(src => src.Majstor != null && src.Majstor.Korisnik != null 
                        ? src.Majstor.Korisnik.Ime + " " + src.Majstor.Korisnik.Prezime : ""));

            CreateMap<CreateRazgovorDto, Razgovor>()
                .ForMember(dest => dest.DatumKreiranja, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.DatumUpdate, opt => opt.MapFrom(_ => DateTime.UtcNow));

            // RazgovorPoruka mappings
            CreateMap<RazgovorPoruka, RazgovorPorukaDetailDto>()  // Changed from RazgovorPorukaDto to RazgovorPorukaDetailDto
                .ForMember(dest => dest.PosiljaocIme, opt => 
                    opt.MapFrom(src => src.Posiljaoc != null 
                        ? src.Posiljaoc.Ime + " " + src.Posiljaoc.Prezime : ""));

            CreateMap<SendRazgovorPorukaDto, RazgovorPoruka>()
                .ForMember(dest => dest.VrijemeSlanja, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => "Poslana"));
        }
    }
}
