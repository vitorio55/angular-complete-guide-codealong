import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth-response-data.model';
import { handleAuthentication, handleError } from './auth.utils';
import { User } from '../user.model';
import { AuthService } from '../auth.service';
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
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(handleAuthentication),
          catchError(handleError)
        );
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
        .pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(handleAuthentication),
          catchError(handleError)
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY' };
      }

      const storedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (storedUser.token) {
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
          email: userData.email,
          userId: userData.id,
          token: userData._token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: false,
        });
      }

      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
