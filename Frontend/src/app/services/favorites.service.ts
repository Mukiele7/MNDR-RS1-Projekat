import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FavoriteMajstor {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  grad: string;
  specijalizacija: string;
  godineIskustva: number;
  cijenaMjesecne: number;
  cijenaSat: number;
  prosjecnaOcjena: number;
  brojZavrsenihPoslova: number;
  datumDodavanja: Date;
}

export interface GetFavoritesResult {
  items: FavoriteMajstor[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:5017/api/favorites';

  constructor(private http: HttpClient) { }

  addFavorite(kupacId: number, majstorId: number): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, { kupacId, majstorId });
  }

  removeFavorite(kupacId: number, majstorId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}?kupacId=${kupacId}&majstorId=${majstorId}`);
  }

  getFavorites(kupacId: number, pageNumber: number = 1, pageSize: number = 10): Observable<GetFavoritesResult> {
    return this.http.get<GetFavoritesResult>(`${this.apiUrl}?kupacId=${kupacId}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  isFavorite(kupacId: number, majstorId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-favorite?kupacId=${kupacId}&majstorId=${majstorId}`);
  }
}
