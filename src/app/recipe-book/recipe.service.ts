import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/internal/Subject';
import { Recipe } from './recipe.interface';
import { Ingredient } from '../shared/ingredient.interface';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { addMultiple } from '../shopping-list/store/shoppingList.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] =[];

  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<{shoppingList: Ingredient[]}>
  ) { }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToList(ingredients: Ingredient[]) {
    // this.shoppingService.addIngredients(ingredients);
    this.store.dispatch(addMultiple({ingredients: ingredients}));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
