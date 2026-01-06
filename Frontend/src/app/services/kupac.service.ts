import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KupacService {
  private apiUrl = 'http://localhost:5017/api/kupac';

  constructor(private http: HttpClient) { }

  getKupci(
    pageNumber: number = 1, 
    pageSize: number = 10, 
    grad?: string,
    opcina?: string,
    searchTerm?: string,
    minOcjena?: number,
    minBrojNarudzbi?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (grad) params = params.set('grad', grad);
    if (opcina) params = params.set('opcina', opcina);
    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (minOcjena) params = params.set('minOcjena', minOcjena.toString());
    if (minBrojNarudzbi) params = params.set('minBrojNarudzbi', minBrojNarudzbi.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getKupacById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createKupac(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateKupac(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteKupac(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
