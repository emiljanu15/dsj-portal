import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent }   from './components/dashboard/dashboard.component';
import { GraczeComponent }      from './components/gracze/gracze.component';
import { SkocznieComponent }    from './components/skocznie/skocznie.component';
import { UzytkownicyComponent } from './components/uzytkownicy/uzytkownicy.component';
import { KomentarzeComponent }  from './components/komentarze/komentarze.component';
import { WynikiComponent }      from './components/wyniki/wyniki.component';
import { LoginComponent }       from './components/login/login.component';
import { RejestracjaComponent } from './components/rejestracja/rejestracja.component';

const routes: Routes = [
  { path: '',             component: DashboardComponent },
  { path: 'gracze',      component: GraczeComponent },
  { path: 'skocznie',    component: SkocznieComponent },
  { path: 'wyniki',      component: WynikiComponent },
  { path: 'komentarze',  component: KomentarzeComponent },
  { path: 'uzytkownicy', component: UzytkownicyComponent },
  { path: 'login',       component: LoginComponent },
  { path: 'rejestracja', component: RejestracjaComponent },
  { path: '**',          redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
