import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/services/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { Observable } from 'rxjs';

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

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(this.endopoint)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            } as Recipe;
          });
        }),
        tap(recipes => {
          this.recipeService.updateRecipes(recipes);
        })
      );
  }
}