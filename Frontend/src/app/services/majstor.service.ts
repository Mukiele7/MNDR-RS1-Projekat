import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MajstorService {
  private apiUrl = 'http://localhost:5017/api/majstor';

  constructor(private http: HttpClient) { }

  getMajstori(
    pageNumber: number = 1, 
    pageSize: number = 10, 
    specijalizacija?: string,
    minOcjena?: number,
    grad?: string,
    minGodineIskustva?: number,
    maxCijena?: number,
    sortBy?: string,
    sortOrder?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (specijalizacija) params = params.set('specijalizacija', specijalizacija);
    if (minOcjena) params = params.set('minOcjena', minOcjena.toString());
    if (grad) params = params.set('grad', grad);
    if (minGodineIskustva) params = params.set('minGodineIskustva', minGodineIskustva.toString());
    if (maxCijena) params = params.set('maxCijena', maxCijena.toString());
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);

    return this.http.get<any>(this.apiUrl, { params });
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
}
