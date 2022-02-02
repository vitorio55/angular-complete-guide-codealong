import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10),
    new Ingredient('Bananas', 3),
    new Ingredient('Onions', 7),
  ],
};

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const updatedIngredients = [...state.ingredients];
      const oldIngredient = state.ingredients[action.payload.index];
      updatedIngredients[action.payload.index] = {
        ...oldIngredient,
        ...action.payload.ingredient,
      };
      return {
        ...state,
        ingredients: updatedIngredients,
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, idx) => {
          return idx != action.payload.index;
        }),
      };
    default:
      return state;
  }
}
