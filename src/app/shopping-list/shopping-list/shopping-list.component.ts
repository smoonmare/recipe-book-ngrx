import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromShoppingList from '../store/shoppingList.reducer';
import { Subscription, Observable } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.interface';
import { LoggingService } from 'src/app/logging.service';
import { startEdit } from '../store/shoppingList.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients?: Observable<Ingredient[]>;
  private subscription?: Subscription;

  constructor(
    private loggingService: LoggingService,
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select(state => state.shoppingList.ingredients);
    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  onEditItem(index: number) {
    this.store.dispatch(startEdit({index}))
  }

}
