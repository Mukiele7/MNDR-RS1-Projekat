import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PortfolioSlikaDto {
  portfolioSlikaId: number;
  majstorId: number;
  slikaUrl: string;
  opis?: string;
  jeIstaknuta: boolean;
  datumKreiranja: Date;
}

export interface GetPortfolioSlikeResponse {
  success: boolean;
  message: string;
  slike: PortfolioSlikaDto[];
}

export interface UploadPortfolioSlikaCommand {
  majstorId: number;
  slikaUrl: string;
  opis?: string;
}

export interface UploadPortfolioSlikaResponse {
  success: boolean;
  message: string;
  portfolioSlikaId: number;
}

export interface DeletePortfolioSlikaResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:5017/api/portfolio';

  constructor(private http: HttpClient) { }

  getPortfolioSlike(majstorId: number): Observable<GetPortfolioSlikeResponse> {
    return this.http.get<GetPortfolioSlikeResponse>(`${this.apiUrl}/majstor/${majstorId}`);
  }

  uploadPortfolioSlika(command: UploadPortfolioSlikaCommand): Observable<UploadPortfolioSlikaResponse> {
    return this.http.post<UploadPortfolioSlikaResponse>(this.apiUrl, command);
  }

  deletePortfolioSlika(portfolioSlikaId: number, majstorId: number): Observable<DeletePortfolioSlikaResponse> {
    return this.http.delete<DeletePortfolioSlikaResponse>(
      `${this.apiUrl}/${portfolioSlikaId}?majstorId=${majstorId}`
    );
  }
}
