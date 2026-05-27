import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GraczeComponent } from './components/gracze/gracze.component';
import { WynikiGraczaComponent } from './components/gracze/wyniki-gracza.component';
import { SkocznieComponent } from './components/skocznie/skocznie.component';
import { UzytkownicyComponent } from './components/uzytkownicy/uzytkownicy.component';
import { KomentarzeComponent } from './components/komentarze/komentarze.component';
import { WynikiComponent } from './components/wyniki/wyniki.component';
import { LoginComponent } from './components/login/login.component';
import { RejestracjaComponent } from './components/rejestracja/rejestracja.component';
import { NavComponent } from './components/nav/nav.component';
import { PomoComponent } from './components/pomoc/pomoc.component';
import { DodajWynikComponent } from './components/dodaj-wynik/dodaj-wynik.component';
import { NewsyComponent } from './components/newsy/newsy.component';
import { TurniejeComponent } from './components/turnieje/turnieje.component';
import { WynikiTurniejowComponent } from './components/wyniki-turniejow/wyniki-turniejow.component';

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
    PomoComponent,
    DodajWynikComponent,
    TurniejeComponent,
    WynikiTurniejowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NewsyComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}