import { Component, Input, OnInit } from '@angular/core';

import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
  }

  onAddIngredientsToShoppingList() {
    // This emits events in a loop, not good!
    // this.recipe.ingredients.forEach((ingredient) => {
    //   this.shoppingListService.addIngredient(ingredient);
    // });
    this.shoppingListService.addAllIngredients(this.recipe.ingredients);
  }
}
