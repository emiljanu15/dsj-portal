import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent }   from './components/dashboard/dashboard.component';
import { GraczeComponent }      from './components/gracze/gracze.component';
import { SkocznieComponent }    from './components/skocznie/skocznie.component';
import { UzytkownicyComponent } from './components/uzytkownicy/uzytkownicy.component';
import { KomentarzeComponent }  from './components/komentarze/komentarze.component';
import { WynikiComponent }      from './components/wyniki/wyniki.component';
import { WynikiGraczaComponent } from './components/gracze/wyniki-gracza.component';
import { LoginComponent }       from './components/login/login.component';
import { RejestracjaComponent } from './components/rejestracja/rejestracja.component';
import { PomoComponent }        from './components/pomoc/pomoc.component'; 
import { DodajWynikComponent }  from './components/dodaj-wynik/dodaj-wynik.component'; 
import { NewsyComponent }       from './components/newsy/newsy.component'; // ← TUTAJ IMPORT

const routes: Routes = [
  { path: '',             component: DashboardComponent },
  { path: 'newsy',        component: NewsyComponent },       // ← TUTAJ ŚCIEŻKA
  { path: 'gracze',       component: GraczeComponent },
  { path: 'skocznie',     component: SkocznieComponent },
  { path: 'wyniki',       component: WynikiComponent },
  { path: 'gracz/:id/wyniki', component: WynikiGraczaComponent },
  { path: 'komentarze',   component: KomentarzeComponent },
  { path: 'uzytkownicy', component: UzytkownicyComponent },
  { path: 'login',        component: LoginComponent },
  { path: 'rejestracja', component: RejestracjaComponent },
  { path: 'pomoc',        component: PomoComponent },        
  { path: 'dodaj-wynik', component: DodajWynikComponent }, 
  { path: '**',           redirectTo: '' }                   // Ważne: to musi być zawsze na samym dole
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}