import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AlertComponent } from '../shared/alert/alert.component';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
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

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    // Programmatic component error modal approach
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  }

  private handleAuthObservable(obs: Observable<AuthResponseData>) {
    obs
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.success = this.error ? false : true;
        })
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.router.navigate(['/recipes']);
        },
        (errorMessage) => {
          this.error = errorMessage;
          this.showErrorAlert(errorMessage);
          console.log(errorMessage);
        }
      );
  }
}
