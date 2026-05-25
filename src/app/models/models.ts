// ==========================================
// GRACZ & SKOCZNIA
// ==========================================

export interface Gracz {
  id?: number;
  login_gracza: string;
  dataUtworzenia?: string;
}

export interface Skocznia {
  id?: number;
  nazwa: string;
  lokalizacja: string;
  punkt_k: number;
  dataUtworzenia?: string;
}

// ==========================================
// UZYTKOWNIK
// ==========================================

export interface Uzytkownik {
  id?: number;
  login: string;
  password?: string;
  dataUtworzenia?: string;
  czyAdmin?: boolean;
  graczId?: number;
}

// ==========================================
// WYNIKI & REPLAY SCRAPER
// ==========================================

export interface WynikDto {
  odleglosc: number;
  dataSkoku: string; // Format 'YYYY-MM-DD' z racji typu date w Swaggerze
  graczId: number;
  skoczniaId: number;
  link_powtorka?: string;
  czy_upadek: boolean;
}

export interface Wynik {
  id?: number;
  odleglosc: number;
  dataSkoku: string;
  gracz?: Gracz;
  skocznia?: Skocznia;
  link_powtorka?: string;
  czy_upadek: boolean;
}

export interface ReplayDistanceRequest {
  url?: string;
}

export interface ReplayDistanceResponse {
  success: boolean;
  length?: number | null;
  lengthRaw?: string | null;
  error?: string | null;
}

// ==========================================
// KOMENTARZE
// ==========================================

export interface KomentarzDto {
  tresc: string;
  wynikId: number;
  uzytkownikId: number;
}

// Zaktualizowany model struktury zwracanej przez Twój KomentarzController (obiekt anonimowy)
export interface KomentarzResponse {
  id: number;
  tresc: string;
  dataDodania: string;
  wynikId: number;
  wynik: {
    id: number;
  } | null;
  uzytkownikId: number;
  uzytkownik: {
    id: number;
    login: string;
    czyAdmin: boolean;
  } | null;
}

// Stary model pomocniczy (w razie gdybyś go gdzieś używał bezpośrednio)
export interface Komentarz {
  id?: number;
  tresc: string;
  wynikId: number;
  uzytkownikId: number;
  dataUtworzenia?: string;
}

// ==========================================
// NEWSY (Nowy Moduł)
// ==========================================

export interface NewsDto {
  tresc: string;
  uzytkownikId: number;
}

// Dokładna struktura zwracana przez NewsController.GetNews()
export interface NewsResponse {
  id: number;
  tresc: string;
  dataDodania: string;
  uzytkownikId: number;
  uzytkownik: {
    id: number;
    login: string;
    czyAdmin: boolean;
  } | null;
}