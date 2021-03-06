import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;

  isAuthenticated = false;
  collapsed = true;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSubscription = this.store.select('auth').subscribe((authState) => {
      this.isAuthenticated = !!authState.user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  onSaveData() {
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }
}
