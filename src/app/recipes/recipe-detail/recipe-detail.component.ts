import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ShoppingListService } from 'src/app/shopping-list/services/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private shoppingListService: ShoppingListService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      );
  }

  onAddIngredientsToShoppingList() {
    // This emits events in a loop, not good!
    // this.recipe.ingredients.forEach((ingredient) => {
    //   this.shoppingListService.addIngredient(ingredient);
    // });
    this.shoppingListService.addAllIngredients(this.recipe.ingredients);
  }
}
