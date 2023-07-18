import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipe-book/recipe.service';
import { Recipe } from '../recipe-book/recipe.interface';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(
      private http: HttpClient,
      private recipeService: RecipeService,
      private authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put('https://recipe-book-62257-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log('Recipes were stored. Response:\n', response);
      });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(
      'https://recipe-book-62257-default-rtdb.firebaseio.com/recipes.json'
    ).pipe(
      map(recipes => {
        // map - javascript array method
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap(recipes => {
        console.log('Recipes are fetched. Response:\n', recipes);
        this.recipeService.setRecipes(recipes);
      })
    )
  }
}
