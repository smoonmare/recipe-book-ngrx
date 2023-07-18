import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'recipes', loadChildren: () => import(
      './recipe-book/recipes.module'
    ).then(mod => mod.RecipesModule)
  },
  {
    path: 'shopping-list', loadChildren: () => import(
      './shopping-list/shopping-list.module'
    ).then(mod => mod.ShoppingListModule)
  },
  {
    path: 'auth', loadChildren: () => import(
      './auth/auth.module'
    ).then(mod => mod.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { preloadingStrategy: PreloadAllModules }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
