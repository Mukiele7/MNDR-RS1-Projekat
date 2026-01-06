import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RazgovorService {
  private apiUrl = 'http://localhost:5017/api/razgovor';

  constructor(private http: HttpClient) { }

  getUserRazgovori(korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${korisnikId}`);
  }

  getRazgovor(razgovorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${razgovorId}`);
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
