import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecenzijaService {
  private apiUrl = 'http://localhost:5017/api/recenzija';

  constructor(private http: HttpClient) { }

  getRecenzije(majstorId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/majstor/${majstorId}`);
  }

  createRecenzija(ugovorId: number, ocena: number, komentar: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      ugovorId,
      ocenaId: ocena,
      komentar
    });
  }
}
