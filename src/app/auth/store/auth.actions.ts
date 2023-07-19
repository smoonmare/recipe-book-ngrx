import { createAction, props } from '@ngrx/store';
import { User } from '../user.model';

export enum ActionTypes {
  Login = '[Auth Component] LOGIN',
  LogOut = '[Auth Component] LOGOUT'
}

export const login = createAction(
  ActionTypes.Login,
  props<{user: User}>()
);

export const logout = createAction(
  ActionTypes.LogOut
)