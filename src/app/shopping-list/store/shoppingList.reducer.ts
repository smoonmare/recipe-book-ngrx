import { Action } from '@ngrx/store';
import { ActionTypes } from './shoppingList.actions';
import { Ingredient } from 'src/app/shared/ingredient.interface';

const initialState: Ingredient = {
  name: '',
  amount:  0
};

export function shoppingListReducer(state = initialState, action: Action) {
  switch(action.type) {
    case ActionTypes.Add:
      return {
        ...state,
        ingredients: {
          ...state, action
        }
      };
    default:
      return state;
  }
}