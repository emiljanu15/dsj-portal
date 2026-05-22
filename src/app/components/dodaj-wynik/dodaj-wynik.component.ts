import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { WynikDto, Skocznia, Gracz } from '../../models/models';

@Component({
  selector: 'app-dodaj-wynik',
  templateUrl: './dodaj-wynik.component.html',
  styleUrls: ['./dodaj-wynik.component.scss']
})
export class DodajWynikComponent implements OnInit {
  skocznie: Skocznia[] = [];
  gracze: Gracz[] = [];
  loading = true;
  saving = false;
  checkingReplay = false;
  error = '';
  success = '';

  form: WynikDto = {
    odleglosc: 0,
    dataSkoku: '',
    graczId: 0,
    skoczniaId: 0,
    link_powtorka: '',
    czy_upadek: false
  };

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.form.dataSkoku = this.todayLocal();

    forkJoin({
      gracze: this.api.getGracze(),
      skocznie: this.api.getSkocznie()
    }).subscribe({
      next: ({ gracze, skocznie }) => {
        this.gracze = gracze;
        this.skocznie = skocznie;

        const login = (this.auth.currentUser?.login ?? '').trim().toLowerCase();

        const gracz = this.gracze.find(
          g => (g.login_gracza ?? '').trim().toLowerCase() === login
        );

        if (!gracz?.id) {
          this.error = `Nie znaleziono gracza dla loginu: ${this.auth.currentUser?.login}`;
          this.loading = false;
          return;
        }

        this.form.graczId = gracz.id;

        if (this.skocznie.length > 0) {
          this.form.skoczniaId = this.skocznie[0].id ?? 0;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd ładowania danych formularza:', err);
        this.error = 'Błąd ładowania graczy lub skoczni.';
        this.loading = false;
      }
    });
  }

  private todayLocal(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  checkReplay(url?: string): void {
    this.error = '';
    this.success = '';

    if (!url || !url.trim()) {
      this.error = 'Podaj URL powtórki.';
      return;
    }

    this.checkingReplay = true;
    this.success = 'Sprawdzam powtórkę...';

    const payload = { url: url.trim() };
    console.log('replayDistance payload:', payload);

    this.api.replayDistance(payload).subscribe({
      next: (res: any) => {
        this.checkingReplay = false;
        console.log('replayDistance response:', res);

        if (res?.success && typeof res.length === 'number') {
          this.form.odleglosc = Math.round(res.length * 100) / 100;
          this.success = `Odległość uzupełniona: ${this.form.odleglosc} m`;
        } else {
          this.error = res?.error || 'Nie udało się odczytać odległości z powtórki.';
          this.success = '';
        }
      },
      error: (err) => {
        this.checkingReplay = false;
        console.error('replayDistance error:', err);
        console.error('replayDistance error body:', err?.error);

        this.error =
          err?.error?.message ||
          err?.error?.title ||
          (typeof err?.error === 'string' ? err.error : '') ||
          'Błąd podczas sprawdzania powtórki.';

        this.success = '';
      }
    });
  }

  save(): void {
    this.error = '';
    this.success = '';

    if (!this.form.graczId || this.form.graczId <= 0) {
      this.error = 'Nie znaleziono poprawnego gracza dla zalogowanego użytkownika.';
      return;
    }

    if (!this.form.skoczniaId || this.form.skoczniaId <= 0) {
      this.error = 'Wybierz skocznię.';
      return;
    }

    if (!this.form.odleglosc || Number(this.form.odleglosc) <= 0) {
      this.error = 'Podaj poprawną odległość skoku.';
      return;
    }

    if (!this.form.dataSkoku) {
      this.error = 'Wybierz datę skoku.';
      return;
    }

    const payload: WynikDto = {
      odleglosc: Number(this.form.odleglosc),
      dataSkoku: this.form.dataSkoku,
      graczId: Number(this.form.graczId),
      skoczniaId: Number(this.form.skoczniaId),
      link_powtorka: this.form.link_powtorka?.trim() || '',
      czy_upadek: !!this.form.czy_upadek
    };

    console.log('Dodawanie wyniku - payload:', payload);

    this.saving = true;

    this.api.addWynik(payload).subscribe({
      next: () => {
        this.saving = false;
        this.success = 'Wynik dodany pomyślnie! 🎉';

        setTimeout(() => {
          this.router.navigate(['/wyniki']);
        }, 1500);
      },
      error: (err) => {
        this.saving = false;
        console.error('addWynik error:', err);
        console.error('addWynik error body:', err?.error);

        if (err?.error?.errors) {
          const validationErrors = Object.entries(err.error.errors)
            .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
            .join(' | ');

          this.error = 'Błąd walidacji: ' + validationErrors;
          return;
        }

        this.error =
          'Błąd podczas dodawania wyniku: ' +
          (err?.error?.message ||
           err?.error?.title ||
           (typeof err?.error === 'string' ? err.error : '') ||
           'Spróbuj ponownie.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}