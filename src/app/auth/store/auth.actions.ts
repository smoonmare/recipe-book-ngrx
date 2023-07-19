import { createAction, props } from '@ngrx/store';

export enum ActionTypes {
  LoginStart = '[Auth Component] LOGIN_START',
  Login = '[Auth Component] LOGIN',
  Logout = '[Auth Component] LOGOUT'
}

export const loginStart = createAction(
  ActionTypes.LoginStart,
  props<{email: string, password: string}>()
);

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