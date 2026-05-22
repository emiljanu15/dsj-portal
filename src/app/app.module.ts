// ============================================================
//  Fragment app.module.ts – dodaj poniższe linie (oznaczone ←)
// ============================================================

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent }   from './components/dashboard/dashboard.component';
import { GraczeComponent }      from './components/gracze/gracze.component';
import { WynikiGraczaComponent } from './components/gracze/wyniki-gracza.component';
import { SkocznieComponent }    from './components/skocznie/skocznie.component';
import { UzytkownicyComponent } from './components/uzytkownicy/uzytkownicy.component';
import { KomentarzeComponent }  from './components/komentarze/komentarze.component';
import { WynikiComponent }      from './components/wyniki/wyniki.component';
import { LoginComponent }       from './components/login/login.component';
import { RejestracjaComponent } from './components/rejestracja/rejestracja.component';
import { NavComponent }         from './components/nav/nav.component';
import { PomoComponent }        from './components/pomoc/pomoc.component';  // ← DODAJ

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    GraczeComponent,
    WynikiGraczaComponent,
    SkocznieComponent,
    UzytkownicyComponent,
    KomentarzeComponent,
    WynikiComponent,
    LoginComponent,
    RejestracjaComponent,
    PomoComponent,  // ← DODAJ
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
