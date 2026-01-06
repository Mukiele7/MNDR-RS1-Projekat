import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KupacService } from './kupac.service';
import { vi } from 'vitest';

describe('KupacService', () => {
  let service: KupacService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KupacService]
    });
    
    service = TestBed.inject(KupacService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all kupci', () => {
    const mockKupci = {
      items: [
        { korisnikId: 1, ime: 'Marko', prezime: 'Marković', email: 'marko@test.com' },
        { korisnikId: 2, ime: 'Ana', prezime: 'Anić', email: 'ana@test.com' }
      ],
      totalCount: 2,
      pageNumber: 1,
      pageSize: 10
    };

    service.getKupci().subscribe((response: any) => {
      expect(response.items.length).toBe(2);
      expect(response.totalCount).toBe(2);
      expect(response.items[0].ime).toBe('Marko');
    });

    const req = httpMock.expectOne((request) => request.url.includes('/api/kupac'));
    expect(req.request.method).toBe('GET');
    req.flush(mockKupci);
  });

  it('should get kupac by id', () => {
    const mockKupac = {
      korisnikId: 1,
      ime: 'Marko',
      prezime: 'Marković',
      email: 'marko@test.com',
      telefon: '061234567',
      grad: 'Sarajevo'
    };

    service.getKupacById(1).subscribe(kupac => {
      expect(kupac.korisnikId).toBe(1);
      expect(kupac.ime).toBe('Marko');
    });

    const req = httpMock.expectOne('http://localhost:5017/api/kupac/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockKupac);
  });

  it('should create kupac', () => {
    const newKupac = {
      ime: 'Novi',
      prezime: 'Kupac',
      email: 'novi@test.com',
      telefon: '061111111',
      lozinka: 'password123'
    };

    const mockResponse = {
      success: true,
      message: 'Kupac kreiran',
      kupacId: 3
    };

    service.createKupac(newKupac).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.kupacId).toBe(3);
    });

    const req = httpMock.expectOne('http://localhost:5017/api/kupac');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newKupac);
    req.flush(mockResponse);
  });

  it('should delete kupac', () => {
    const mockResponse = {
      success: true,
      message: 'Kupac obrisan'
    };

    service.deleteKupac(1).subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:5017/api/kupac/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
