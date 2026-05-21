import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gracz, Skocznia, Uzytkownik, Komentarz, KomentarzDto, Wynik, WynikDto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://dsjbackend-1.onrender.com/api';


  constructor(private http: HttpClient) {}

  getGracze(): Observable<Gracz[]>            { return this.http.get<Gracz[]>(`${this.base}/Gracz`); }
  getGracz(id: number): Observable<Gracz>     { return this.http.get<Gracz>(`${this.base}/Gracz/${id}`); }
  addGracz(g: Gracz): Observable<Gracz>       { return this.http.post<Gracz>(`${this.base}/Gracz`, g); }
  updateGracz(id: number, g: Gracz)           { return this.http.put(`${this.base}/Gracz/${id}`, g); }
  deleteGracz(id: number)                     { return this.http.delete(`${this.base}/Gracz/${id}`); }

  getSkocznie(): Observable<Skocznia[]>           { return this.http.get<Skocznia[]>(`${this.base}/Skocznia`); }
  getSkocznia(id: number): Observable<Skocznia>   { return this.http.get<Skocznia>(`${this.base}/Skocznia/${id}`); }
  addSkocznia(s: Skocznia): Observable<Skocznia>  { return this.http.post<Skocznia>(`${this.base}/Skocznia`, s); }
  updateSkocznia(id: number, s: Skocznia)         { return this.http.put(`${this.base}/Skocznia/${id}`, s); }
  deleteSkocznia(id: number)                      { return this.http.delete(`${this.base}/Skocznia/${id}`); }

  getUzytkownicy(): Observable<Uzytkownik[]>  { return this.http.get<Uzytkownik[]>(`${this.base}/Uzytkownik`); }
  rejestracja(u: Uzytkownik)                  { return this.http.post(`${this.base}/Uzytkownik/rejestracja`, u); }
  logowanie(u: Uzytkownik)                    { return this.http.post(`${this.base}/Uzytkownik/logowanie`, u); }
  deleteUzytkownik(id: number)                { return this.http.delete(`${this.base}/Uzytkownik/${id}`); }

  getKomentarze(): Observable<Komentarz[]>                       { return this.http.get<Komentarz[]>(`${this.base}/Komentarz`); }
  getKomentarzeByWynik(wynikId: number): Observable<Komentarz[]> { return this.http.get<Komentarz[]>(`${this.base}/Komentarz/wynik/${wynikId}`); }
  addKomentarz(k: KomentarzDto)                { return this.http.post(`${this.base}/Komentarz`, k); }
  updateKomentarz(id: number, k: KomentarzDto) { return this.http.put(`${this.base}/Komentarz/${id}`, k); }
  deleteKomentarz(id: number)                  { return this.http.delete(`${this.base}/Komentarz/${id}`); }

  getWyniki(): Observable<Wynik[]>             { return this.http.get<Wynik[]>(`${this.base}/Wynik`); }
  getWynik(id: number): Observable<Wynik>      { return this.http.get<Wynik>(`${this.base}/Wynik/${id}`); }
  addWynik(w: WynikDto): Observable<Wynik>     { return this.http.post<Wynik>(`${this.base}/Wynik`, w); }
  updateWynik(id: number, w: WynikDto)         { return this.http.put(`${this.base}/Wynik/${id}`, w); }
  deleteWynik(id: number)                      { return this.http.delete(`${this.base}/Wynik/${id}`); }
}
