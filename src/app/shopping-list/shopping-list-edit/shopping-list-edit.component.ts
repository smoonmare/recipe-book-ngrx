import { Component, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.interface';
import { ShoppingListService } from '../shopping-list.service';
import { addIng, deleteIng, updateIng } from '../store/shoppingList.actions';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingListForm?: NgForm;
  subscription?: Subscription;
  editMode: boolean = false;
  editedItemIndex?: number;
  editedItem?: Ingredient;

  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<{shoppingList: Ingredient[]}>
  ) { }

  ngOnInit(): void {
    this.subscription = this.shoppingService.startedEditing
      .subscribe(
        (index: number) => {
          this.editMode = true;
          this.editedItemIndex = index;
          this.editedItem = this.shoppingService.getIngredient(index);
          this.shoppingListForm?.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  ngOnDestroy(): void {
      this.subscription?.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient: Ingredient = {
      name: value.name ? value.name : 'Ingredient Name',
      amount: value.amount ? value.amount : 0
    };
    if (this.editMode) {
      // this.shoppingService.updateIngredient(this.editedItemIndex!, newIngredient)
      this.store.dispatch(updateIng({index: this.editedItemIndex!, newIngredient: newIngredient}))
    } else {
      // this.shoppingService.addIngredient(newIngredient);
      this.store.dispatch(addIng({ingredient: newIngredient}));
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm?.reset();
    this.editMode = false;
  }

  onDelete() {
    // this.shoppingService.deleteIngredient(this.editedItemIndex!);
    this.store.dispatch(deleteIng({index: this.editedItemIndex!}));
    this.onClear();
  }

}
