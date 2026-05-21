import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Komentarz, KomentarzDto } from '../../models/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-komentarze',
  templateUrl: './komentarze.component.html',
  styleUrls: ['./komentarze.component.scss']
})
export class KomentarzeComponent implements OnInit {
  komentarze: Komentarz[] = [];
  loading = true;
  error = '';
  success = '';

  showModal = false;
  editMode = false;
  editId: number | null = null;
  form: KomentarzDto = { tresc: '', wynikId: 0, uzytkownikId: 0 };

  // filter by wynikId
  filterWynikId: number | null = null;
  filterInput = '';

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getKomentarze().subscribe({
      next: data => { this.komentarze = data; this.loading = false; },
      error: () => { this.error = 'Błąd ładowania komentarzy.'; this.loading = false; }
    });
  }

  loadByWynik(): void {
    const id = parseInt(this.filterInput);
    if (isNaN(id)) { this.load(); return; }
    this.loading = true;
    this.api.getKomentarzeByWynik(id).subscribe({
      next: data => { this.komentarze = data; this.loading = false; },
      error: () => { this.error = 'Błąd ładowania.'; this.loading = false; }
    });
  }

  openAdd(): void {
    this.form = {
      tresc: '',
      wynikId: 0,
      uzytkownikId: this.auth.currentUser?.id ?? 0
    };
    this.editMode = false; this.editId = null; this.showModal = true;
  }

  openEdit(k: Komentarz): void {
    this.form = { tresc: k.tresc, wynikId: k.wynikId, uzytkownikId: k.uzytkownikId };
    this.editMode = true; this.editId = k.id!; this.showModal = true;
  }

  save(): void {
    if (this.editMode && this.editId) {
      this.api.updateKomentarz(this.editId, this.form).subscribe({
        next: () => { this.success = 'Zaktualizowano!'; this.showModal = false; this.load(); },
        error: () => { this.error = 'Błąd aktualizacji.'; }
      });
    } else {
      this.api.addKomentarz(this.form).subscribe({
        next: () => { this.success = 'Dodano komentarz!'; this.showModal = false; this.load(); },
        error: () => { this.error = 'Błąd dodawania.'; }
      });
    }
  }

  delete(id: number): void {
    if (!confirm('Usunąć komentarz?')) return;
    this.api.deleteKomentarz(id).subscribe({
      next: () => { this.success = 'Usunięto.'; this.load(); },
      error: () => { this.error = 'Błąd usuwania.'; }
    });
  }
}
