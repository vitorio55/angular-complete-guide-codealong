import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeService } from '../recipes/services/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  readonly endopoint = 'https://ng-complete-guide-2b67f-default-rtdb.firebaseio.com/recipes.json';



  constructor(private http: HttpClient,
    private recipeService: RecipeService) {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // On Firebase, PUT overwrites all previous data
    this.http
      .put(this.endopoint, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    this.http
      .get<Recipe[]>(this.endopoint)
      .subscribe(recipes => {
        console.log(recipes);
        this.recipeService.updateRecipes(recipes);
      });
  }
}