import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule }               from '@angular/platform-browser';
import { HttpClientModule }            from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule }     from './app-routing.module';
import { AppComponent }         from './app.component';
import { NavComponent }         from './components/nav/nav.component';
import { DashboardComponent }   from './components/dashboard/dashboard.component';
import { GraczeComponent }      from './components/gracze/gracze.component';
import { SkocznieComponent }    from './components/skocznie/skocznie.component';
import { UzytkownicyComponent } from './components/uzytkownicy/uzytkownicy.component';
import { KomentarzeComponent }  from './components/komentarze/komentarze.component';
import { WynikiComponent }      from './components/wyniki/wyniki.component';
import { LoginComponent }       from './components/login/login.component';
import { RejestracjaComponent } from './components/rejestracja/rejestracja.component';
import { WynikiGraczaComponent } from './components/gracze/wyniki-gracza.component';
import { AuthService }          from './services/auth.service';

export function initAuth(auth: AuthService): () => void {
  return () => auth.loadFromStorage();
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    GraczeComponent,
    SkocznieComponent,
    WynikiGraczaComponent,
    UzytkownicyComponent,
    KomentarzeComponent,
    WynikiComponent,
    LoginComponent,
    RejestracjaComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
