// import { Injectable } from "@angular/core";
// import { HttpClient } from "@angular/common/http";
// import { environment } from "src/environments/environment";
// import { Actions, ofType, createEffect } from '@ngrx/effects';
// import { ActionTypes } from "./auth.actions";
// import { switchMap, catchError, map } from "rxjs";

// export interface AuthResponseData {
//   idToken: string,
//   email: string,
//   refreshToken: string,
//   expiresIn: string,
//   localId: string,
//   registered?: boolean
// }

// @Injectable()
// export class AuthEffects {
//   login$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(ActionTypes.LoginStart),
//       switchMap((authData: { email: string, password: string }) => {
//         return this.http
//           .post<AuthResponseData>(
//             `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.key}`,
//             {
//               email: authData.email,
//               password: authData.password,
//               returnSecureToken: true
//             }
//           );
//       }),
//     )
//   );

//   constructor(
//     private actions$: Actions,
//     private http: HttpClient
//   ) { }
// }

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError, map } from "rxjs/operators";
import { of } from 'rxjs/internal/observable/of';
import { ActionTypes, login, loginStart } from "./auth.actions";
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
            catchError(error => {
              // Map the error to an action
              return of();
            })
          )
      }),
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) { }
}
