import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipe-book/store/recipe.actions';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store
        .select('auth')
        .pipe(map(
          authState => authState.user
        ))
        .subscribe(user => {
        this.isAuthenticated = !!user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSaveData() {
    this.store.dispatch(RecipeActions.storeRecipes());
  }

  onFetchData() {
    this.store.dispatch(RecipeActions.fetchRecipes());
  }

  onLogOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
