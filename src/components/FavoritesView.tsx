import React from 'react';
import { Heart } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';

interface FavoritesViewProps {
  favoriteRecipes: Recipe[];
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onBrowseMenu: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteRecipes,
  onToggleFavorite,
  onSelectRecipe,
  onBrowseMenu
}) => {
  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E7E2D9] dark:border-[#2F2C27] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-5 h-5 text-[#B87961] dark:text-[#C4856E] fill-[#B87961] dark:fill-[#C4856E]" />
          <span className="text-xs text-[#B87961] dark:text-[#C4856E] font-medium tracking-wide uppercase">
            თქვენი კოლექცია
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
          რჩეული კერძები
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#6F6A62] dark:text-[#A09B90]">
          {favoriteRecipes.length > 0
            ? `შენახულია ${favoriteRecipes.length} რჩეული რეცეპტი`
            : 'ჯერ არცერთი კერძი არ დაგიმატებია რჩეულებში.'}
        </p>
      </div>

      {/* Grid or Empty State */}
      {favoriteRecipes.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#201E1B] rounded-lg border border-[#E7E2D9] dark:border-[#2F2C27] p-8 max-w-lg mx-auto">
          <Heart className="w-12 h-12 mx-auto text-[#D8D2C6] dark:text-[#4A453E] mb-3 stroke-[1.5]" />
          <h3 className="font-serif text-xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
            ჯერ არცერთი კერძი არ დაგიმატებია რჩეულებში.
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#6F6A62] dark:text-[#A09B90] leading-relaxed">
            დაათვალიერეთ საუზმის, სადილისა და დესერტის მენიუ, დააჭირეთ გულის ღილაკს და შეინახეთ ოჯახის ფავორიტი რეცეპტები.
          </p>
          <button
            onClick={onBrowseMenu}
            className="cursor-pointer mt-6 px-6 py-2.5 text-xs sm:text-sm font-medium text-white bg-[#7C8B70] dark:bg-[#728268] hover:bg-[#6C7B60] dark:hover:bg-[#637259] rounded-md transition-colors"
          >
            მენიუს დათვალიერება
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
};
