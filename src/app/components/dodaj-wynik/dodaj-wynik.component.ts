import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
  error = '';
  success = '';
  
  form: WynikDto = {
    odleglosc: 0,
    dataSkoku: new Date().toISOString().split('T')[0],
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
    // Sprawdź czy użytkownik jest zalogowany
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // Ustaw graczId na ID zalogowanego użytkownika
    if (this.auth.currentUser?.id) {
      this.form.graczId = this.auth.currentUser.id;
    }

    // Załaduj dostępne skocznie
    this.api.getSkocznie().subscribe({
      next: skocznie => {
        this.skocznie = skocznie;
        if (skocznie.length > 0) {
          this.form.skoczniaId = skocznie[0].id!;
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Błąd ładowania skoczni.';
        this.loading = false;
      }
    });
  }

  // Sprawdź powtórkę i uzupełnij odległość
  checkReplay(url?: string): void {
    if (!url || !url.trim()) {
      this.error = 'Podaj URL powtórki.';
      return;
    }
    this.error = '';
    this.success = 'Sprawdzam powtórkę...';
    this.api.replayDistance({ url }).subscribe({
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

  // Wyślij formularz
  save(): void {
    if (!this.form.odleglosc || !this.form.skoczniaId || !this.form.graczId) {
      this.error = 'Wypełnij wszystkie wymagane pola.';
      return;
    }

    this.api.addWynik(this.form).subscribe({
      next: () => {
        this.success = 'Wynik dodany pomyślnie! 🎉';
        setTimeout(() => {
          this.router.navigate(['/wyniki']);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Błąd podczas dodawania wyniku: ' + (err?.error?.message || 'Spróbuj ponownie.');
      }
    });
  }

  // Anuluj i wróć do dashboard
  cancel(): void {
    this.router.navigate(['/']);
  }
}
