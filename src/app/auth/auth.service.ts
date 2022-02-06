import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthResponseData } from './auth-response-data.model';
import { User } from './user.model';
import { environment } from 'src/environments/environment';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly apiSignUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]';
  readonly apiLoginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]';

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private store: Store<fromApp.AppState>) {}

  signup(email: string, password: string): Observable<AuthResponseData> {
    const url = this.apiSignUpUrl.replace('[API_KEY]', environment.firebaseAPIKey);
    return this.doPost(url, email, password);
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const storedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate),
    );

    if (storedUser.token) {
      this.store.dispatch(new AuthActions.Login({
        email: userData.email,
        userId: userData.id,
        token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate),
      }));
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    console.log(`User session expires in (ms): ${ expirationDuration }`);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private doPost(url: string, email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(url, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData: AuthResponseData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        }),
      );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(
      new Date().getTime() + (expiresIn * 1000),
    );
    const user = new User(
      email,
      userId,
      token,
      expirationDate,
    );
    this.store.dispatch(new AuthActions.Login({
      email: user.email,
      userId: user.id,
      token: user.token,
      expirationDate: new Date(expirationDate),
    }));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    console.log(JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error?.error) {
      return throwError(errorResponse);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email is unavailable.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Wrong e-mail or password. Please try again.';
        break;
    }

    return throwError(errorMessage);
  }
}
