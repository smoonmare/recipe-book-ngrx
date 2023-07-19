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

// export function shoppingListReducer(state = initialState, action: AddIngredient) {
//   switch(action.type) {
//     case ActionTypes.Add:
//       return {
//         ...state,
//         ingredients: {
//           ...state, action
//         }
//       };
//     default:
//       return state;
//   }
// }

export const shoppingListReducer = createReducer(
  initialState,
  on(
    shoppingListActions.add, (state, { ingredient }) => ([{name: ingredient.name, amount: ingredient.amount}])
  )
)