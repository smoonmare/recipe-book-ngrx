// Angular modules
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// Third-party modules
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Application modules
import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

// Environment modules
import { environment } from 'src/environments/environment';


export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.key}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuth(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.key}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuth(
            res.email,
            res.localId,
            res.idToken,
            +res.expiresIn
          );
        })
      );
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
      this.tokenExpTimer = null;
    }
  }

  autoLogOut(expirationDuration: number) {
    this.tokenExpTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  autoLogin() {
    const storedData = localStorage.getItem('userData');
    if (!storedData) {
      return;
    }
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(storedData);
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.store.dispatch(
        AuthActions.login({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expDate: new Date(userData._tokenExpirationDate),
        })
      );
      this.autoLogOut(expirationDuration);
    }
  }

  private handleAuth(email: string, userID: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userID,
      token,
      expDate
    );
    this.autoLogOut(expiresIn * 1000);
    this.store.dispatch(
      AuthActions.login({
        email: email,
        userId: userID,
        token: token,
        expDate: expDate,
      })
    );
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An ukknown error occured. Please try again later.';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    console.log('Error:', errorRes.error.error.message);
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email alrede exists on our service. Plase try using a different one.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Invalid crenedtials. Please try with a different credentials or simply Sign Up.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid crenedtials. Please try with a different credentials or simply Sign Up.';
        break;
    }
    return throwError(() => errorMessage);
  }
}
