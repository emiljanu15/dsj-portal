import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Sezon, Turniej, UczestnikTurnieju } from '../../models/models';

@Component({
  selector: 'app-turnieje',
  templateUrl: './turnieje.component.html',
  styleUrls: ['./turnieje.component.scss']
})
export class TurniejeComponent implements OnInit {
  sezony: Sezon[] = [];
  turnieje: Turniej[] = [];
  uczestnicy: UczestnikTurnieju[] = [];
  ranking: UczestnikTurnieju[] = [];

  wybranySezon: Sezon | null = null;
  wybranyTurniej: Turniej | null = null;

  loading = true;
  rankingLoading = false;
  error = '';
  success = '';

  showSezonModal = false;
  editSezonMode = false;
  editSezonId: number | null = null;
  sezonForm: Sezon = { nazwa: '' };

  showTurniejModal = false;
  editTurniejMode = false;
  editTurniejId: number | null = null;
  turniejForm: Turniej = { nazwa: '', sezonId: 0 };

  showUczestnikModal = false;
  editUczestnikMode = false;
  editUczestnikId: number | null = null;
  uczestnikForm: UczestnikTurnieju = { nazwa_uczestnika: '', punkty: 0, miejsce: 0 };

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  get turniejeFiltrowane(): Turniej[] {
    if (!this.wybranySezon?.id) return [];
    return this.turnieje.filter(t => t.sezonId === this.wybranySezon?.id);
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    forkJoin({
      sezony: this.api.getSezony(),
      turnieje: this.api.getTurnieje(),
      uczestnicy: this.api.getUczestnicyTurnieju()
    }).subscribe({
      next: res => {
        this.sezony = res.sezony;
        this.turnieje = res.turnieje;
        this.uczestnicy = res.uczestnicy;
        this.loading = false;
      },
      error: () => {
        this.error = 'Błąd ładowania danych.';
        this.loading = false;
      }
    });
  }

  selectSezon(sezon: Sezon): void {
    this.wybranySezon = sezon;
    this.wybranyTurniej = null;
    this.ranking = [];
  }

  selectTurniej(turniej: Turniej): void {
    this.wybranyTurniej = turniej;
    this.loadRanking(turniej.id!);
  }

  loadRanking(turniejId: number): void {
    this.rankingLoading = true;
    this.api.getRankingTurnieju(turniejId).subscribe({
      next: data => {
        this.ranking = data;
        this.rankingLoading = false;
      },
      error: () => {
        this.error = 'Błąd ładowania rankingu turnieju.';
        this.rankingLoading = false;
      }
    });
  }

  openAddSezon(): void {
    this.editSezonMode = false;
    this.editSezonId = null;
    this.sezonForm = { nazwa: '' };
    this.showSezonModal = true;
  }

  openEditSezon(sezon: Sezon): void {
    this.editSezonMode = true;
    this.editSezonId = sezon.id ?? null;
    this.sezonForm = { ...sezon };
    this.showSezonModal = true;
  }

  deleteSezon(id: number): void {
    if (!confirm('Czy na pewno usunąć sezon?')) return;

    this.api.deleteSezon(id).subscribe({
      next: () => {
        this.success = 'Sezon został usunięty.';
        this.loadAll();
      },
      error: () => {
        this.error = 'Błąd usuwania sezonu.';
      }
    });
  }

  saveSezon(): void {
    if (!this.sezonForm.nazwa?.trim()) {
      this.error = 'Podaj nazwę sezonu.';
      return;
    }

    if (this.editSezonMode && this.editSezonId) {
      this.api.updateSezon(this.editSezonId, this.sezonForm).subscribe({
        next: () => {
          this.success = 'Sezon został zaktualizowany.';
          this.showSezonModal = false;
          this.loadAll();
        },
        error: () => {
          this.error = 'Błąd aktualizacji sezonu.';
        }
      });
    } else {
      this.api.createSezon(this.sezonForm).subscribe({
        next: () => {
          this.success = 'Sezon został dodany.';
          this.showSezonModal = false;
          this.loadAll();
        },
        error: () => {
          this.error = 'Błąd dodawania sezonu.';
        }
      });
    }
  }

