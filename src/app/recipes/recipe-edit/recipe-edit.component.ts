import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
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
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onEditCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      }),
    )
  }

  onEditCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            }),
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients,
    });
  }
}
