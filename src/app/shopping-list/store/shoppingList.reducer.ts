import { createReducer, on } from '@ngrx/store';
import * as shoppingListActions from './shoppingList.actions';
import { Ingredient } from 'src/app/shared/ingredient.interface';

export const initialState: Ingredient[] = [
  {
    name: 'Apple',
    amount: 5
  },
  {
    name: 'Tomatoes',
    amount: 10
  }
];

export const shoppingListReducer = createReducer(
  initialState,
  on(
    shoppingListActions.add, (state, { name, amount }) => ([...state, {name: name, amount: amount}])
  )
)