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
  }),
  on(recipesActions.addRecipe, (state, action) => {
    return {
      ...state,
      recipe: action.recipe
    }
  }),
  on(recipesActions.updateRecipe, (state, action) => {
    const updatedRecipe = {
      ...state.recipes[action.index],
      ...action.newRecipe
    };
    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.index] = updatedRecipe;
    return {
      ...state,
      recipes: updatedRecipes
    }
  }),
  on(recipesActions.deleteRecipe, (state, action) => {
    return {
      ...state,
      recipes: state.recipes.filter((recipe, index) => {
        return index !== action.index;
      })
    }
  })
)