  openAddTurniej(): void {
    this.editTurniejMode = false;
    this.editTurniejId = null;
    this.turniejForm = {
      nazwa: '',
      sezonId: this.wybranySezon?.id ?? 0
    };
    this.showTurniejModal = true;
  }

  openEditTurniej(turniej: Turniej): void {
    this.editTurniejMode = true;
    this.editTurniejId = turniej.id ?? null;
    this.turniejForm = { ...turniej };
    this.showTurniejModal = true;
  }

  deleteTurniej(id: number): void {
    if (!confirm('Czy na pewno usunąć turniej?')) return;

    this.api.deleteTurniej(id).subscribe({
      next: () => {
        this.success = 'Turniej został usunięty.';
        this.loadAll();
      },
      error: () => {
        this.error = 'Błąd usuwania turnieju.';
      }
    });
  }

  saveTurniej(): void {
    if (!this.turniejForm.nazwa?.trim()) {
      this.error = 'Podaj nazwę turnieju.';
      return;
    }

    if (!this.turniejForm.sezonId) {
      this.error = 'Wybierz sezon.';
      return;
    }

    if (this.editTurniejMode && this.editTurniejId) {
      this.api.updateTurniej(this.editTurniejId, this.turniejForm).subscribe({
        next: () => {
          this.success = 'Turniej został zaktualizowany.';
          this.showTurniejModal = false;
          this.loadAll();
        },
        error: () => {
          this.error = 'Błąd aktualizacji turnieju.';
        }
      });
    } else {
      this.api.createTurniej(this.turniejForm).subscribe({
        next: () => {
          this.success = 'Turniej został dodany.';
          this.showTurniejModal = false;
          this.loadAll();
        },
        error: () => {
          this.error = 'Błąd dodawania turnieju.';
        }
      });
    }
  }

  openAddUczestnik(): void {
    this.editUczestnikMode = false;
    this.editUczestnikId = null;
    this.uczestnikForm = {
      nazwa_uczestnika: '',
      punkty: 0,
      miejsce: 0,
      turniej: this.wybranyTurniej ?? undefined
    };
    this.showUczestnikModal = true;
  }

  openEditUczestnik(u: UczestnikTurnieju): void {
    this.editUczestnikMode = true;
    this.editUczestnikId = u.id ?? null;
    this.uczestnikForm = { ...u };
    this.showUczestnikModal = true;
  }

  deleteUczestnik(id: number): void {
    if (!confirm('Czy na pewno usunąć uczestnika?')) return;

    this.api.deleteUczestnikTurnieju(id).subscribe({
      next: () => {
        this.success = 'Uczestnik został usunięty.';
        this.loadAll();
        if (this.wybranyTurniej?.id) {
          this.loadRanking(this.wybranyTurniej.id);
        }
      },
      error: () => {
        this.error = 'Błąd usuwania uczestnika.';
      }
    });
  }

  saveUczestnik(): void {
    if (!this.uczestnikForm.nazwa_uczestnika?.trim()) {
      this.error = 'Podaj nazwę uczestnika.';
      return;
    }

    const payload: UczestnikTurnieju = {
      ...this.uczestnikForm,
      turniej: this.wybranyTurniej ?? this.uczestnikForm.turniej
    };

    if (this.editUczestnikMode && this.editUczestnikId) {
      this.api.updateUczestnikTurnieju(this.editUczestnikId, payload).subscribe({
        next: () => {
          this.success = 'Uczestnik został zaktualizowany.';
          this.showUczestnikModal = false;
          this.loadAll();
          if (this.wybranyTurniej?.id) {
            this.loadRanking(this.wybranyTurniej.id);
          }
        },
        error: () => {
          this.error = 'Błąd aktualizacji uczestnika.';
        }
      });
    } else {
      this.api.createUczestnikTurnieju(payload).subscribe({
        next: () => {
          this.success = 'Uczestnik został dodany.';
          this.showUczestnikModal = false;
          this.loadAll();
          if (this.wybranyTurniej?.id) {
            this.loadRanking(this.wybranyTurniej.id);
          }
        },
        error: () => {
          this.error = 'Błąd dodawania uczestnika.';
        }
      });
    }
  }
}