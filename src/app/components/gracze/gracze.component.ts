import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Gracz, Wynik } from '../../models/models';

interface GraczZeSuma extends Gracz {
  sumaRekordow: number;
  liczbaSkoczni: number;
}

@Component({
  selector: 'app-gracze',
  templateUrl: './gracze.component.html',
  styleUrls: ['./gracze.component.scss']
})
export class GraczeComponent implements OnInit {
  gracze: GraczZeSuma[] = [];
  loading = true;
  error = '';
  success = '';

  showModal = false;
  editMode = false;
  form: Gracz = { login_gracza: '' };
  editId: number | null = null;

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit(): void { 
    this.load(); 
  }

  load(): void {
    this.loading = true;
    forkJoin({ gracze: this.api.getGracze(), wyniki: this.api.getWyniki() }).subscribe({
      next: ({ gracze, wyniki }) => {
        this.gracze = gracze.map(g => {
          const wynikGracza = wyniki.filter(w => w.gracz?.id === g.id || (w as any).graczId === g.id);
          
          // Grupuj po skoczni, bierz max z każdej
          const maxPerSkocznia = new Map<number, number>();
          wynikGracza.forEach(w => {
            const sid = w.skocznia?.id ?? (w as any).skoczniaId ?? 0;
            if (!sid) return;
            if (!maxPerSkocznia.has(sid) || w.odleglosc > maxPerSkocznia.get(sid)!) {
              maxPerSkocznia.set(sid, w.odleglosc);
            }
          });
          
          // Zwracamy czystą, dokładną sumę skoków bez zaokrągleń matematycznych (formatowaniem zajmie się HTML pipe)
          const suma = Array.from(maxPerSkocznia.values()).reduce((a, b) => a + b, 0);
          return { 
            ...g, 
            sumaRekordow: suma, 
            liczbaSkoczni: maxPerSkocznia.size 
          };
        });
        
        // Sortuj po sumie rekordów malejąco
        this.gracze.sort((a, b) => b.sumaRekordow - a.sumaRekordow);
        this.loading = false;
      },
      error: () => { 
        this.error = 'Błąd ładowania danych.'; 
        this.loading = false; 
      }
    });
  }

  openAdd(): void { 
    this.form = { login_gracza: '' }; 
    this.editMode = false; 
    this.editId = null; 
    this.showModal = true; 
  }

  openEdit(g: Gracz): void { 
    this.form = { ...g }; 
    this.editMode = true; 
    this.editId = g.id!; 
    this.showModal = true; 
  }

  save(): void {
    const obs = this.editMode && this.editId
      ? this.api.updateGracz(this.editId, this.form)
      : this.api.addGracz(this.form);
    obs.subscribe({
      next: () => { 
        this.success = this.editMode ? 'Zaktualizowano!' : 'Dodano gracza!'; 
        this.showModal = false; 
        this.load(); 
      },
      error: () => { 
        this.error = 'Błąd zapisu.'; 
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Usunąć gracza?')) return;
    this.api.deleteGracz(id).subscribe({
      next: () => { 
        this.success = 'Usunięto.'; 
        this.load(); 
      },
      error: () => { 
        this.error = 'Błąd usuwania.'; 
      }
    });
  }
}