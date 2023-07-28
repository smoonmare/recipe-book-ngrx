import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { ActionTypes } from "./recipe.actions";
import * as RecipeActions from './recipe.actions';
import { switchMap, map, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.interface";

@Injectable()
export class RecipeEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
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

  storeRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionTypes.StoreRecipes),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipeState]) => {
        return this.http.put(
          'https://recipe-book-62257-default-rtdb.firebaseio.com/recipes.json',
          recipeState.recipes
        );
      })
    ), { dispatch: false }
  )
}