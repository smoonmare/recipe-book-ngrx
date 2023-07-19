import { ActionTypes, AddIngredient } from './shoppingList.actions';
import { Ingredient } from 'src/app/shared/ingredient.interface';

const initialState: Ingredient = {
  name: '',
  amount:  0
};

export function shoppingListReducer(state = initialState, action: AddIngredient) {
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