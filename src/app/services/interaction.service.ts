import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class InteractionService {
  private apiUrl = 'http://localhost:8086/api/stats';

  constructor(private http: HttpClient) {}

  getGlobalStats(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/interactions`);
  }

  getStatsByCategory(category: string): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/interactions/${category}`);
  }
}
