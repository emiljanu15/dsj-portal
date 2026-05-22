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

export interface Uzytkownik {
  id?: number;
  login: string;
  password?: string;
  dataUtworzenia?: string;
  czyAdmin?: boolean;
  graczId?: number;
}

export interface KomentarzDto {
  tresc: string;
  wynikId: number;
  uzytkownikId: number;
}

export interface Komentarz {
  id?: number;
  tresc: string;
  wynikId: number;
  uzytkownikId: number;
  dataUtworzenia?: string;
}

export interface WynikDto {
  odleglosc: number;
  dataSkoku: string;
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
