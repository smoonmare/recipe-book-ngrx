import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';
import { User } from "../user.model";

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null
}

export const authReducer = createReducer(
  initialState,
  on(
    authActions.login,
    (state, action) => {
      const user = new User(
        action.email,
        action.userId,
        action.token,
        action.expDate
      );
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      };
    }
  ),
  on(
    authActions.logout, (state) => {
      return {
        ...state,
        user: null
      }
    }
  )
);