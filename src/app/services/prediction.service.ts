import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:8086/api/predict';

  constructor(private http: HttpClient) {}

  predict(data: any): Observable<string> {
    return this.http.post<string>(this.apiUrl, data, { responseType: 'text' as 'json' });
  }
}