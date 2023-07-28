import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { ActionTypes } from "./recipe.actions";
import * as RecipeActions from './recipe.actions';
import { switchMap, map } from "rxjs/operators";
import { Recipe } from "../recipe.interface";

@Injectable()
export class RecipeEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) { }

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.FetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://recipe-book-62257-default-rtdb.firebaseio.com/recipes.json'
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map((recipes) => {
        return RecipeActions.setRecipes({ recipes });
      })
    )
  );

}