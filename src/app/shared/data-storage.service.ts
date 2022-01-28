import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/services/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  readonly endopoint = 'https://ng-complete-guide-2b67f-default-rtdb.firebaseio.com/recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
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
    return this.authService.userSubject
      .pipe(
        take(1), // Takes one user from user subject
        exhaustMap(user => { // ... then replaces the previous observable with a new one
          return this.http.get<Recipe[]>(
            this.endopoint,
            {
              // Adds ?auth= query param
              params: new HttpParams().set('auth', user.token),
            }
          );
        }),
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