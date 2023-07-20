import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from "rxjs/operators";
import { of } from 'rxjs/internal/observable/of';
import { ActionTypes, login, loginFail } from "./auth.actions";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.LoginStart),
      switchMap((authData: {email: string, password: string}) => {
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
              const expDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return login({
                  email: resData.email,
                  userId: resData.localId,
                  token: resData.idToken,
                  expDate: expDate
                });
            }),
            catchError((errorRes) => {
              // Map the error to an action
              let errorMessage = 'An ukknown error occured. Please try again later.';
              if (!errorRes.error || !errorRes.error.error) {
                return of(loginFail({error: errorMessage}));
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
              return of(loginFail({error: errorMessage}));
            })
          )
      }),
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ActionTypes.Login),
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
