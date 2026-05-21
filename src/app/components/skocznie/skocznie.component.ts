import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Skocznia, Wynik, WynikDto, Gracz, KomentarzDto, Komentarz, Uzytkownik } from '../../models/models';

export interface SkoczniazRekordem extends Skocznia {
  rekord?: number;
  rekordGracz?: string;
}

@Component({
  selector: 'app-skocznie',
  templateUrl: './skocznie.component.html',
  styleUrls: ['./skocznie.component.scss']
})
export class SkocznieComponent implements OnInit {
  skocznie: SkoczniazRekordem[] = [];
  gracze: Gracz[] = [];
  uzytkownicy: Uzytkownik[] = [];
  loading = true;
  error = '';
  success = '';

  showModal = false;
  editMode = false;
  form: Skocznia = { nazwa: '', lokalizacja: '', punkt_k: 90 };
  editId: number | null = null;

  showWyniki = false;
  wybranaSkocznia: SkoczniazRekordem | null = null;
  wynikiSkoczni: Wynik[] = [];
  wszystkieWyniki: Wynik[] = [];
  wynikSuccess = '';
  wynikError = '';

  showDodajWynik = false;
  wynikForm: WynikDto = { odleglosc: 0, dataSkoku: '', graczId: 0, skoczniaId: 0, link_powtorka: '', czy_upadek: false };

  showKomentuj = false;
  showKomentarze = false;
  wybranyWynik: Wynik | null = null;
  komentarzForm: KomentarzDto = { tresc: '', wynikId: 0, uzytkownikId: 0 };
  komentarzSuccess = '';
  komentarzError = '';
  
