import { Action } from "@ngrx/store";

export enum ActionTypes {
  Add = '[ShoppingList Component] Add'
}

export class Add implements Action {
  readonly type = ActionTypes.Add;
}