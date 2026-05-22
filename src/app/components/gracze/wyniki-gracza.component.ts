import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Gracz, Skocznia, Wynik } from '../../models/models';

interface SkoczniaWynik {
  skocznia: Skocznia;
  rekord: number | null;
  wynikId?: number;
  dataSkoku?: string;
  link_powtorka?: string;
  czy_upadek?: boolean;
}

@Component({
  selector: 'app-wyniki-gracza',
  templateUrl: './wyniki-gracza.component.html',
  styleUrls: ['./wyniki-gracza.component.scss']
})
export class WynikiGraczaComponent implements OnInit {
  gracz: Gracz | null = null;
  lista: SkoczniaWynik[] = [];
  loading = true;
  error = '';
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.updateViewport();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Nieprawidłowy ID gracza.';
      this.loading = false;
      return;
    }

    forkJoin({
      gracz: this.api.getGracz(id),
      wyniki: this.api.getWyniki(),
      skocznie: this.api.getSkocznie()
    }).subscribe({
      next: ({ gracz, wyniki, skocznie }) => {
        this.gracz = gracz;

        const wynikiGracza = wyniki.filter(
          w => w.gracz?.id === id || (w as any).graczId === id
        );

        const bestPerSkocznia = new Map<number, Wynik>();

        wynikiGracza.forEach(w => {
          const sid = w.skocznia?.id ?? (w as any).skoczniaId ?? 0;
          if (!sid) return;

          const cur = bestPerSkocznia.get(sid);
          if (!cur || w.odleglosc > cur.odleglosc) {
            bestPerSkocznia.set(sid, w);
          }
        });

        this.lista = skocznie
          .map(sk => {
            const best = bestPerSkocznia.get(sk.id!);
            return {
              skocznia: sk,
              rekord: best ? best.odleglosc : null,
              wynikId: best?.id,
              dataSkoku: best?.dataSkoku,
              link_powtorka: best?.link_powtorka,
              czy_upadek: best?.czy_upadek
            };
          })
          .sort((a, b) => (b.rekord ?? -1) - (a.rekord ?? -1));

        this.loading = false;
      },
      error: () => {
        this.error = 'Błąd ładowania danych.';
        this.loading = false;
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  private updateViewport(): void {
    this.isMobile = window.innerWidth <= 600;
  }
}