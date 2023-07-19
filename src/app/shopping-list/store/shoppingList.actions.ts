import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.interface";

export enum ActionTypes {
  AddIngredient = '[ShoppingList Component] ADD_INGREDIENT',
  AddIngredients = '[ShoppingList Component] ADD_INGREDIENTS'
}

export const add = createAction(
  ActionTypes.AddIngredient,
  props<{name: string, amount: number}>()
);

export const addMultiple = createAction(
  ActionTypes.AddIngredients,
  props<{ingredients: Ingredient[]}>()
)