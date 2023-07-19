import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.interface";

export enum ActionTypes {
  AddIngredient = '[ShoppingList Component] ADD_INGREDIENT'
}

export const add = createAction(
  ActionTypes.AddIngredient,
  props<{ingredient: Ingredient}>()
);