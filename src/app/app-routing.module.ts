import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },

  // Lazy-loading old syntax
  // { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' },

  // Lazy-loading newer syntax
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        (m) => m.ShoppingListModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    /*
      ● Without lazy loading the whole app would have to be loaded in one go, and the user wouldn't
        see anything until the code for the whole app (all "pages") is ready.
      ● With lazy loading we just load the first module, so that the user can see the initial page/s
        very quickly. But without preloading the user will then have to wait for the loading of
        additional modules each time he wants to move to different "subpages".
      ● PreloadAllModules:
        To avoid the above behavior, the other modules will be loaded in the background, as soon as
        the first module is loaded and displayed.
    */
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
