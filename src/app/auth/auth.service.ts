import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthResponseData } from './auth-response-data.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject = new Subject<User>();

  readonly apiSignUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]';
  readonly apiLoginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]';
  readonly projectApiKey = '';

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<AuthResponseData> {
    const url = this.apiSignUpUrl.replace('[API_KEY]', this.projectApiKey);
    return this.doPost(url, email, password);
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    const url = this.apiLoginUrl.replace('[API_KEY]', this.projectApiKey);
    return this.doPost(url, email, password);
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
    this.userSubject.next(user);
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
