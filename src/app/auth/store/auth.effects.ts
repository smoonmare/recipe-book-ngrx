import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from 'rxjs/internal/observable/of';
import * as AuthActions from "./auth.actions";
import { ActionTypes } from "./auth.actions";
import { environment } from "src/environments/environment";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

const handleAuth = (
  email: string,
  localId: string,
  idToken: string,
  expiresIn: number
) => {
  const expDate = new Date(
    new Date().getTime() + +expiresIn * 1000
  );
  const user = new User(email, localId, idToken, expDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authenticate({
    email: email,
    userId: localId,
    token: idToken,
    expDate: expDate,
    redirect: true
  });
};
const handleError = (errorRes: HttpErrorResponse) => {
  let errorMessage = 'An ukknown error occured. Please try again later.';
  if (!errorRes.error || !errorRes.error.error) {
    return of(AuthActions.authenticateFail({ error: errorMessage }));
  }
  console.log('Error:', errorRes.error.error.message);
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists on our service. Please try again using a different one.';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      errorMessage = 'Invalid crenedtials. Please try with a different credentials or simply Sign Up.';
      break;
  }
  return of(AuthActions.authenticateFail({ error: errorMessage }));
};

@Injectable()
export class AuthEffects {

  constructor(
    private authService: AuthService,
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) { }

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.SignUp),
      switchMap((authData: { email: string, password: string }) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.key}`,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }
          ).pipe(
            map(resData => {
              // Map the response to an action
              return handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            }),
            catchError(errorRes => {
              // Map the error to an action
              return handleError(errorRes);
            })
          )
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.LoginStart),
      switchMap((authData: { email: string, password: string }) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.key}`,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }
          ).pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              // Map the response to an action
              return handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            }),
            catchError((errorRes) => {
              // Map the error to an action
              return handleError(errorRes);
            })
          )
      }),
    )
  );

  authRedirect = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authenticate),
      tap((authSuccessAction) => {
        if (authSuccessAction.redirect) {
          this.router.navigate(['/recipes']);
        }
      })
    ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.AutoLogin),
      map(() => {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
          return { type: 'NO_ACTION' };
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
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.authenticate({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }
        return { type: 'NO_ACTION' };
      })
    )
  );

  authLogout = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.Logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ),
    { dispatch: false }
  );

}
