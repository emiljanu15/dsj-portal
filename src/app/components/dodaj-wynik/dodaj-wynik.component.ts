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

    if (this.auth.currentUser?.id) {
      this.form.graczId = Number(this.auth.currentUser.id);
    }

    this.form.dataSkoku = this.todayLocal();

    this.api.getSkocznie().subscribe({
      next: (skocznie) => {
        this.skocznie = skocznie;
        this.loading = false;
      },
      error: () => {
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

  checkReplay(url?: string): void {
    this.error = '';
    this.success = '';

    if (!url || !url.trim()) {
      this.error = 'Podaj URL powtórki.';
      return;
    }

    this.success = 'Sprawdzam powtórkę...';

    this.api.replayDistance({ url: url.trim() }).subscribe({
      next: (res: any) => {
        if (res?.success && typeof res.length === 'number') {
          this.form.odleglosc = Math.round(res.length * 10) / 10;
          this.success = `Odległość uzupełniona: ${this.form.odleglosc} m`;
        } else {
          this.error = res?.error || 'Nie udało się odczytać odległości z powtórki.';
          this.success = '';
        }
      },
      error: () => {
        this.error = 'Błąd podczas sprawdzania powtórki.';
        this.success = '';
      }
    });
  }

  save(): void {
    this.error = '';
    this.success = '';

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
      this.error = 'Wybierz skocznię.';
      return;
    }

    if (!payload.odleglosc || payload.odleglosc <= 0) {
      this.error = 'Podaj poprawną odległość skoku.';
      return;
    }

    if (!payload.dataSkoku) {
      this.error = 'Wybierz datę skoku.';
      return;
    }

    this.saving = true;

    console.log('Dodawanie wyniku - payload:', payload, {
      graczIdType: typeof payload.graczId,
      skoczniaIdType: typeof payload.skoczniaId,
      odlegloscType: typeof payload.odleglosc
    });

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
        this.error =
          'Błąd podczas dodawania wyniku: ' +
          (err?.error?.message || err?.error?.title || 'Spróbuj ponownie.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}