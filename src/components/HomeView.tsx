import React from 'react';
import { Sparkles, CalendarDays, ArrowRight, Heart } from 'lucide-react';
import { Recipe, Category, WeeklyPlan } from '../types/recipe';
import { RecipeCard } from './RecipeCard';
import { ImageWithFallback } from './ImageWithFallback';
import { DAYS_OF_WEEK } from '../hooks/useWeeklyMenu';

interface HomeViewProps {
  onSelectCategory: (cat: Category) => void;
  onOpenRandom: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  featuredDishes: Recipe[];
  categoryImages: Record<Category, { title: string; subtitle: string; count: number; image: string }>;
  weeklyPlan: WeeklyPlan;
  recipesMap: Map<string, Recipe>;
  favoriteRecipes: Recipe[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onNavigateToWeekly: () => void;
  onNavigateToFavorites: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCategory,
  onOpenRandom,
  onSelectRecipe,
  featuredDishes,
  categoryImages,
  weeklyPlan,
  favoriteRecipes,
  isFavorite,
  onToggleFavorite,
  onNavigateToWeekly,
  onNavigateToFavorites
}) => {
  const plannedMealsCount = DAYS_OF_WEEK.reduce((acc, day) => {
    const p = weeklyPlan[day];
    return acc + (p.breakfast ? 1 : 0) + (p.lunch ? 1 : 0) + (p.dessert ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Editorial Hero Header */}
      <section className="text-center pt-4 sm:pt-8 max-w-2xl mx-auto px-4">
        <span className="text-xs sm:text-sm text-[#7C8B70] dark:text-[#8F9E84] font-medium tracking-wider uppercase block mb-2">
          დღეს რას ვამზადებთ?
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-[#222222] dark:text-[#ECE8E1] tracking-tight">
          ჩვენი მენიუ
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#6F6A62] dark:text-[#A09B90] leading-relaxed">
          სახლში მომზადებული კერძები, რესტორნის განწყობით — 3 ადამიანის ოჯახისთვის.
        </p>
      </section>

      {/* 3 Primary Category Entry Points */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(
          [
            { key: 'breakfast' as Category, meta: categoryImages.breakfast },
            { key: 'lunch' as Category, meta: categoryImages.lunch },
            { key: 'dessert' as Category, meta: categoryImages.dessert }
          ]
        ).map(({ key, meta }) => (
          <div
            key={key}
            onClick={() => onSelectCategory(key)}
            className="group cursor-pointer bg-white dark:bg-[#201E1B] rounded-lg border border-[#E7E2D9] dark:border-[#2F2C27] overflow-hidden transition-all duration-200 hover:border-[#D1C9BC] dark:hover:border-[#423E37] hover:shadow-md flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECE8DF] dark:bg-[#282622]">
              <ImageWithFallback
                src={meta.image}
                alt={meta.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <span className="text-[11px] font-mono tracking-wider opacity-85 block mb-0.5">
                  {meta.count} კერძი
                </span>
                <h3 className="font-serif text-xl font-semibold tracking-tight">
                  {meta.title}
                </h3>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between text-xs text-[#6F6A62] dark:text-[#A09B90] bg-white dark:bg-[#201E1B]">
              <span>{meta.subtitle}</span>
              <span className="text-[#7C8B70] dark:text-[#8F9E84] font-medium group-hover:translate-x-1 transition-transform">
                მენიუ →
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* "რა მოვამზადო?" Interactive Banner */}
      <section className="bg-white dark:bg-[#201E1B] border border-[#E7E2D9] dark:border-[#2F2C27] rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
        <div className="max-w-md text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#7C8B70] dark:text-[#8F9E84] font-medium uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>სწრაფი არჩევანი</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
            ვერ გადაგიწყვეტიათ რა მოამზადოთ?
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6F6A62] dark:text-[#A09B90] leading-relaxed">
            აირჩიეთ კატეგორია და დრო, ან მიეცით საშუალება მენიუს, შემოგთავაზოთ დღის იდეალური კერძი.
          </p>
        </div>

        <button
          onClick={onOpenRandom}
          className="cursor-pointer px-6 py-3 text-sm font-medium text-white bg-[#7C8B70] dark:bg-[#728268] hover:bg-[#6C7B60] dark:hover:bg-[#637259] active:scale-[0.98] rounded-md transition-all flex items-center gap-2 whitespace-nowrap shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>რა მოვამზადო?</span>
        </button>
      </section>

      {/* "დღეს გირჩევთ" (Today's Recommendations) */}
      <section className="space-y-5">
        <div className="flex items-end justify-between border-b border-[#E7E2D9] dark:border-[#2F2C27] pb-3">
          <div>
            <span className="text-xs text-[#7C8B70] dark:text-[#8F9E84] font-medium tracking-wide block mb-0.5">
              შერჩეული კოლექცია
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
              დღეს გირჩევთ
            </h2>
          </div>
          <span className="text-xs text-[#6F6A62] dark:text-[#A09B90] font-mono">
            3 ადამიანის ოჯახზე
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredDishes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectRecipe}
            />
          ))}
        </div>
      </section>

      {/* "კვირის მენიუ" (Weekly Menu Preview) */}
      <section className="bg-white dark:bg-[#201E1B] border border-[#E7E2D9] dark:border-[#2F2C27] rounded-lg p-6 sm:p-7 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-[#7C8B70] dark:text-[#8F9E84]" />
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1]">
                კვირის მენიუ
              </h3>
              <p className="text-xs text-[#6F6A62] dark:text-[#A09B90]">
                {plannedMealsCount > 0
                  ? `დაგეგმილია ${plannedMealsCount} კვება კვირის განმავლობაში`
                  : 'ჯერჯერობით კვირის გეგმა ცარიელია'}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToWeekly}
            className="cursor-pointer text-xs font-medium text-[#7C8B70] dark:text-[#8F9E84] hover:underline flex items-center gap-1"
          >
            <span>მთლიანი გეგმა</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact preview of planned days */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
          {DAYS_OF_WEEK.map((day) => {
            const plan = weeklyPlan[day];
            const hasMeals = !!(plan.breakfast || plan.lunch || plan.dessert);

            return (
              <div
                key={day}
                onClick={onNavigateToWeekly}
                className={`cursor-pointer p-2.5 rounded-md border text-center transition-colors ${
                  hasMeals
                    ? 'border-[#7C8B70]/50 bg-[#F4F7F2] dark:bg-[#1E251C]'
                    : 'border-[#E7E2D9] dark:border-[#2F2C27] bg-[#FAF8F5] dark:bg-[#1C1A17] opacity-70'
                }`}
              >
                <span className="block text-xs font-medium text-[#222222] dark:text-[#ECE8E1] mb-1">
                  {day.slice(0, 3)}
                </span>
                <span className="text-[10px] text-[#6F6A62] dark:text-[#A09B90] font-mono">
                  {hasMeals ? '✓ დაგეგმილი' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* "რჩეული კერძები" (Favorites Preview if any) */}
      {favoriteRecipes.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-end justify-between border-b border-[#E7E2D9] dark:border-[#2F2C27] pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#B87961] dark:text-[#C4856E] fill-[#B87961] dark:fill-[#C4856E]" />
              <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
                რჩეული კერძები
              </h2>
            </div>
            <button
              onClick={onNavigateToFavorites}
              className="cursor-pointer text-xs font-medium text-[#7C8B70] dark:text-[#8F9E84] hover:underline"
            >
              ყველას ნახვა ({favoriteRecipes.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteRecipes.slice(0, 4).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectRecipe}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
