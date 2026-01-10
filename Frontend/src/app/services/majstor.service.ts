import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MajstorService {
  private apiUrl = 'http://localhost:5017/api/majstor';

  constructor(private http: HttpClient) { }

  getMajstori(params?: {
    pageNumber?: number;
    pageSize?: number;
    specijalizacija?: string;
    minOcjena?: number;
    grad?: string;
    minGodineIskustva?: number;
    maxCijena?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<any> {
    let httpParams = new HttpParams()
      .set('pageNumber', (params?.pageNumber || 1).toString())
      .set('pageSize', (params?.pageSize || 10).toString());

    if (params?.specijalizacija) httpParams = httpParams.set('specijalizacija', params.specijalizacija);
    if (params?.minOcjena) httpParams = httpParams.set('minOcjena', params.minOcjena.toString());
    if (params?.grad) httpParams = httpParams.set('grad', params.grad);
    if (params?.minGodineIskustva) httpParams = httpParams.set('minGodineIskustva', params.minGodineIskustva.toString());
    if (params?.maxCijena) httpParams = httpParams.set('maxCijena', params.maxCijena.toString());
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  getMajstorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createMajstor(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateMajstor(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteMajstor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getSuggestions(searchTerm: string): Observable<any[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<any[]>(`${this.apiUrl}/suggestions`, { params });
  }
}
