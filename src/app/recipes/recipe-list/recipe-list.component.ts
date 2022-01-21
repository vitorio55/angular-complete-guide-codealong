import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipesChangSubscription: Subscription;
  recipes: Recipe[];

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.recipes = this.recipeService.getRecipes();
    this.recipesChangSubscription = this.recipeService.recipesChanged
      .subscribe(
        (newRecipes: Recipe[]) => this.recipes = newRecipes,
      );
  }

  ngOnDestroy() {
    this.recipesChangSubscription.unsubscribe();
  }

}
