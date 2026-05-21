import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Uzytkownik } from '../../models/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-uzytkownicy',
  templateUrl: './uzytkownicy.component.html',
  styleUrls: ['./uzytkownicy.component.scss']
})
export class UzytkownicyComponent implements OnInit {
  uzytkownicy: Uzytkownik[] = [];
  loading = true;
  error = '';
  success = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    if (!this.auth.isAdmin) { this.error = 'Brak uprawnień – tylko admin.'; this.loading = false; return; }
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getUzytkownicy().subscribe({
      next: data => { this.uzytkownicy = data; this.loading = false; },
      error: () => { this.error = 'Błąd ładowania danych.'; this.loading = false; }
    });
  }

  delete(id: number): void {
    if (!confirm('Usunąć użytkownika?')) return;
    this.api.deleteUzytkownik(id).subscribe({
      next: () => { this.success = 'Użytkownik usunięty.'; this.load(); },
      error: () => { this.error = 'Błąd usuwania.'; }
    });
  }
}
