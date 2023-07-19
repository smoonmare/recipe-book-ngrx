import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Subscription, take, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.interface';
import { addIng, deleteIng, stopEdit, updateIng } from '../store/shoppingList.actions';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingListForm?: NgForm;
  subscription?: Subscription;
  editMode: boolean = false;
  editedItem?: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe(stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.shoppingListForm?.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
      this.store.dispatch(stopEdit());
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient: Ingredient = {
      name: value.name ? value.name : 'Ingredient Name',
      amount: value.amount ? value.amount : 0
    };
    this.store.select('shoppingList').pipe(take(1)).subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.store.dispatch(updateIng({
          newIngredient: newIngredient
        }));
      } else {
        this.store.dispatch(addIng({ ingredient: newIngredient }));
      }
    });
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm?.reset();
    this.editMode = false;
    this.store.dispatch(stopEdit());
  }

  onDelete() {
    this.store.dispatch(deleteIng());
    this.onClear();
  }

}
