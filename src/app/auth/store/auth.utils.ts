import { of } from 'rxjs';

import { AuthResponseData } from '../auth-response-data.model';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export const handleAuthentication = (resData: AuthResponseData) => {
  const expirationDate = new Date(
    new Date().getTime() + +resData.expiresIn * 1000
  );

  const user = new User(
    resData.email,
    resData.localId,
    resData.idToken,
    expirationDate,
  );

  localStorage.setItem('userData', JSON.stringify(user));
  console.log(JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email: resData.email,
    userId: resData.localId,
    token: resData.idToken,
    expirationDate: expirationDate,
    redirect: true,
  });
};

export const handleError = (error) => {
  let errorMessage = 'An unknown error occurred!';
  if (!error?.error?.error?.message) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (error.error.error.message.split(':')[0].trim()) {
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Email not found.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Wrong e-mail or password. Please try again.';
      break;
    case 'EMAIL_EXISTS':
      errorMessage = 'The email is unavailable.';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage =
        'Access to this account has been temporarily disabled due to many failed login attempts. \
        You can immediately restore it by resetting your password or you can try again later.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};
