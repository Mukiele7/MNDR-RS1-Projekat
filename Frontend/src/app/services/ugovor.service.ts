import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UgovorService {
  private apiUrl = `${environment.apiUrl}/ugovor`;

  constructor(private http: HttpClient) { }

  getUgovori(korisnikId: number, sortBy?: string, sortOrder?: string): Observable<any> {
    let url = `${this.apiUrl}/korisnik/${korisnikId}`;
    
    const params: string[] = [];
    if (sortBy) params.push(`sortBy=${sortBy}`);
    if (sortOrder) params.push(`sortOrder=${sortOrder}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<any>(url);
  }

  createUgovor(kupacId: number, oglasId: number, datumOd: Date, datumDo: Date, cena: number, opis: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      kupacId,
      oglasId,
      datumOd,
      datumDo,
      cena,
      opis
    });
  }

  completeUgovor(ugovorId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ugovorId}/complete`, {});
  }
}