  wszystkieKomentarze: Komentarz[] = [];
  komentarzeWybranegaWyniku: Komentarz[] = [];

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    forkJoin({ skocznie: this.api.getSkocznie(), wyniki: this.api.getWyniki(), gracze: this.api.getGracze(), komentarze: this.api.getKomentarze(), uzytkownicy: this.api.getUzytkownicy() }).subscribe({
      next: ({ skocznie, wyniki, gracze, komentarze, uzytkownicy }) => {
        this.wszystkieWyniki = wyniki;
        this.gracze = gracze;
        this.uzytkownicy = uzytkownicy;
        this.wszystkieKomentarze = komentarze;
        this.skocznie = skocznie.map(s => {
          const ws = wyniki.filter(w => w.skocznia?.id === s.id || (w as any).skoczniaId === s.id).sort((a, b) => b.odleglosc - a.odleglosc);
          const top = ws[0];
          let rekordGracz: string | undefined = undefined;
          if (top) {
            rekordGracz = top.gracz?.login_gracza;
            if (!rekordGracz && (top as any).graczId) {
              const g = gracze.find(x => x.id === (top as any).graczId);
              rekordGracz = g?.login_gracza;
            }
          }
          return { ...s, rekord: top?.odleglosc, rekordGracz };
        });
        this.loading = false;
      },
      error: () => { this.error = 'Błąd ładowania.'; this.loading = false; }
    });
  }

  odswiezWyniki(): void {
    this.api.getWyniki().subscribe(wyniki => {
      this.wszystkieWyniki = wyniki;
      this.skocznie = this.skocznie.map(s => {
        const ws = wyniki.filter(w => w.skocznia?.id === s.id || (w as any).skoczniaId === s.id).sort((a, b) => b.odleglosc - a.odleglosc);
        const top = ws[0];
        let rekordGracz: string | undefined = undefined;
        if (top) {
          rekordGracz = top.gracz?.login_gracza;
          if (!rekordGracz && (top as any).graczId) {
            const g = this.gracze.find(x => x.id === (top as any).graczId);
            rekordGracz = g?.login_gracza;
          }
        }
        return { ...s, rekord: top?.odleglosc, rekordGracz };
      });
      if (this.wybranaSkocznia) {
        this.wynikiSkoczni = wyniki
          .filter(w => w.skocznia?.id === this.wybranaSkocznia!.id)
          .sort((a, b) => b.odleglosc - a.odleglosc);
      }
    });
  }

  openAdd(): void { this.form = { nazwa: '', lokalizacja: '', punkt_k: 90 }; this.editMode = false; this.editId = null; this.showModal = true; }
  openEdit(s: Skocznia): void { this.form = { ...s }; this.editMode = true; this.editId = s.id!; this.showModal = true; }

  save(): void {
    const obs = this.editMode && this.editId ? this.api.updateSkocznia(this.editId, this.form) : this.api.addSkocznia(this.form);
    obs.subscribe({
      next: () => { this.success = this.editMode ? 'Zaktualizowano!' : 'Dodano!'; this.showModal = false; this.load(); },
      error: () => { this.error = 'Błąd zapisu.'; }
    });
  }

  delete(id: number): void {
    if (!confirm('Usunąć skocznię?')) return;
    this.api.deleteSkocznia(id).subscribe({
      next: () => { this.success = 'Skocznia usunięta.'; this.load(); },
      error: () => { this.error = 'Błąd usuwania.'; }
    });
  }

  pokazWyniki(s: SkoczniazRekordem): void {
    this.wybranaSkocznia = s;
    this.wynikiSkoczni = this.wszystkieWyniki
      .filter(w => w.skocznia?.id === s.id)
      .sort((a, b) => b.odleglosc - a.odleglosc);
    this.wynikError = '';
    this.wynikSuccess = '';
    this.showWyniki = true;
  }

  usunWynik(id: number): void {
    if (!confirm('Usunąć ten wynik?')) return;
    this.api.deleteWynik(id).subscribe({
      next: () => { this.wynikSuccess = 'Wynik usunięty.'; this.odswiezWyniki(); },
      error: () => { this.wynikError = 'Błąd usuwania wyniku.'; }
    });
  }

  otworzDodajWynik(): void {
    let graczId = 0;
    if (this.auth.isAdmin) {
      graczId = this.gracze[0]?.id ?? 0;
    } else {
      const myLogin = this.auth.currentUser?.login;
      const me = this.gracze.find(g => g.login_gracza === myLogin);
      graczId = me?.id ?? 0;
    }
    this.wynikForm = { odleglosc: 0, dataSkoku: new Date().toISOString().split('T')[0], graczId, skoczniaId: this.wybranaSkocznia!.id!, link_powtorka: '', czy_upadek: false };
    this.wynikError = '';
    this.wynikSuccess = '';
    this.showDodajWynik = true;
  }

  zapiszWynik(): void {
    this.wynikError = '';
    this.api.addWynik(this.wynikForm).subscribe({
      next: () => { this.wynikSuccess = 'Wynik dodany!'; this.showDodajWynik = false; this.odswiezWyniki(); },
      error: () => { this.wynikError = 'Błąd dodawania wyniku.'; }
    });
  }

  otworzKomentuj(w: Wynik): void {
    this.wybranyWynik = w;
    this.komentarzForm = {
      tresc: '',
      wynikId: w.id!,
      uzytkownikId: this.auth.currentUser?.id ?? 0
    };
    this.komentarzError = '';
    this.komentarzSuccess = '';
    this.showKomentuj = true;
  }

  zapiszKomentarz(): void {
    if (!this.komentarzForm.tresc.trim()) {
      this.komentarzError = 'Komentarz nie może być pusty.';
      return;
    }
    this.komentarzError = '';
    this.api.addKomentarz(this.komentarzForm).subscribe({
      next: () => {
        this.komentarzSuccess = 'Komentarz dodany!';
        this.api.getKomentarze().subscribe(k => { this.wszystkieKomentarze = k; });
        setTimeout(() => { this.showKomentuj = false; }, 1500);
      },
      error: () => { this.komentarzError = 'Błąd dodawania komentarza.'; }
    });
  }

  otworzKomentarze(w: Wynik): void {
    this.wybranyWynik = w;
    this.komentarzeWybranegaWyniku = this.wszystkieKomentarze.filter(k => k.wynikId === w.id);
    this.showKomentarze = true;
  }

  liczenieKomentarzy(wynikId: number): number {
    return this.wszystkieKomentarze.filter(k => k.wynikId === wynikId).length;
  }

  getLoginUzytkownika(uzytkownikId: number): string {
    const user = this.uzytkownicy.find(u => u.id === uzytkownikId);
    return user?.login ?? `User #${uzytkownikId}`;
  }

  roznicaDoLidera(w: Wynik): string {
    if (!this.wynikiSkoczni || this.wynikiSkoczni.length === 0) {
      return '—';
    }
    const lider = this.wynikiSkoczni[0];
    const diff = Number((w.odleglosc - lider.odleglosc).toFixed(1));
    return `${diff} m`;
  }

  przekroczylK(w: Wynik): boolean { return !!w.skocznia && w.odleglosc >= w.skocznia.punkt_k; }
}
