import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService implements OnDestroy {
  readonly endpoint =
    'https://ng-complete-guide-2b67f-default-rtdb.firebaseio.com/recipes.json';

  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  storeRecipes() {
    this.subscription = this.store
      .select('recipes')
      .pipe(
        map((recipesState) => {
          return recipesState.recipes;
        }),
      )
      .subscribe((recipes) => {
        // On Firebase, PUT overwrites all previous data
        this.http.put(this.endpoint, recipes).subscribe((response) => {
          console.log(response);
        });
      });
  }
}
