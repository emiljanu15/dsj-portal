import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
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
  public auth = inject(AuthService); // public, aby HTML widział auth.isAdmin oraz auth.currentUser

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

    const dto: NewsDto = {
      tresc = this.newsForm.value.tresc ?? '',
      uzytkownikId = this.auth.currentUser?.id || 1 
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

  // 🔴 METODA USUWANIA DLA ADMINA
  onDeleteNews(id: number) {
    if (!id) return;

    if (confirm('Czy na pewno chcesz bezpowrotnie usunąć ten wpis?')) {
      this.apiService.deleteNews(id).subscribe({
        next: () => {
          this.alertClass = 'alert-success';
          this.statusMessage = 'Wpis został usunięty.';
          this.loadAllNews(); // Odświeżamy listę, żeby usunięty news zniknął z ekranu
          setTimeout(() => this.statusMessage = '', 3000);
        },
        error: (err) => {
          console.error('Błąd podczas usuwania newsa:', err);
          this.alertClass = 'alert-danger';
          this.statusMessage = `Nie udało się usunąć wpisu: ${err.error || err.message}`;
          setTimeout(() => this.statusMessage = '', 4000);
        }
      });
    }
  }
}