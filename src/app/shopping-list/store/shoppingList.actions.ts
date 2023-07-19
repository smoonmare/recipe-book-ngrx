import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.interface";

export enum ActionTypes {
  AddIngredient = '[ShoppingList Component] ADD_INGREDIENT',
  AddIngredients = '[ShoppingList Component] ADD_INGREDIENTS',
  UpdateIngredient =  '[ShoppingList Component] UPDATE_INGREDIENT',
  DeleteIngredients = '[ShoppingList Component] DELETE_INGREDIENT',
}

export const addIng = createAction(
  ActionTypes.AddIngredient,
  props<{ingredient: Ingredient}>()
);

export const addMultipleIngs = createAction(
  ActionTypes.AddIngredients,
  props<{ingredients: Ingredient[]}>()
);

export const updateIng = createAction(
  ActionTypes.UpdateIngredient,
  props<{index: number, newIngredient: Ingredient}>()
);

export const deleteIng = createAction(
  ActionTypes.DeleteIngredients,
  props<{index: number}>()
);