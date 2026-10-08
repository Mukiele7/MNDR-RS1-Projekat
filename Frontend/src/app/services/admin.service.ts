import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminOverview {
  ukupnoKorisnika: number;
  ukupnoMajstora: number;
  ukupnoKupaca: number;
  ukupnoOglasa: number;
  aktivniOglasi: number;
  ukupnoUgovora: number;
  ukupnoRecenzija: number;
  ukupnoRazgovora: number;
}

export interface AdminUser {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;
  uloga: string;
  grad?: string;
  datumRegistracije: string;
}

export interface AdminListing {
  oglasId: number;
  majstorId: number;
  naslov: string;
  status: string;
  majstorIme: string;
  datumObjave: string;
}

export interface AdminReview {
  recenzijaId: number;
  majstorId: number;
  kupacId: number;
  ocjena: number;
  komentar?: string;
  datumRecenzije: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = 'http://localhost:5017/api/admin';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<AdminOverview> {
    return this.http.get<AdminOverview>(`${this.apiUrl}/overview`);
  }

  getUsers(search = ''): Observable<AdminUser[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`, { params });
  }

  getListings(): Observable<AdminListing[]> {
    return this.http.get<AdminListing[]>(`${this.apiUrl}/listings`);
  }

  getReviews(): Observable<AdminReview[]> {
    return this.http.get<AdminReview[]>(`${this.apiUrl}/reviews`);
  }

  updateListingStatus(id: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/listings/${id}/status`, { status });
  }

  updateUserRole(id: number, uloga: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${id}/role`, { uloga });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
