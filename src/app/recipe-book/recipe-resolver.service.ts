import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import { ActionTypes } from '../recipe-book/store/recipe.actions';
import * as RecipeActions from '../recipe-book/store/recipe.actions';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.interface';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolverService implements Resolve<Recipe[]>{

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions,
    private recipeService: RecipeService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    // const recipes = this.recipeService.getRecipes();
    // if (recipes.length === 0) {
    //   // return this.dataStorage.fetchRecipes();
      
    // } else {
    //   return recipes;
    // }
    this.store.dispatch(RecipeActions.fetchRecipes());
      return this.actions$.pipe(
        ofType(ActionTypes.SetRecipes),
        take(1)
      );
  }
}
