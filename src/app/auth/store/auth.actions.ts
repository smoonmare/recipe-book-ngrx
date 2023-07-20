import { createAction, props } from '@ngrx/store';

export enum ActionTypes {
  LoginStart = '[Auth Component] LOGIN_START',
  LoginFail = '[Auth Component] LOGIN_FAIL',
  Login = '[Auth Component] LOGIN',
  Logout = '[Auth Component] LOGOUT'
}

export const loginStart = createAction(
  ActionTypes.LoginStart,
  props<{email: string, password: string}>()
);

export const loginFail = createAction(
  ActionTypes.LoginFail,
  props<{error: string}>()
)

export const login = createAction(
    ActionTypes.Login,
    props<{
      email: string;
      userId: string;
      token: string;
      expDate: Date;
    }>()
  );

export const logout = createAction(
  ActionTypes.Logout
)