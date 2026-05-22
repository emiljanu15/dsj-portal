import { Component } from '@angular/core';

@Component({
  selector: 'app-pomoc',
  templateUrl: './pomoc.component.html',
  styleUrls: ['./pomoc.component.scss']
})
export class PomoComponent {

  permissions = [
    { feature: '📊 Przeglądanie Dashboard',        user: true,  admin: true  },
    { feature: '⛰️ Przeglądanie skoczni',           user: true,  admin: true  },
    { feature: '🎿 Przeglądanie graczy i rankingu', user: true,  admin: true  },
    { feature: '🏆 Wyniki gracza (per skocznia)',   user: true,  admin: true  },
    { feature: '➕ Dodawanie wyników na skoczni',   user: true,  admin: true  },
    { feature: '🏆 Tabela wszystkich wyników',      user: false, admin: true  },
    { feature: '💬 Komentarze',                     user: false, admin: true  },
    { feature: '👤 Lista użytkowników',             user: false, admin: true  },
    { feature: '➕ Dodawanie / edycja graczy',      user: false, admin: true  },
    { feature: '➕ Dodawanie / edycja skoczni',     user: false, admin: true  },
    { feature: '➕ Dodawanie / edycja wyników',     user: false, admin: true  },
    { feature: '🗑️ Usuwanie danych',               user: false, admin: true  },
    { feature: '🗑️ Usuwanie użytkowników',         user: false, admin: true  },
  ];

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
