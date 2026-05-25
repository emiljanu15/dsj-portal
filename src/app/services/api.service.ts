import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Gracz, Skocznia, Uzytkownik, 
  Komentarz, KomentarzDto, KomentarzResponse,
  Wynik, WynikDto, 
  NewsDto, NewsResponse 
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://dsjbackend-1.onrender.com/api';

  constructor(private http: HttpClient) {}

  // --- GRACZ ---
  getGracze(): Observable<Gracz[]>            { return this.http.get<Gracz[]>(`${this.base}/gracz`); }
  getGracz(id: number): Observable<Gracz>     { return this.http.get<Gracz>(`${this.base}/gracz/${id}`); }
  addGracz(g: Gracz): Observable<Gracz>       { return this.http.post<Gracz>(`${this.base}/gracz`, g); }
  updateGracz(id: number, g: Gracz)           { return this.http.put(`${this.base}/gracz/${id}`, g); }
  deleteGracz(id: number)                     { return this.http.delete(`${this.base}/gracz/${id}`); }

  // --- SKOCZNIA ---
  getSkocznie(): Observable<Skocznia[]>           { return this.http.get<Skocznia[]>(`${this.base}/skocznia`); }
  getSkocznia(id: number): Observable<Skocznia>   { return this.http.get<Skocznia>(`${this.base}/skocznia/${id}`); }
  addSkocznia(s: Skocznia): Observable<Skocznia>  { return this.http.post<Skocznia>(`${this.base}/skocznia`, s); }
  updateSkocznia(id: number, s: Skocznia)         { return this.http.put(`${this.base}/skocznia/${id}`, s); }
  deleteSkocznia(id: number)                      { return this.http.delete(`${this.base}/skocznia/${id}`); }

  // --- UZYTKOWNIK ---
  getUzytkownicy(): Observable<Uzytkownik[]>  { return this.http.get<Uzytkownik[]>(`${this.base}/uzytkownik`); }
  rejestracja(u: Uzytkownik)                  { return this.http.post(`${this.base}/uzytkownik/rejestracja`, u); }
  logowanie(u: Uzytkownik)                    { return this.http.post(`${this.base}/uzytkownik/logowanie`, u); }
  deleteUzytkownik(id: number)                { return this.http.delete(`${this.base}/uzytkownik/${id}`); }

  // --- KOMENTARZ ---
  getKomentarze(): Observable<KomentarzResponse[]>                     { return this.http.get<KomentarzResponse[]>(`${this.base}/komentarz`); }
  getKomentarzeByWynik(wynikId: number): Observable<KomentarzResponse[]> { return this.http.get<KomentarzResponse[]>(`${this.base}/komentarz/wynik/${wynikId}`); }
  addKomentarz(k: KomentarzDto)                { return this.http.post(`${this.base}/komentarz`, k); }
  updateKomentarz(id: number, k: KomentarzDto) { return this.http.put(`${this.base}/komentarz/${id}`, k); }
  deleteKomentarz(id: number)                  { return this.http.delete(`${this.base}/komentarz/${id}`); }

  // --- WYNIK ---
  getWyniki(): Observable<Wynik[]>             { return this.http.get<Wynik[]>(`${this.base}/wynik`); }
  getWynik(id: number): Observable<Wynik>      { return this.http.get<Wynik>(`${this.base}/wynik/${id}`); }
  addWynik(w: WynikDto): Observable<Wynik>     { return this.http.post<Wynik>(`${this.base}/wynik`, w); }
  updateWynik(id: number, w: WynikDto)         { return this.http.put(`${this.base}/wynik/${id}`, w); }
  deleteWynik(id: number)                      { return this.http.delete(`${this.base}/wynik/${id}`); }

  // --- REPLAY UTILITIES ---
  replayDistance(req: { url?: string }) { return this.http.post<any>(`${this.base}/replay/distance`, req); }

  // --- NEWSY ---
  getNews(): Observable<NewsResponse[]>        { return this.http.get<NewsResponse[]>(`${this.base}/news`); }
  getNewsItem(id: number): Observable<any>     { return this.http.get<any>(`${this.base}/news/${id}`); }
  addNews(n: NewsDto): Observable<any>         { return this.http.post(`${this.base}/news`, n); }
  updateNews(id: number, n: NewsDto)           { return this.http.put(`${this.base}/news/${id}`, n); }
  deleteNews(id: number)                       { return this.http.delete(`${this.base}/news/${id}`); }
}