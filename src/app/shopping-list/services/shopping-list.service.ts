import { Subject } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';

/**
 * THIS SERVICE IS DEPRECATED!!
 * Use store for shopping-list interactions
 */

// @Injectable({
//   providedIn: 'root'
// })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10),
    new Ingredient('Bananas', 3),
    new Ingredient('Onions', 7),
  ];

  constructor() { }

  addIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsChanged.next(this.getIngredients());
  }

  addAllIngredients(newIngredients: Ingredient[]) {
    // We have an addAll method to avoid triggering a lot of emitted events (see addIngredient)
    this.ingredients.push(...newIngredients);
    this.ingredientsChanged.next(this.getIngredients());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    if (index < 0 || index > this.ingredients.length) {
      return;
    }
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
