import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecipeService } from 'src/app/recipe-book/recipe.service'
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';
// import { LoggingService } from './logging.service';



@NgModule({
  // Eagerly loaded module
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ShoppingListService,
    RecipeService,
    // LoggingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
