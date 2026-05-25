import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { NewsResponse } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  gracze = 0;
  skocznie = 0;
  uzytkownicy = 0;
  ostatniNews: any = null; // Przechowa ostatni dodany news
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    forkJoin({
      g: this.api.getGracze(),
      u: this.api.getUzytkownicy(),
      s: this.api.getSkocznie(),
      // Odporność na błędy CORS/serwera dla nowego endpointu z newsami
      n: this.api.getNews().pipe(
        catchError(err => {
          console.warn('Nie udało się załadować sekcji newsów:', err);
          return of([]); // W razie błędu zwracamy pustą tablicę, aby forkJoin szedł dalej
        })
      )
    }).subscribe({
      next: res => {
        this.gracze      = res.g.length;
        this.skocznie    = res.s.length;
        this.uzytkownicy = res.u.length;
        
        // Jeśli w bazie są już newsy, przypisujemy pierwszy (najnowszy)
        if (res.n && res.n.length > 0) {
          this.ostatniNews = res.n[0];
        }

        this.loading = false;
      },
      error: (err) => {
        // Ten error odpali się tylko wtedy, gdy padną kluczowe tabele (gracze/skocznie/uzytkownicy)
        console.error('Błąd krytyczny dashboardu:', err);
        this.error   = 'Nie można połączyć się z backendem. Sprawdź URL w api.service.ts.';
        this.loading = false;
      }
    });
  }
}