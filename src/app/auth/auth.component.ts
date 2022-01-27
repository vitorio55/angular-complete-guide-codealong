import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';

import { AuthResponseData } from './auth-response-data.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;

  success = false;
  error: string = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;

    const authObservable = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signup(email, password);

    this.error = null;
    this.success = false;
    this.handleAuthObservable(authObservable);

    this.authForm.reset();
  }

  private handleAuthObservable(obs: Observable<AuthResponseData>) {
    obs.pipe(
      finalize(() => {
        this.isLoading = false;
        this.success = this.error ? false : true;
      }),
    )
    .subscribe(responseData => {
      console.log(responseData);
    },
    errorMessage => {
      this.error = errorMessage;
      console.log(errorMessage);
    });
  }
}