import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RazgovorService {
  private apiUrl = `${environment.apiUrl}/razgovor`;

  constructor(private http: HttpClient) { }

  getUserRazgovori(korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${korisnikId}`);
  }

  getRazgovor(razgovorId: number, korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${razgovorId}?korisnikId=${korisnikId}`);
  }

  createRazgovor(kupacId: number, majstorId: number, oglasId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      kupacId,
      majstorId,
      oglasId
    });
  }

  sendMessage(razgovorId: number, posiljaocId: number, sadrzaj: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${razgovorId}/poruka`, {
      posiljaocId,
      sadrzaj
    });
  }
}
