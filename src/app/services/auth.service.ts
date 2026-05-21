import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Uzytkownik } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<Uzytkownik | null>(null);
  user$ = this._user.asObservable();

  get currentUser(): Uzytkownik | null { return this._user.value; }
  get isLoggedIn(): boolean { return !!this._user.value; }
  get isAdmin(): boolean { return !!this._user.value?.czyAdmin; }

  setUser(u: Uzytkownik | null): void {
    this._user.next(u);
    if (u) localStorage.setItem('dsj_user', JSON.stringify(u));
    else localStorage.removeItem('dsj_user');
  }

  loadFromStorage(): void {
    const saved = localStorage.getItem('dsj_user');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      const user = parsed?.user ?? parsed;
      this._user.next(user);
    } catch {}
  }

  logout(): void { this.setUser(null); }
}
