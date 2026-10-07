import React, { useState, useMemo } from 'react';
import { RECIPES } from './data/recipes';
import { Recipe, Category, DayOfWeek } from './types/recipe';
import { useFavorites } from './hooks/useFavorites';
import { useWeeklyMenu } from './hooks/useWeeklyMenu';
import { useShoppingList } from './hooks/useShoppingList';
import { useTheme } from './hooks/useTheme';

import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { FavoritesView } from './components/FavoritesView';
import { WeeklyMenuPlanner } from './components/WeeklyMenuPlanner';
import { ShoppingListView } from './components/ShoppingListView';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { AddToWeeklyModal } from './components/AddToWeeklyModal';
import { RandomDishModal } from './components/RandomDishModal';
import { Toast } from './components/Toast';

import shakshukaImg from './assets/images/shakshuka_breakfast_1791370536321.jpg';
import shkmeruliImg from './assets/images/shkmeruli_dish_1791370460004.jpg';
import peachGaletteImg from './assets/images/peach_galette_dessert_1791370593741.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [addToWeeklyRecipe, setAddToWeeklyRecipe] = useState<Recipe | null>(null);
  const [isRandomOpen, setIsRandomOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme hook (Day / Night Mode)
  const { isDark, toggleTheme } = useTheme();

  // State hooks
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const {
    weeklyPlan,
    setMeal,
    clearWeeklyPlan,
    getPlannedRecipeIds
  } = useWeeklyMenu();
  const {
    items: shoppingItems,
    toggleItem,
    removeItem,
    clearCompleted,
    clearAll: clearShoppingList,
    addItem: addShoppingItem,
    generateFromRecipeIds,
    addRecipeIngredients
  } = useShoppingList();

  // Recipe lookup map
  const recipesMap = useMemo(() => {
    const map = new Map<string, Recipe>();
    RECIPES.forEach((r) => map.set(r.id, r));
    return map;
  }, []);

  // Category card image mapping
  const categoryImages: Record<
    Category,
    { title: string; subtitle: string; count: number; image: string }
  > = {
    breakfast: {
      title: 'საუზმე',
      subtitle: 'ენერგიული და ნოყიერი დასაწყისი',
      count: 10,
      image: shakshukaImg
    },
    lunch: {
      title: 'სადილი',
      subtitle: 'დაბალანსებული ცილოვანი კერძები',
      count: 14,
      image: shkmeruliImg
    },
    dessert: {
      title: 'დესერტი',
      subtitle: 'სუფთა სიტკბო შაქრის გარეშე',
      count: 9,
      image: peachGaletteImg
    }
  };

  // Featured 4 dishes on homepage
  const featuredDishes = useMemo(() => {
    const targetIds = [
      'shkmeruli-chicken',
      'gelarji-breakfast',
      'lemon-garlic-dorado',
      'yogurt-panna-cotta-blueberries'
    ];
    return targetIds
      .map((id) => recipesMap.get(id))
      .filter((r): r is Recipe => !!r);
  }, [recipesMap]);

  // Favorite recipe list
  const favoriteRecipes = useMemo(() => {
    return favorites
      .map((id) => recipesMap.get(id))
      .filter((r): r is Recipe => !!r);
  }, [favorites, recipesMap]);

  // Handlers
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const willBeFav = !isFavorite(id);
    toggleFavorite(id);
    setToastMessage(willBeFav ? 'დაემატა რჩეულებში' : 'ამოიშალა რჩეულებიდან');
  };

  const handleGenerateWeeklyShopping = () => {
    const plannedIds = getPlannedRecipeIds();
    if (plannedIds.length === 0) {
      setToastMessage('კვირის მენიუში ჯერ არ გაქვთ კერძები დამატებული');
      return;
    }
    generateFromRecipeIds(plannedIds);
    setActiveTab('shopping');
    setToastMessage('საყიდლების სია წარმატებით შეიქმნა');
  };

  const handleConfirmAddToWeekly = (
    day: DayOfWeek,
    mealType: Category,
    recipeId: string
  ) => {
    setMeal(day, mealType, recipeId);
    setToastMessage(`დაემატა კვირის მენიუში (${day} — ${
      mealType === 'breakfast' ? 'საუზმე' : mealType === 'lunch' ? 'სადილი' : 'დესერტი'
    })`);
  };
  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#161513] text-[#ECE8E1]' : 'bg-[#F8F6F1] text-[#222222]'} flex flex-col font-sans selection:bg-[#7C8B70]/20 selection:text-[#222222] transition-colors duration-200`}>
      {/* Top Bar with Day/Night Mode toggle */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRandom={() => setIsRandomOpen(true)}
        favoritesCount={favorites.length}
        shoppingItemsCount={shoppingItems.filter((i) => !i.completed).length}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-16">
        {activeTab === 'home' && (
          <HomeView
            onSelectCategory={(cat) => setActiveTab(cat)}
            onOpenRandom={() => setIsRandomOpen(true)}
            onSelectRecipe={setSelectedRecipe}
            featuredDishes={featuredDishes}
            categoryImages={categoryImages}
            weeklyPlan={weeklyPlan}
            recipesMap={recipesMap}
            favoriteRecipes={favoriteRecipes}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToWeekly={() => setActiveTab('weekly')}
            onNavigateToFavorites={() => setActiveTab('favorites')}
          />
        )}

        {activeTab === 'breakfast' && (
          <CategoryView
            category="breakfast"
            recipes={RECIPES}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={setSelectedRecipe}
          />
        )}

        {activeTab === 'lunch' && (
          <CategoryView
            category="lunch"
            recipes={RECIPES}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={setSelectedRecipe}
          />
        )}

        {activeTab === 'dessert' && (
          <CategoryView
            category="dessert"
            recipes={RECIPES}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={setSelectedRecipe}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyMenuPlanner
            weeklyPlan={weeklyPlan}
            onSetMeal={setMeal}
            onClearPlan={() => {
              clearWeeklyPlan();
              setToastMessage('კვირის გეგმა გასუფთავდა');
            }}
            onGenerateShoppingList={handleGenerateWeeklyShopping}
            onSelectRecipe={setSelectedRecipe}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favoriteRecipes={favoriteRecipes}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={setSelectedRecipe}
            onBrowseMenu={() => setActiveTab('lunch')}
          />
        )}

        {activeTab === 'shopping' && (
          <ShoppingListView
            items={shoppingItems}
            onToggleItem={toggleItem}
            onRemoveItem={(id) => {
              removeItem(id);
              setToastMessage('პროდუქტი ამოიშალა სიიდან');
            }}
            onClearCompleted={() => {
              clearCompleted();
              setToastMessage('ნაყიდი პროდუქტები წაიშალა');
            }}
            onClearAll={() => {
              clearShoppingList();
              setToastMessage('საყიდლების სია გასუფთავდა');
            }}
            onAddItem={addShoppingItem}
            onShowToast={setToastMessage}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E7E2D9] dark:border-[#2F2C27] bg-white dark:bg-[#1E1C19] text-xs text-[#6F6A62] dark:text-[#A09B90] py-8 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-[#222222] dark:text-[#ECE8E1]">
              ჩვენი მენიუ
            </span>
            <span>·</span>
            <span>სახლის ციფრული რესტორანი 3 ადამიანისთვის</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('breakfast')}
              className="hover:text-[#222222] dark:hover:text-[#ECE8E1] transition-colors"
            >
              საუზმე
            </button>
            <button
              onClick={() => setActiveTab('lunch')}
              className="hover:text-[#222222] dark:hover:text-[#ECE8E1] transition-colors"
            >
              სადილი
            </button>
            <button
              onClick={() => setActiveTab('dessert')}
              className="hover:text-[#222222] dark:hover:text-[#ECE8E1] transition-colors"
            >
              დესერტი
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className="hover:text-[#222222] dark:hover:text-[#ECE8E1] transition-colors"
            >
              კვირის მენიუ
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoritesCount={favorites.length}
      />

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe.id) : false}
        onToggleFavorite={(id) => {
          const willBeFav = !isFavorite(id);
          toggleFavorite(id);
          setToastMessage(willBeFav ? 'დაემატა რჩეულებში' : 'ამოიშალა რჩეულებიდან');
        }}
        onAddToWeekly={(recipe) => setAddToWeeklyRecipe(recipe)}
        onAddToShoppingList={addRecipeIngredients}
        onShowToast={setToastMessage}
      />

      {/* Add To Weekly Modal */}
      <AddToWeeklyModal
        recipe={addToWeeklyRecipe}
        isOpen={!!addToWeeklyRecipe}
        onClose={() => setAddToWeeklyRecipe(null)}
        onConfirm={handleConfirmAddToWeekly}
      />

      {/* "რა მოვამზადო?" Random Dish Modal */}
      <RandomDishModal
        isOpen={isRandomOpen}
        onClose={() => setIsRandomOpen(false)}
        onSelectRecipe={setSelectedRecipe}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
