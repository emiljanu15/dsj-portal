import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { Uzytkownik, Gracz } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<Uzytkownik | null>(null);
  user$ = this._user.asObservable();

  constructor(private api: ApiService) {}

  get currentUser(): Uzytkownik | null {
    return this._user.value;
  }

  get isLoggedIn(): boolean {
    return !!this._user.value;
  }

  get isAdmin(): boolean {
    return !!this._user.value?.czyAdmin;
  }

  async setUser(u: Uzytkownik | null): Promise<void> {
    if (!u) {
      this._user.next(null);
      localStorage.removeItem('dsj_user');
      return;
    }

    const enrichedUser = await this.ensurePlayerForUser(u);
    this._user.next(enrichedUser);
    localStorage.setItem('dsj_user', JSON.stringify(enrichedUser));
  }

  async loadFromStorage(): Promise<void> {
    const saved = localStorage.getItem('dsj_user');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const user = parsed?.user ?? parsed;

      if (!user) return;

      const enrichedUser = await this.ensurePlayerForUser(user);
      this._user.next(enrichedUser);
      localStorage.setItem('dsj_user', JSON.stringify(enrichedUser));
    } catch (err) {
      console.error('Błąd loadFromStorage:', err);
      this._user.next(null);
      localStorage.removeItem('dsj_user');
    }
  }

  logout(): void {
    this._user.next(null);
    localStorage.removeItem('dsj_user');
  }

  private async ensurePlayerForUser(user: Uzytkownik): Promise<Uzytkownik> {
    const login = String(user.login ?? '').trim();

    if (!login) {
      return user;
    }

    try {
      const gracze = await firstValueFrom(this.api.getGracze());

      let gracz = gracze.find(g =>
        String(g.login_gracza ?? '').trim().toLowerCase() === login.toLowerCase()
      );

      if (!gracz) {
        const nowyGracz: Gracz = {
          login_gracza: login
        };

        gracz = await firstValueFrom(this.api.addGracz(nowyGracz));
      }

      return {
        ...user,
        graczId: gracz.id
      };
    } catch (err) {
      console.error('Błąd ensurePlayerForUser:', err);
      return user;
    }
  }
}