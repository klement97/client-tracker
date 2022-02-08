import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _TOKEN, AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  template: `
      <div class="container">
          <form class="form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">

              <!-- Username -->
              <mat-form-field class="full-width" appearance="fill">
                  <mat-label>Username</mat-label>
                  <input type="text" aria-label="Username" matInput formControlName="username">
              </mat-form-field>

              <!-- Password -->
              <mat-form-field class="full-width" appearance="fill">
                  <mat-label>Password</mat-label>
                  <input type="password" aria-label="Password" matInput formControlName="password">
              </mat-form-field>

              <!-- Error message -->
              <div class="error-message" *ngIf="errorMessage">
                  {{ errorMessage }}
              </div>

              <!-- Submit button -->
              <button mat-raised-button color="primary" type="submit">Login</button>

          </form>
      </div>
  `,
  styles: [`
      .container {
          width: 100%;
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      .form {
          display: flex;
          flex-direction: column;
      }

      .error-message {
          color: red;
          margin-top: 10px;
      }
  `]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }


  ngOnInit(): void {
    if (this.cookieService.check(_TOKEN)) {
      this.router.navigate(['clients']).then();
    }
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe(
      (response: any) => {
        this.onSuccess();
      },
      (response: any) => {
        this.onError(response);
      }
    );
  }


  onSuccess() {
    this.router.navigate(['clients']).then();
  }


  onError(response: any) {
    if (response.status === 400 && response.error?.non_field_errors.length > 0) {
      this.errorMessage = 'Invalid username or password';
    }
  }

}
