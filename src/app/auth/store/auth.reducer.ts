import { createReducer, on } from '@ngrx/store';
import * as authActions from './auth.actions';
import { User } from "../user.model";

export interface State {
  user: User | null;
  authError: string;
  loading: boolean;
}

export const initialState: State = {
  user: null,
  authError: '',
  loading: false
}

export const authReducer = createReducer(
  initialState,
  on(
    authActions.loginStart, (state) => {
      return {
        ...state,
        authError: '',
        loading: true
      }
    }
  ),
  on(
    authActions.authenticateFail,
    (state, action) => {
      return {
        ...state,
        user: null,
        authError: action.error,
        loading: false
      }
    }
  ),
  on(
    authActions.authenticate,
    (state, action) => {
      const user = new User(
        action.email,
        action.userId,
        action.token,
        action.expDate
      );
      return {
        ...state,
        authError: '',
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