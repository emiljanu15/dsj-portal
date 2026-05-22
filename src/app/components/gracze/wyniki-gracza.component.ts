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

          const current = bestPerSkocznia.get(sid);
          if (!current || w.odleglosc > current.odleglosc) {
            bestPerSkocznia.set(sid, w);
          }
        });

        this.lista = skocznie
          .map((sk): SkoczniaWynik => {
            const best = bestPerSkocznia.get(sk.id!);

            return {
              skocznia: sk,
              rekord: best?.odleglosc ?? null,
              wynikId: best?.id,
              dataSkoku: best?.dataSkoku,
              link_powtorka: best?.link_powtorka,
              czy_upadek: best?.czy_upadek ?? false
            };
          })
          .sort((a, b) => {
            const aVal = a.rekord ?? -1;
            const bVal = b.rekord ?? -1;
            return bVal - aVal;
          });

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
    this.isMobile = window.innerWidth < 768;
  }

  get najlepszySkok(): number | null {
    const rekordy = this.lista
      .map(item => item.rekord)
      .filter((rekord): rekord is number => rekord !== null);

    return rekordy.length ? Math.max(...rekordy) : null;
  }

  get liczbaUpadkow(): number {
    return this.lista.filter(item => item.czy_upadek).length;
  }

  get liczbaSkoczniZRozpoznanymWynikiem(): number {
    return this.lista.filter(item => item.rekord !== null).length;
  }

  get maWyniki(): boolean {
    return this.lista.length > 0;
  }
}