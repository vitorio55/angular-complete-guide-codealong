import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth-response-data.model';
import { handleAuthentication, handleError } from './auth.utils';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  readonly apiSignUpUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]';
  readonly apiLoginUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]';

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      const url = this.apiSignUpUrl.replace(
        '[API_KEY]',
        environment.firebaseAPIKey
      );
      return this.http
        .post<AuthResponseData>(url, {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(map(handleAuthentication), catchError(handleError));
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((loginStartAction: AuthActions.LoginStart) => {
      const url = this.apiLoginUrl.replace(
        '[API_KEY]',
        environment.firebaseAPIKey
      );
      return this.http
        .post<AuthResponseData>(url, {
          email: loginStartAction.payload.email,
          password: loginStartAction.payload.password,
          returnSecureToken: true,
        })
        .pipe(map(handleAuthentication), catchError(handleError));
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
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
