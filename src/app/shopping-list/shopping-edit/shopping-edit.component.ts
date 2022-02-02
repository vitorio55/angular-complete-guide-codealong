import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('f', { static: true }) shoppingListForm: NgForm;

  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.store
        .select('shoppingList')
        .pipe(take(1))
        .subscribe((state) => {
          this.editedItem = state.ingredients[this.editedItemIndex];
        });
      this.shoppingListForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount,
      });
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient({
          index: this.editedItemIndex,
          ingredient,
        })
      );
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.onClear();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient({ index: this.editedItemIndex })
    );
    this.onClear();
  }
}
