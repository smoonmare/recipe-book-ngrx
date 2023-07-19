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
    shoppingListActions.addIng, (state, { ingredient }) => ([...state, ingredient])
  ),
  on(
    shoppingListActions.addMultipleIngs, (state, { ingredients }) => ([...state, ...ingredients])
  ),
  on(
    shoppingListActions.updateIng, (state, { index, newIngredient }) => {
      const newState = [...state];
      newState[index] = newIngredient;
      return newState;
    }
  ),
  on(
    shoppingListActions.deleteIng, (state, { index }) => {
      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    }
  )
)