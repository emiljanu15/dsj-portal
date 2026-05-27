import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Turniej, UczestnikTurnieju, WynikTurniejowyStat } from '../../models/models';

@Component({
  selector: 'app-wyniki-turniejow',
  templateUrl: './wyniki-turniejow.component.html',
  styleUrls: ['./wyniki-turniejow.component.scss']
})
export class WynikiTurniejowComponent implements OnInit {
  turnieje: Turniej[] = [];
  stats: WynikTurniejowyStat[] = [];
  loading = true;
  error = '';
  success = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.api.getTurnieje().subscribe({
      next: (turnieje) => {
        this.turnieje = turnieje;

        if (!turnieje.length) {
          this.stats = [];
          this.loading = false;
          return;
        }

        const requests = turnieje.map(t =>
          this.api.getRankingTurnieju(t.id!).pipe(
            catchError(() => of([] as UczestnikTurnieju[]))
          )
        );

        forkJoin(requests).subscribe({
          next: (rankingi) => {
            const mapa = new Map<string, WynikTurniejowyStat>();

            rankingi.forEach((ranking) => {
              ranking.forEach((u) => {
                const key = (u.nazwa_uczestnika || '').trim().toLowerCase();
                const displayName = u.nazwa_uczestnika || '—';

                if (!key) return;

                if (!mapa.has(key)) {
                  mapa.set(key, {
                    nazwa_uczestnika: displayName,
                    pierwszeMiejsca: 0,
                    drugieMiejsca: 0,
                    trzecieMiejsca: 0,
                    sumaPodiow: 0,
                    turnieje: 0
                  });
                }

                const stat = mapa.get(key)!;
                stat.turnieje += 1;

                if (u.miejsce === 1) stat.pierwszeMiejsca += 1;
                if (u.miejsce === 2) stat.drugieMiejsca += 1;
                if (u.miejsce === 3) stat.trzecieMiejsca += 1;

                stat.sumaPodiow =
                  stat.pierwszeMiejsca +
                  stat.drugieMiejsca +
                  stat.trzecieMiejsca;
              });
            });

            this.stats = Array.from(mapa.values()).sort((a, b) =>
              b.pierwszeMiejsca - a.pierwszeMiejsca ||
              b.drugieMiejsca - a.drugieMiejsca ||
              b.trzecieMiejsca - a.trzecieMiejsca ||
              b.sumaPodiow - a.sumaPodiow ||
              a.nazwa_uczestnika.localeCompare(b.nazwa_uczestnika)
            );

            this.loading = false;
          },
          error: () => {
            this.error = 'Błąd ładowania rankingów turniejów.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Błąd ładowania turniejów.';
        this.loading = false;
      }
    });
  }

  miejsceKlasyfikacji(index: number): number {
    return index + 1;
  }
}