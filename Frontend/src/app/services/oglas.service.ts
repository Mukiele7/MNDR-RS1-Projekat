import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OglasService {
  private apiUrl = 'http://localhost:5017/api/oglas';

  constructor(private http: HttpClient) { }

  getOglasi(
    pageNumber: number = 1, 
    pageSize: number = 10, 
    status?: string, 
    searchTerm?: string,
    sortBy?: string,
    sortOrder?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (status) params = params.set('status', status);
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getOglas(oglasId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${oglasId}`);
  }

  createOglas(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateOglas(oglasId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${oglasId}`, data);
  }

  deleteOglas(oglasId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${oglasId}`);
  }
}
