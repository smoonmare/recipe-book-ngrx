import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from 'rxjs/internal/observable/of';
import * as AuthActions from "./auth.actions";
import { ActionTypes } from "./auth.actions";
import { environment } from "src/environments/environment";

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
  return AuthActions.authenticate({
    email: email,
    userId: localId,
    token: idToken,
    expDate: expDate
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
                  errorMessage = 'This email alrede exists on our service. Plase try using a different one.';
                  break;
                case 'EMAIL_NOT_FOUND':
                  errorMessage = 'Invalid crenedtials. Please try with a different credentials or simply Sign Up.';
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage = 'Invalid crenedtials. Please try with a different credentials or simply Sign Up.';
                  break;
              }
              return of(AuthActions.authenticateFail({ error: errorMessage }));
};

@Injectable()
export class AuthEffects {
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
      }),
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

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActionTypes.Authenticate),
        tap(() => {
          this.router.navigate(['/recipes']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) { }
}
