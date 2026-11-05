import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  slika?: File;
  slikaUrl?: string;
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
  private apiUrl = `${environment.apiUrl}/portfolio`;

  constructor(private http: HttpClient) { }

  getPortfolioSlike(majstorId: number): Observable<GetPortfolioSlikeResponse> {
    return this.http.get<GetPortfolioSlikeResponse>(`${this.apiUrl}/majstor/${majstorId}`);
  }

  uploadPortfolioSlika(command: UploadPortfolioSlikaCommand): Observable<UploadPortfolioSlikaResponse> {
    const formData = new FormData();
    formData.append('MajstorId', command.majstorId.toString());
    if (command.slika) {
      formData.append('Slika', command.slika);
    }
    if (command.slikaUrl) {
      formData.append('SlikaUrl', command.slikaUrl);
    }
    if (command.opis) {
      formData.append('Opis', command.opis);
    }
    return this.http.post<UploadPortfolioSlikaResponse>(this.apiUrl, formData);
  }

  deletePortfolioSlika(portfolioSlikaId: number, majstorId: number): Observable<DeletePortfolioSlikaResponse> {
    return this.http.delete<DeletePortfolioSlikaResponse>(
      `${this.apiUrl}/${portfolioSlikaId}?majstorId=${majstorId}`
    );
  }
}
