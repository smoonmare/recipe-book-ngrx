import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.interface';

export enum ActionTypes {
  SetRecipes = '[Recipe Component] SET_RECIPES',
  FetchRecipes = '[Recipe Component] FETCH_RECIPES'
}

export const setRecipes = createAction(
  ActionTypes.SetRecipes,
  props<{recipes: Recipe[]}>()
)

export const fetchRecipes = createAction(
  ActionTypes.FetchRecipes
)