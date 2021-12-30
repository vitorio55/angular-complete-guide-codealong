import { EventEmitter, Injectable } from '@angular/core';

import { Ingredient } from 'src/app/shared/ingredient.model';

// @Injectable({
//   providedIn: 'root'
// })
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10),
  ];

  constructor() { }

  addIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsChanged.emit(this.getIngredients());
  }

  addAllIngredients(newIngredients: Ingredient[]) {
    // We have an addAll method to avoid triggering a lot of emitted events (see addIngredient)
    this.ingredients.push(...newIngredients);
    this.ingredientsChanged.emit(this.getIngredients());
  }

  getIngredients() {
    return this.ingredients.slice();
  }
}
