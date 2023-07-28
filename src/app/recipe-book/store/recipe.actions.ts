import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.interface';

export enum ActionTypes {
  SetRecipes = '[Recipe Component] SET_RECIPES',
  FetchRecipes = '[Recipe Component] FETCH_RECIPES',
  AddRecipe = '[Recipe Component] ADD_RECIPE',
  UpdateRecipe = '[Recipe Component] UPDATE_RECIPE',
  DeleteRecipe = '[Recipe Component] DELETE_RECIPE'
}

export const setRecipes = createAction(
  ActionTypes.SetRecipes,
  props<{recipes: Recipe[]}>()
)

export const fetchRecipes = createAction(
  ActionTypes.FetchRecipes
)

export const addRecipe = createAction(
  ActionTypes.AddRecipe,
  props<{recipe: Recipe}>()
)

export const updateRecipe = createAction(
  ActionTypes.UpdateRecipe,
  props<{index: number, newRecipe: Recipe}>()
)

export const deleteRecipe = createAction(
  ActionTypes.DeleteRecipe,
  props<{index: number}>()
)