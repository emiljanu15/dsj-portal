import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Uzytkownik } from '../../models/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  login = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (!this.login || !this.password) { this.error = 'Podaj login i hasło.'; return; }
    this.loading = true;
    this.error = '';

    const payload: Uzytkownik = { login: this.login, password: this.password };

    this.api.logowanie(payload).subscribe({
      next: (res: any) => {
        // Backend może zwrócić obiekt użytkownika lub obiekt zawierający pole user.
        const user: Uzytkownik = res?.user ?? res ?? { login: this.login, czyAdmin: false };
        this.auth.setUser(user);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Nieprawidłowy login lub hasło.';
        this.loading = false;
      }
    });
  }
}
