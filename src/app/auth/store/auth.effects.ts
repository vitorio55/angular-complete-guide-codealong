import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth-response-data.model';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  readonly apiSignUpUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]';
  readonly apiLoginUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]';

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      const url = this.apiLoginUrl.replace(
        '[API_KEY]',
        environment.firebaseAPIKey
      );
      return this.http
        .post<AuthResponseData>(url, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map((resData: AuthResponseData) => {
            const expirationDate = new Date(
              new Date().getTime() + +resData.expiresIn * 1000
            );
            return new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate,
            });
          }),
          catchError((error) => {
            let errorMessage = 'An unknown error occurred!';
            if (!error?.error?.error?.message) {
              return of(new AuthActions.LoginFail(errorMessage));
            }
            switch (error.error.error.message.split(':')[0].trim()) {
              case 'EMAIL_EXISTS':
                errorMessage = 'The email is unavailable.';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email not found.';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'Wrong e-mail or password. Please try again.';
                break;
              case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage =
                  'Access to this account has been temporarily disabled due to many failed login attempts. \
                  You can immediately restore it by resetting your password or you can try again later.';
                break;
            }
            return of(new AuthActions.LoginFail(errorMessage));
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
