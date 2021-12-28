import { EventEmitter, Injectable } from '@angular/core';

import { Recipe } from '../recipe.model';

// @Injectable({
//   providedIn: 'root'
// })
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  
  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      '2x tomates; 1x carrot',
      'https://cdn.loveandlemons.com/wp-content/uploads/2020/03/pantry-recipes-2.jpg'
    ),
    new Recipe(
      'This Is Another Recipe',
      'Testing again with another recipe',
      '1x tea-spoon of salt; 500ml of water',
      'https://www.saveur.com/uploads/2020/11/20/Y7RZPFZEERAZVHJ2VHC2RXMEEY.jpg?quality=85&width=540'
    ),
  ];

  getRecipes() {
    // Return a copy of the recipes
    return this.recipes.slice();
  }

  constructor() { }
}
