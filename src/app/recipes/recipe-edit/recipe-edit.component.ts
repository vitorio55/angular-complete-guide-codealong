import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  getFormControls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
    // return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {
    // ------------ First solution --> Thats worst
    // const ingredients = [];
    // const recipeData = new Recipe(
    //   this.recipeForm.controls.name.value,
    //   this.recipeForm.controls.description.value,
    //   ingredients,
    //   this.recipeForm.controls.imagePath.value,
    // );

    // const ingredientsControls = (this.recipeForm.get('ingredients') as FormArray).controls;
    // for (let igControl of ingredientsControls) {
    //   ingredients.push(new Ingredient(
    //     igControl.get('name').value,
    //     igControl.get('amount').value,
    //   ));
    // }

    // ------------ Second solution --> Thats better but not great
    // const recipeData = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['ingredients'],
    //   this.recipeForm.value['imagePath'],
    // );

    // (for first and second solution)
    // if (this.editMode) {
    //   this.recipeService.updateRecipe(this.id, recipeData);
    // } else {
    //   this.recipeService.addRecipe(recipeData);
    // }

    // ------------ Third solution --> Great!!!
    // Since our form has the exact same fields of the Recipe structure, we can pass
    // directly the form value like below. The code above becomes unnecessary.
    if (this.editMode) {
      this.store.dispatch(
        new RecipeActions.UpdateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        })
      );
    } else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.onEditCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onRemoveIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onRemoveAllIngredients() {
    (<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  onEditCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    if (this.editMode) {
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map((recipesState) => {
            return recipesState.recipes.find((recipe, i) => {
              return i === this.id;
            });
          })
        )
        .subscribe((recipe) => {
          let recipeIngredients = new FormArray([]);

          if (recipe['ingredients']) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }

          this.recipeForm = new FormGroup({
            name: new FormControl(recipe.name, Validators.required),
            imagePath: new FormControl(recipe.imagePath, Validators.required),
            description: new FormControl(
              recipe.description,
              Validators.required
            ),
            ingredients: recipeIngredients,
          });
        });
    } else {
      this.recipeForm = new FormGroup({
        name: new FormControl('', Validators.required),
        imagePath: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        ingredients: new FormArray([]),
      });
    }
  }
}
