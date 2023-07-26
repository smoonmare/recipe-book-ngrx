import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.interface';

export enum ActionTypes {
  SetRecipes = '[Recipe Component] SET_RECIPES'
}

export const setRecipes = createAction(
  ActionTypes.SetRecipes,
  props<{recipes: Recipe[]}>()
)