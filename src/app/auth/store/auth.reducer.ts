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
    authActions.login, (state, { user }) => {
      return {
        ...state,
        user: user
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