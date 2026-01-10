import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Nepoznata greška se desila';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Greška: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Neispravni podaci';
            break;
          case 401:
            errorMessage = 'Niste prijavljeni. Molimo prijavite se.';
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

      snackBar.open(errorMessage, 'Zatvori', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
};
