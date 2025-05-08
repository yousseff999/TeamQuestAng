import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Portfolio {
  idPortfolio: number;
  title: string;
  description: string;
  imagePortfolio: string;
  user: any; // You can define a `User` interface if needed
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private apiUrl = 'http://localhost:8086/Portfolio';

  constructor(private http: HttpClient) {}

  getAllPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.apiUrl}/all`);
  }

  getImageUrlById(idPortfolio: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/getImageUrl/${idPortfolio}`, {
      responseType: 'text'
    });
  }

  createPortfolioWithImage(
    title: string,
    description: string,
    image: File,
    userId: number
  ): Observable<Portfolio> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('userId', userId.toString());

    return this.http.post<Portfolio>(`${this.apiUrl}/createWithImage`, formData);
  }
}
