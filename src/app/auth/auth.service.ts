import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthResponseData } from './auth-response-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly apiSignUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]';
  readonly projectApiKey = '';

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<AuthResponseData> {
    const url = this.apiSignUpUrl.replace('[API_KEY]', this.projectApiKey);
    return this.http
      .post<AuthResponseData>(url, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(catchError(errorRes => {
        console.log(errorRes);
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error?.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'The email is already registered!';
        }
        return throwError(errorMessage);
      }));
  }
}
