import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Wynik, WynikDto, Gracz, Skocznia, Komentarz, KomentarzDto } from '../../models/models';

@Component({
  selector: 'app-wyniki',
  templateUrl: './wyniki.component.html',
  styleUrls: ['./wyniki.component.scss']
})
export class WynikiComponent implements OnInit {
  wyniki: Wynik[] = [];
  gracze: Gracz[] = [];
  skocznie: Skocznia[] = [];
  loading = true;
  error = '';
  success = '';

  // Modal dodaj/edytuj wynik (admin)
  showModal = false;
  editMode = false;
  editId: number | null = null;
  form: WynikDto = { odleglosc: 0, dataSkoku: new Date().toISOString().split('T')[0], graczId: 0, skoczniaId: 0, link_powtorka: '', czy_upadek: false };

  // Panel komentarzy
  showKomentarze = false;
  wybranyWynik: Wynik | null = null;
  komentarze: Komentarz[] = [];
  komentarzeLoading = false;
  nowyKomentarz = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    forkJoin({ wyniki: this.api.getWyniki(), gracze: this.api.getGracze(), skocznie: this.api.getSkocznie() }).subscribe({
      next: res => {
        this.gracze = res.gracze;
        this.skocznie = res.skocznie;
        // normalize wyniki: resolve id-only relations to objects when necessary
        this.wyniki = res.wyniki.map(w => {
          const gr = w.gracz ?? this.gracze.find(g => g.id === (w as any).graczId);
          const sk = w.skocznia ?? this.skocznie.find(s => s.id === (w as any).skoczniaId);
          return { ...w, gracz: gr, skocznia: sk } as Wynik;
        });
        this.loading = false;
      },
      error: () => { this.error = 'Błąd ładowania.'; this.loading = false; }
    });
  }

  load(): void {
    this.api.getWyniki().subscribe({ next: d => { this.wyniki = d; }, error: () => {} });
  }

  openAdd(): void {
    this.form = { odleglosc: 0, dataSkoku: new Date().toISOString().split('T')[0], graczId: this.gracze[0]?.id ?? 0, skoczniaId: this.skocznie[0]?.id ?? 0, link_powtorka: '', czy_upadek: false };
    this.editMode = false; this.editId = null; this.showModal = true;
  }

  openEdit(w: Wynik): void {
    this.form = { odleglosc: w.odleglosc, dataSkoku: w.dataSkoku, graczId: w.gracz?.id ?? 0, skoczniaId: w.skocznia?.id ?? 0, link_powtorka: w.link_powtorka ?? '', czy_upadek: w.czy_upadek };
    this.editMode = true; this.editId = w.id!; this.showModal = true;
  }

  save(): void {
    const obs = this.editMode && this.editId ? this.api.updateWynik(this.editId, this.form) : this.api.addWynik(this.form);
    obs.subscribe({
      next: () => { this.success = this.editMode ? 'Zaktualizowano!' : 'Wynik dodany!'; this.showModal = false; this.load(); },
      error: () => { this.error = 'Błąd zapisu.'; }
    });
  }

  delete(id: number): void {
    if (!confirm('Usunąć wynik?')) return;
    this.api.deleteWynik(id).subscribe({ next: () => { this.success = 'Usunięto.'; this.load(); }, error: () => { this.error = 'Błąd.'; } });
  }

  // Komentarze
  pokazKomentarze(w: Wynik): void {
    this.wybranyWynik = w;
    this.komentarze = [];
    this.nowyKomentarz = '';
    this.showKomentarze = true;
    this.komentarzeLoading = true;
    this.api.getKomentarzeByWynik(w.id!).subscribe({
      next: d => { this.komentarze = d; this.komentarzeLoading = false; },
      error: () => { this.komentarzeLoading = false; }
    });
  }

  dodajKomentarz(): void {
    this.error = '';
    if (!this.wybranyWynik) {
      this.error = 'Brak wybranego wyniku.';
      return;
    }
    const userId = this.auth.currentUser?.id;
    if (!this.nowyKomentarz.trim()) {
      this.error = 'Wpisz treść komentarza.';
      return;
    }
    if (!userId || userId <= 0) {
      this.error = 'Błąd użytkownika. Zaloguj się ponownie.';
      return;
    }

    const dto: KomentarzDto = {
      tresc: this.nowyKomentarz.trim(),
      wynikId: this.wybranyWynik.id!,
      uzytkownikId: userId
    };
    console.log('Dodaj komentarz payload:', dto);
    this.api.addKomentarz(dto).subscribe({
      next: () => {
        this.error = '';
        this.nowyKomentarz = '';
        this.pokazKomentarze(this.wybranyWynik!);
      },
      error: err => {
        console.error('Błąd dodawania komentarza:', err);
        const serverMessage = err?.error?.message || err?.message;
        this.error = serverMessage ? `Błąd dodawania komentarza: ${serverMessage}` : 'Błąd dodawania komentarza.';
      }
    });
  }

  usunKomentarz(id: number): void {
    if (!confirm('Usunąć komentarz?')) return;
    this.api.deleteKomentarz(id).subscribe({ next: () => this.pokazKomentarze(this.wybranyWynik!), error: () => {} });
  }

  przekroczylK(w: Wynik): boolean { return !!w.skocznia && w.odleglosc >= w.skocznia.punkt_k; }
}
