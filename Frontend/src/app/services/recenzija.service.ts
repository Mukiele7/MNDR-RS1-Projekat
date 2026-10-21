import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecenzijaService {
  private apiUrl = `${environment.apiUrl}/recenzija`;

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
