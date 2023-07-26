import { createReducer, on } from '@ngrx/store';
import * as recipesActions from './recipe.actions';
import { Recipe } from '../recipe.interface';

export interface State {
  recipes: Recipe[];
}

export const initialState: State = {
  recipes: []
}

export const recipeReducer = createReducer(
  initialState,
  on(recipesActions.setRecipes, (state, action) => {
    return {
      ...state,
      recipes: action.recipes
    }
  })
)