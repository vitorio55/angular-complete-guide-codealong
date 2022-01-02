import { Ingredient } from 'src/app/shared/ingredient.model';

import { Recipe } from '../recipe.model';

// @Injectable({
//   providedIn: 'root'
// })
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
      ],
      'https://cdn.loveandlemons.com/wp-content/uploads/2020/03/pantry-recipes-2.jpg'
    ),
    new Recipe(
      'Big Fat Burger',
      'What else you need to say?',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1),
      ],
      'https://www.saveur.com/uploads/2020/11/20/Y7RZPFZEERAZVHJ2VHC2RXMEEY.jpg?quality=85&width=540'
    ),
  ];

  getRecipes() {
    // Return a copy of the recipes
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.getRecipes()[index];
  }

  constructor() { }
}
