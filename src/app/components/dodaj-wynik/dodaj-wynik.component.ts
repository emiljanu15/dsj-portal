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
<<<<<<< HEAD
  checkingReplay = false;
=======
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
  error = '';
  success = '';

  form: WynikDto = {
    odleglosc: 0,
    dataSkoku: '',
    graczId: 0,
    skoczniaId: null as any,
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

<<<<<<< HEAD
    this.form.dataSkoku = this.todayLocal();
    this.form.graczId = Number(this.auth.currentUser?.graczId ?? 0);

    this.api.getSkocznie().subscribe({
      next: (skocznie) => {
        this.skocznie = skocznie;

        if (skocznie.length > 0) {
          this.form.skoczniaId = skocznie[0].id ?? 0;
        }

        console.log('currentUser:', this.auth.currentUser);
        console.log('graczId z auth:', this.form.graczId);

=======
    if (this.auth.currentUser?.id) {
      this.form.graczId = Number(this.auth.currentUser.id);
    }

    this.form.dataSkoku = this.todayLocal();

    this.api.getSkocznie().subscribe({
      next: (skocznie) => {
        this.skocznie = skocznie;
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
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

<<<<<<< HEAD
  private roundTo2(value: number): number {
    return Math.round(value * 100) / 100;
  }

=======
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
  checkReplay(url?: string): void {
    this.error = '';
    this.success = '';

    if (!url || !url.trim()) {
      this.error = 'Podaj URL powtórki.';
      return;
    }

<<<<<<< HEAD
    this.error = '';
    this.success = 'Sprawdzam powtórkę...';
    this.checkingReplay = true;

    this.api.replayDistance({ url }).subscribe({
=======
    this.success = 'Sprawdzam powtórkę...';

    this.api.replayDistance({ url: url.trim() }).subscribe({
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
      next: (res: any) => {
        this.checkingReplay = false;
        console.log('Replay response:', res);

        if (res?.success && typeof res.length === 'number') {
          this.form.odleglosc = this.roundTo2(res.length);
          
          this.success = `Odległość uzupełniona: ${this.form.odleglosc.toFixed(2)} m`;
          console.log('res.length =', res.length, 'type:', typeof res.length);
const rounded = Math.round(res.length * 100) / 100;
console.log('rounded =', rounded, 'type:', typeof rounded);
this.form.odleglosc = rounded;
console.log('form.odleglosc after set =', this.form.odleglosc, 'type:', typeof this.form.odleglosc);
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

<<<<<<< HEAD
    const currentGraczId = Number(this.auth.currentUser?.graczId ?? 0);
    this.form.graczId = currentGraczId;

    if (!this.form.graczId || this.form.graczId <= 0) {
      this.error = 'Brak poprawnie powiązanego gracza dla zalogowanego użytkownika.';
      return;
    }

    if (!this.form.skoczniaId || this.form.skoczniaId <= 0) {
=======
    const payload: WynikDto = {
      ...this.form,
      odleglosc: Number(this.form.odleglosc),
      dataSkoku: this.form.dataSkoku,
      graczId: Number(this.form.graczId),
      skoczniaId: Number(this.form.skoczniaId),
      link_powtorka: this.form.link_powtorka?.trim() || '',
      czy_upadek: !!this.form.czy_upadek
    };

    if (!payload.graczId || payload.graczId <= 0) {
      this.error = 'Nieprawidłowy użytkownik. Zaloguj się ponownie.';
      return;
    }

    if (!payload.skoczniaId || payload.skoczniaId <= 0) {
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
      this.error = 'Wybierz skocznię.';
      return;
    }

<<<<<<< HEAD
    if (!this.form.odleglosc || Number(this.form.odleglosc) <= 0) {
=======
    if (!payload.odleglosc || payload.odleglosc <= 0) {
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
      this.error = 'Podaj poprawną odległość skoku.';
      return;
    }

<<<<<<< HEAD
    if (!this.form.dataSkoku) {
=======
    if (!payload.dataSkoku) {
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
      this.error = 'Wybierz datę skoku.';
      return;
    }

<<<<<<< HEAD
    const payload: WynikDto = {
      odleglosc: this.roundTo2(Number(this.form.odleglosc)),
      dataSkoku: this.form.dataSkoku,
      graczId: currentGraczId,
      skoczniaId: Number(this.form.skoczniaId),
      link_powtorka: this.form.link_powtorka?.trim() || '',
      czy_upadek: !!this.form.czy_upadek
    };

    console.log('Dodawanie wyniku - payload:', payload);

    this.saving = true;

=======
    this.saving = true;

    console.log('Dodawanie wyniku - payload:', payload, {
      graczIdType: typeof payload.graczId,
      skoczniaIdType: typeof payload.skoczniaId,
      odlegloscType: typeof payload.odleglosc
    });

>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
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
<<<<<<< HEAD
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
=======
        this.error =
          'Błąd podczas dodawania wyniku: ' +
          (err?.error?.message || err?.error?.title || 'Spróbuj ponownie.');
>>>>>>> 7684d124e48770821f7da1e2d3bb7c71c5a001b6
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}