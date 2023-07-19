import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { startEdit } from '../store/shoppingList.actions';
import { Subscription, Observable } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.interface';
import { LoggingService } from 'src/app/logging.service';

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
    private store: Store<fromApp.AppState>
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
