import { createReducer, on } from '@ngrx/store';
import * as shoppingListActions from './shoppingList.actions';
import { Ingredient } from 'src/app/shared/ingredient.interface';


export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient,
  editedIngredientIndex: number
}

export const initialState: State = {
  ingredients: [
    {
      name: 'Apple',
      amount: 5
    },
    {
      name: 'Tomatoes',
      amount: 10
    }
  ],
  editedIngredient: {name: '', amount: 0},
  editedIngredientIndex: -1 
};

export const shoppingListReducer = createReducer(
  initialState,
  on(
    shoppingListActions.addIng, (state, { ingredient }) => ({
      ...state,
      ingredients: [...state.ingredients, ingredient]
    })
  ),
  on(
    shoppingListActions.addMultipleIngs, (state, { ingredients }) => ({
      ...state,
      ingredients: [...state.ingredients, ...ingredients]
    })
  ),
  on(
    shoppingListActions.startEdit, (state, { index }) => {
      return {
        ...state,
        editedIngredientIndex: index,
        editedIngredient: {...state.ingredients[index]}
      };
    }
  ),
  on(
    shoppingListActions.stopEdit, ( state ) => {
      return {
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: {name: '', amount: 0}
      };
    }
  ),
  on(
    shoppingListActions.updateIng, (state, { newIngredient }) => {
      const newIngredients = [...state.ingredients];
      newIngredients[state.editedIngredientIndex] = newIngredient;
      return {
        ...state,
        ingredients: newIngredients,
        editedIngredientIndex: -1,
        editedIngredient: {name: '', amount: 0}
      };
    }
  ),
  on(
    shoppingListActions.deleteIng, (state) => {
      const newIngredients = [...state.ingredients];
      newIngredients.splice(state.editedIngredientIndex, 1);
      return {
        ...state,
        ingredients: newIngredients,
        editedIngredientIndex: -1,
        editedIngredient: {name: '', amount: 0}
      };
    }
  )
)