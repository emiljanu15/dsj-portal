# DSJ Portal – Angular Frontend

Portal dla gry DSJ (Deluxe Ski Jump) do zarządzania graczami, skoczniami i komentarzami.

## Wymagania

- Node.js 18+
- Angular CLI 17+Working

## Instalacja

```bash
npm install
```
--ostateczne poprawki
## Konfiguracja backendu

Otwórz plik:
```
src/app/services/api.service.ts
```

Zmień URL backendu:
```typescript
private base = 'https://localhost:7000/api';  // ← TWÓJ URL
```

## Uruchomienie
--working
```bash
ng serve
```
Aplikacja dostępna pod: http://localhost:4200

## Budowanie produkcyjne

```bash
ng build --configuration production
```

## Struktura projektu

```
src/app/
├── models/
│   └── models.ts              # Interfejsy TypeScript (Gracz, Skocznia, Uzytkownik, Komentarz)
├── services/
│   ├── api.service.ts         # Wszystkie wywołania REST API
│   └── auth.service.ts        # Zarządzanie sesją (localStorage)
└── components/
    ├── nav/                   # Pasek nawigacji
    ├── dashboard/             # Strona główna ze statystykami
    ├── gracze/                # CRUD graczy
    ├── skocznie/              # CRUD skoczni
    ├── uzytkownicy/           # Lista użytkowników (tylko admin)
    ├── komentarze/            # CRUD komentarzy + filtrowanie po wynikId
    ├── login/                 # Formularz logowania
    └── rejestracja/           # Formularz rejestracji
```

## Endpointy API

| Moduł        | Metoda | Endpoint                          |
|--------------|--------|-----------------------------------|
| Gracze       | GET    | /api/Gracz                        |
| Gracze       | POST   | /api/Gracz                        |
| Gracze       | PUT    | /api/Gracz/{id}                   |
| Gracze       | DELETE | /api/Gracz/{id}                   |
| Skocznie     | GET    | /api/Skocznia                     |
| Skocznie     | POST   | /api/Skocznia                     |
| Skocznie     | PUT    | /api/Skocznia/{id}                |
| Skocznie     | DELETE | /api/Skocznia/{id}                |
| Komentarze   | GET    | /api/Komentarz                    |
| Komentarze   | POST   | /api/Komentarz                    |
| Komentarze   | PUT    | /api/Komentarz/{id}               |
| Komentarze   | DELETE | /api/Komentarz/{id}               |
| Komentarze   | GET    | /api/Komentarz/wynik/{wynikId}    |
| Użytkownicy  | GET    | /api/Uzytkownik                   |
| Użytkownicy  | POST   | /api/Uzytkownik/rejestracja       |
| Użytkownicy  | POST   | /api/Uzytkownik/logowanie         |
| Użytkownicy  | DELETE | /api/Uzytkownik/{id}              |

## Uwagi

- Sekcja "Użytkownicy" widoczna tylko po zalogowaniu jako admin (`czyAdmin: true`)
- Sesja przechowywana w `localStorage` pod kluczem `dsj_user`
- CORS musi być włączony po stronie backendu ASP.NET
