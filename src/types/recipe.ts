export type Category = 'breakfast' | 'lunch' | 'dessert';

export type Difficulty = 'მარტივი' | 'საშუალო' | 'შედარებით რთული';

export interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
  note?: string;
}

export interface Recipe {
  id: string;
  category: Category;
  name: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number; // minutes
  servings: number; // 3 for the household of 3
  calories: number; // approximate calories per serving
  protein: number; // approximate protein (g) per serving
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: string[];
  chefTip?: string;
  tags: string[];
}

export type DayOfWeek =
  | 'ორშაბათი'
  | 'სამშაბათი'
  | 'ოთხშაბათი'
  | 'ხუთშაბათი'
  | 'პარასკევი'
  | 'შაბათი'
  | 'კვირა';

export interface DayPlan {
  breakfast: string | null; // recipeId
  lunch: string | null;     // recipeId
  dessert: string | null;   // recipeId
}

export type WeeklyPlan = Record<DayOfWeek, DayPlan>;

export interface ShoppingItem {
  id: string;
  name: string;
  quantityStr: string;
  completed: boolean;
  sourceRecipeNames: string[];
}
