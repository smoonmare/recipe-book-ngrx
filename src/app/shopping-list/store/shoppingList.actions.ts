import { Action, createAction, props } from "@ngrx/store";

export enum ActionTypes {
  Add = '[ShoppingList Component] ADD_INGREDIENT'
}

export class AddIngredient implements Action {
  readonly type = ActionTypes.Add;
}

// export const add = createAction(
//   ActionTypes.AddIngredient,
//   props<{}>()
// );