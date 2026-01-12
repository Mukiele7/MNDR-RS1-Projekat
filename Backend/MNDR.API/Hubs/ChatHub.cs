using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Concurrent;
using MNDR.Infrastructure.Data;
using MNDR.Domain.Entities;

namespace MNDR.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly MndrDbContext _context;
    private static readonly ConcurrentDictionary<int, string> _userConnections = new();

    public ChatHub(MndrDbContext context)
    {
        _context = context;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            _userConnections[userId.Value] = Context.ConnectionId;
            await base.OnConnectedAsync();
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (userId.HasValue)
        {
            _userConnections.TryRemove(userId.Value, out _);
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(int razgovorId, int primaocId, string poruka)
    {
        var posiljalacId = GetUserId();
        if (!posiljalacId.HasValue)
        {
            throw new HubException("User not authenticated");
        }

        // Kreiraj poruku u bazi
        var razgovorPoruka = new RazgovorPoruka
        {
            RazgovorId = razgovorId,
            PosiljaocId = posiljalacId.Value,
            Sadrzaj = poruka,
            VrijemeSlanja = DateTime.Now,
            Status = "sent"
        };

        _context.RazgovorPoruke.Add(razgovorPoruka);
        await _context.SaveChangesAsync();

        // Pošalji poruku primaocu ako je online
        var primaocConnectionId = GetConnectionIdForUser(primaocId);
        if (primaocConnectionId != null)
        {
            await Clients.Client(primaocConnectionId).SendAsync("ReceiveMessage", new
            {
                razgovorPorukaId = razgovorPoruka.RazgovorPorukaId,
                razgovorId = razgovorId,
                posiljaocId = posiljalacId.Value,
                sadrzaj = poruka,
                vrijemeSlanja = razgovorPoruka.VrijemeSlanja,
                status = "sent"
            });
        }

        // Pošalji i pošiljaocu (za sync između uređaja)
        var posiljaocKorisnik = await _context.Korisnici.FindAsync(posiljalacId.Value);
        await Clients.Caller.SendAsync("MessageSent", new
        {
            razgovorPorukaId = razgovorPoruka.RazgovorPorukaId,
            razgovorId = razgovorId,
            posiljaocId = posiljalacId.Value,
            sadrzaj = poruka,
            vrijemeSlanja = razgovorPoruka.VrijemeSlanja,
            status = "sent",
            posiljaocIme = posiljaocKorisnik != null ? $"{posiljaocKorisnik.Ime} {posiljaocKorisnik.Prezime}" : "Unknown"
        });
    }

    public async Task UserTyping(int razgovorId, int primaocId)
    {
        var posiljalacId = GetUserId();
        if (!posiljalacId.HasValue) return;

        var primaocConnectionId = GetConnectionIdForUser(primaocId);
        if (primaocConnectionId != null)
        {
            await Clients.Client(primaocConnectionId).SendAsync("UserIsTyping", razgovorId, posiljalacId.Value);
        }
    }

    public async Task UserStoppedTyping(int razgovorId, int primaocId)
    {
        var posiljalacId = GetUserId();
        if (!posiljalacId.HasValue) return;

        var primaocConnectionId = GetConnectionIdForUser(primaocId);
        if (primaocConnectionId != null)
        {
            await Clients.Client(primaocConnectionId).SendAsync("UserStoppedTyping", razgovorId, posiljalacId.Value);
        }
    }

    public async Task MarkMessageAsRead(int razgovorPorukaId)
    {
        var userId = GetUserId();
        if (!userId.HasValue) return;

        var poruka = await _context.RazgovorPoruke.FindAsync(razgovorPorukaId);
        if (poruka != null && poruka.Status != "read")
        {
            poruka.Status = "read";
            await _context.SaveChangesAsync();

            // Obavijesti pošiljaoca da je poruka pročitana
            var posiljalacConnectionId = GetConnectionIdForUser(poruka.PosiljaocId);
            if (posiljalacConnectionId != null)
            {
                await Clients.Client(posiljalacConnectionId).SendAsync("MessageRead", razgovorPorukaId);
            }
        }
    }

    private int? GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            return userId;
        }
        return null;
    }

    public string? GetConnectionIdForUser(int userId)
    {
        _userConnections.TryGetValue(userId, out var connectionId);
        return connectionId;
    }

    public bool IsUserOnline(int userId)
    {
        return _userConnections.ContainsKey(userId);
    }
}
