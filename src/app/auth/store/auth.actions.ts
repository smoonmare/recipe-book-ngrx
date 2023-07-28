import { createAction, props } from '@ngrx/store';

export enum ActionTypes {
  SignUp = '[Auth Component] SIGN_UP',
  LoginStart = '[Auth Component] LOGIN_START',
  AutoLogin = '[Auth Component] AUTO_LOGIN',
  AuthenticateFail = '[Auth Component] AUTHENTICATE_FAIL',
  AuthenticateSuccess = '[Auth Component] AUTHENTICATE_SUCCESS',
  Logout = '[Auth Component] LOGOUT',
  HandleError = '[Auth Component] HANDLE_ERROR'
}

export const signUp = createAction(
  ActionTypes.SignUp,
  props<{ email: string, password: string }>()
)

export const loginStart = createAction(
  ActionTypes.LoginStart,
  props<{ email: string, password: string }>()
);

export const autoLogin = createAction(
  ActionTypes.AutoLogin
);

export const authenticateFail = createAction(
  ActionTypes.AuthenticateFail,
  props<{ error: string }>()
)

export const authenticate = createAction(
  ActionTypes.AuthenticateSuccess,
  props<{
    email: string;
    userId: string;
    token: string;
    expDate: Date;
    redirect: boolean
  }>()
);

export const handleError = createAction(
  ActionTypes.HandleError
);

export const logout = createAction(
  ActionTypes.Logout
)