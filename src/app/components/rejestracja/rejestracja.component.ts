import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rejestracja',
  templateUrl: './rejestracja.component.html',
  styleUrls: ['./rejestracja.component.scss']
})
export class RejestracjaComponent {
  login    = '';
  password = '';
  password2 = '';
  error    = '';
  success  = '';
  loading  = false;

  constructor(private api: ApiService, private router: Router) {}

  submit(): void {
    if (!this.login || !this.password) { this.error = 'Uzupełnij wszystkie pola.'; return; }
    if (this.password !== this.password2) { this.error = 'Hasła nie są identyczne.'; return; }
    this.loading = true; this.error = '';

    this.api.rejestracja({ login: this.login, password: this.password }).subscribe({
      next: () => {
        // After user registration, try to create a matching Gracz record (best-effort)
        this.api.addGracz({ login_gracza: this.login }).subscribe({
          next: () => {},
          error: () => { console.warn('Nie udało się utworzyć rekordu Gracz (może już istnieje).'); }
        });

        this.success = 'Konto zostało utworzone! Możesz się teraz zalogować.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: () => { this.error = 'Błąd rejestracji. Login może być zajęty.'; this.loading = false; }
    });
  }
}
