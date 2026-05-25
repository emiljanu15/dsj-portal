import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service'; // <-- Zaimportuj swój AuthService (popraw ścieżkę jeśli trzeba)
import { NewsResponse, NewsDto } from '../../models/models';

@Component({
  selector: 'app-newsy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newsy.component.html',
  styleUrl: './newsy.component.scss'
})
export class NewsyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  public auth = inject(AuthService); // <-- Wstrzyknij jako PUBLIC, żeby HTML widział auth.isAdmin

  newsList: NewsResponse[] = [];
  loading = true;
  statusMessage = '';
  alertClass = '';

  newsForm = this.fb.group({
    tresc: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit() {
    this.loadAllNews();
  }

  loadAllNews() {
    this.loading = true;
    this.apiService.getNews().subscribe({
      next: (data) => {
        this.newsList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd ładowania newsów:', err);
        this.loading = false;
      }
    });
  }

  onAddNews() {
    if (this.newsForm.invalid) return;

    // Pobieramy ID dynamicznie z Twojego serwisu auth, jeśli user jest zalogowany
    const dto: NewsDto = {
      tresc: this.newsForm.value.tresc ?? '',
      uzytkownikId: this.auth.currentUser?.id || 1 
    };

    this.apiService.addNews(dto).subscribe({
      next: (res) => {
        this.alertClass = 'alert-success';
        this.statusMessage = 'Wpis opublikowany pomyślnie!';
        this.newsForm.reset();
        this.loadAllNews();
        setTimeout(() => this.statusMessage = '', 3000);
      },
      error: (err) => {
        this.alertClass = 'alert-danger';
        this.statusMessage = `Problem przy publikacji: ${err.error || err.message}`;
      }
    });
  }
}