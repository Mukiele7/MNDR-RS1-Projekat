import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Nepoznata greška se desila';
      let shouldShowSnackbar = true;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Greška: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Neispravni podaci';
            break;
          case 401:
            // Samo prikažemo poruku, ne brišemo token automatski
            // Korisnik može biti na javnoj stranici i ne mora biti prijavljen
            errorMessage = 'Potrebna prijava za ovu akciju.';
            shouldShowSnackbar = false; // Ne prikazuj snackbar za 401 - ne želimo da smeta korisniku
            break;
          case 403:
            errorMessage = 'Nemate dozvolu za ovu akciju';
            break;
          case 404:
            errorMessage = 'Traženi resurs nije pronađen';
            break;
          case 500:
            errorMessage = 'Greška na serveru. Pokušajte kasnije.';
            break;
          case 503:
            errorMessage = 'Servis trenutno nije dostupan';
            break;
          default:
            errorMessage = error.error?.message || `Server greška: Provjerite unešene podatke! |   ${error.status}`;
        }
      }

      if (shouldShowSnackbar) {
        snackBar.open(errorMessage, 'Zatvori', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }

      return throwError(() => error);
    })
  );
};
