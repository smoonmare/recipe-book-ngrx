import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecipeService } from 'src/app/recipe-book/recipe.service'
import { AuthInterceptor } from 'src/app/auth/auth.interceptor';


@NgModule({
  // Eagerly loaded module
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
