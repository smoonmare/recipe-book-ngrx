import { User } from "../user.model";
import { createReducer, on } from '@ngrx/store';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null
}

export const authReducer = createReducer(
  initialState
);