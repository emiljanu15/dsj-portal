import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { NewsResponse } from '../../models/models'; // Zaimportuj model jeśli chcesz mieć silne typowanie

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
      n: this.api.getNews() // ← Pobieramy też newsy
    }).subscribe({
      next: res => {
        this.gracze      = res.g.length;
        this.skocznie    = res.s.length;
        this.uzytkownicy = res.u.length;
        
        // Pobieramy pierwszy news z góry (najnowszy)
        if (res.n && res.n.length > 0) {
          this.ostatniNews = res.n[0];
        }

        this.loading = false;
      },
      error: () => {
        this.error   = 'Nie można połączyć się z backendem. Sprawdź URL w api.service.ts.';
        this.loading = false;
      }
    });
  }
}