import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { WynikDto, Skocznia } from '../../models/models';

@Component({
  selector: 'app-dodaj-wynik',
  templateUrl: './dodaj-wynik.component.html',
  styleUrls: ['./dodaj-wynik.component.scss']
})
export class DodajWynikComponent implements OnInit {
  skocznie: Skocznia[] = [];
  loading = true;
  saving = false;
  checkingReplay = false;
  error = '';
  success = '';

  odlegloscInput = '0.00';

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
    this.form.graczId = Number(this.auth.currentUser?.graczId ?? 0);
    this.odlegloscInput = '0.00';

    this.api.getSkocznie().subscribe({
      next: (skocznie) => {
        this.skocznie = skocznie;

        if (skocznie.length > 0) {
          this.form.skoczniaId = skocznie[0].id ?? 0;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd ładowania skoczni:', err);
        this.error = 'Błąd ładowania skoczni.';
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

  private parseOdleglosc(value: string): number {
    const normalized = String(value ?? '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '')
      .trim();

    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }

  private roundTo2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  formatOdleglosc(): void {
    const parsed = this.parseOdleglosc(this.odlegloscInput);

    if (parsed < 0) {
      this.form.odleglosc = 0;
      this.odlegloscInput = '0.00';
      return;
    }

    const rounded = this.roundTo2(parsed);
    this.form.odleglosc = rounded;
    this.odlegloscInput = rounded.toFixed(2);
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

    this.api.replayDistance({ url: url.trim() }).subscribe({
      next: (res: any) => {
        this.checkingReplay = false;
        console.log('Replay response:', res);

        if (res?.success) {
          let value = 0;

          if (typeof res.lengthRaw === 'string' && res.lengthRaw.trim()) {
            value = this.parseOdleglosc(res.lengthRaw);
          } else if (typeof res.length === 'number') {
            value = this.roundTo2(res.length);
          } else if (typeof res.length === 'string') {
            value = this.parseOdleglosc(res.length);
          }

          const rounded = this.roundTo2(value);

          this.form.odleglosc = rounded;
          this.odlegloscInput = rounded.toFixed(2);
          this.success = `Odległość uzupełniona: ${this.odlegloscInput} m`;
        } else {
          this.error = res?.error || 'Nie udało się odczytać odległości z powtórki.';
          this.success = '';
        }
      },
      error: (err) => {
        this.checkingReplay = false;
        console.error('replayDistance error:', err);
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

    this.formatOdleglosc();

    const currentGraczId = Number(this.auth.currentUser?.graczId ?? 0);
    this.form.graczId = currentGraczId;

    if (!this.form.graczId || this.form.graczId <= 0) {
      this.error = 'Brak poprawnie powiązanego gracza dla zalogowanego użytkownika.';
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
      odleglosc: this.roundTo2(this.parseOdleglosc(this.odlegloscInput)),
      dataSkoku: this.form.dataSkoku,
      graczId: currentGraczId,
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