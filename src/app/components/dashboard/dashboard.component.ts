import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  gracze = 0;
  uzytkownicy = 0;
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    forkJoin({
      g: this.api.getGracze(),
      u: this.api.getUzytkownicy(),
    }).subscribe({
      next: res => {
        this.gracze      = res.g.length;
        this.uzytkownicy = res.u.length;
        this.loading     = false;
      },
      error: () => {
        this.error   = 'Nie można połączyć się z backendem. Sprawdź URL w api.service.ts.';
        this.loading = false;
      }
    });
  }
}
