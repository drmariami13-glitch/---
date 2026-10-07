import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { WeeklyPlan, DayOfWeek, Category, Recipe } from '../types/recipe';
import { RECIPES } from '../data/recipes';
import { ImageWithFallback } from './ImageWithFallback';

interface WeeklyMenuPlannerProps {
  weeklyPlan: WeeklyPlan;
  onSetMeal: (day: DayOfWeek, mealType: Category, recipeId: string | null) => void;
  onClearPlan: () => void;
  onGenerateShoppingList: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const WeeklyMenuPlanner: React.FC<WeeklyMenuPlannerProps> = ({
  weeklyPlan,
  onSetMeal,
  onClearPlan,
  onGenerateShoppingList,
  onSelectRecipe
}) => {
  const [pickerModal, setPickerModal] = useState<{
    isOpen: boolean;
    day: DayOfWeek;
    category: Category;
  } | null>(null);

  const recipeMap = new Map<string, Recipe>();
  RECIPES.forEach((r) => recipeMap.set(r.id, r));

  const days: DayOfWeek[] = [
    'ორშაბათი',
    'სამშაბათი',
    'ოთხშაბათი',
    'ხუთშაბათი',
    'პარასკევი',
    'შაბათი',
    'კვირა'
  ];

  const mealSlots: { key: Category; label: string }[] = [
    { key: 'breakfast', label: 'საუზმე' },
    { key: 'lunch', label: 'სადილი' },
    { key: 'dessert', label: 'დესერტი' }
  ];

  const countPlanned = () => {
    let count = 0;
    days.forEach((d) => {
      if (weeklyPlan[d].breakfast) count++;
      if (weeklyPlan[d].lunch) count++;
      if (weeklyPlan[d].dessert) count++;
    });
    return count;
  };

  const totalPlanned = countPlanned();

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E7E2D9] dark:border-[#2F2C27]">
        <div>
          <span className="text-xs text-[#7C8B70] dark:text-[#8F9E84] font-medium tracking-wide block mb-1">
            7-დღიანი გეგმა
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
            კვირის მენიუ
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6F6A62] dark:text-[#A09B90]">
            დაგეგმეთ ოჯახის 3 ადამიანის კვება და ავტომატურად შექმენით საყიდლების სია.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {totalPlanned > 0 && (
            <button
              onClick={onClearPlan}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs text-[#B87961] dark:text-[#C4856E] hover:underline rounded-md border border-[#E7E2D9] dark:border-[#2F2C27] bg-white dark:bg-[#201E1B] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>გეგმის გასუფთავება</span>
            </button>
          )}

          <button
            onClick={onGenerateShoppingList}
            disabled={totalPlanned === 0}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all shadow-xs ${
              totalPlanned > 0
                ? 'bg-[#7C8B70] dark:bg-[#728268] text-white hover:bg-[#6C7B60] dark:hover:bg-[#637259]'
                : 'bg-[#E7E2D9] dark:bg-[#2A2722] text-[#A49F96] dark:text-[#645F56] cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>საყიდლების სიის გენერირება ({totalPlanned})</span>
          </button>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {days.map((day) => {
          const plan = weeklyPlan[day];

          return (
            <div
              key={day}
              className="bg-white dark:bg-[#201E1B] rounded-lg border border-[#E7E2D9] dark:border-[#2F2C27] overflow-hidden flex flex-col shadow-2xs"
            >
              {/* Day Header */}
              <div className="px-4 py-3 bg-[#FAF8F5] dark:bg-[#25231F] border-b border-[#E7E2D9] dark:border-[#2F2C27] flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-[#222222] dark:text-[#ECE8E1]">
                  {day}
                </span>
                <CalendarDays className="w-4 h-4 text-[#7C8B70] dark:text-[#8F9E84]" />
              </div>

              {/* 3 Meal Slots */}
              <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                {mealSlots.map(({ key, label }) => {
                  const dishId = plan[key];
                  const dish = dishId ? recipeMap.get(dishId) : null;

                  return (
                    <div
                      key={key}
                      className="p-2.5 rounded-md border border-[#F1ECE3] dark:border-[#2A2722] bg-[#FCFBF8] dark:bg-[#1C1A17] flex flex-col justify-between min-h-[92px]"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#7C8B70] dark:text-[#8F9E84] mb-1">
                        <span>{label}</span>
                        {dish && (
                          <button
                            onClick={() => onSetMeal(day, key, null)}
                            className="cursor-pointer text-[#6F6A62] dark:text-[#A09B90] hover:text-[#B87961] dark:hover:text-[#C4856E] transition-colors p-0.5"
                            title="ამოშლა"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {dish ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-[#ECE8DF] dark:bg-[#282622]">
                            <ImageWithFallback
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => onSelectRecipe(dish)}
                              className="cursor-pointer text-left font-serif text-xs font-semibold text-[#222222] dark:text-[#ECE8E1] hover:text-[#7C8B70] dark:hover:text-[#8F9E84] transition-colors line-clamp-1 block w-full"
                            >
                              {dish.name}
                            </button>
                            <span className="text-[10px] text-[#6F6A62] dark:text-[#A09B90] block font-mono">
                              {dish.totalTime} წთ · {dish.protein}გ ცილა
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setPickerModal({
                              isOpen: true,
                              day,
                              category: key
                            })
                          }
                          className="cursor-pointer w-full py-2 flex items-center justify-center gap-1 text-[11px] text-[#6F6A62] dark:text-[#A09B90] hover:text-[#7C8B70] dark:hover:text-[#8F9E84] hover:bg-[#F4F1EA] dark:hover:bg-[#282622] rounded border border-dashed border-[#E0DBD0] dark:border-[#38342D] transition-colors mt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>კერძის არჩევა</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Dish Picker Dialog */}
      {pickerModal && pickerModal.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0"
            onClick={() => setPickerModal(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1C19] rounded-lg shadow-xl border border-[#E7E2D9] dark:border-[#2F2C27] max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E7E2D9] dark:border-[#2F2C27] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#222222] dark:text-[#ECE8E1]">
                  აირჩიეთ კერძი ({pickerModal.day} —{' '}
                  {pickerModal.category === 'breakfast'
                    ? 'საუზმე'
                    : pickerModal.category === 'lunch'
                    ? 'სადილი'
                    : 'დესერტი'}
                  )
                </h3>
              </div>
              <button
                onClick={() => setPickerModal(null)}
                className="cursor-pointer text-[#6F6A62] dark:text-[#A09B90] hover:text-[#222222] dark:hover:text-[#ECE8E1]"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-[#F1ECE3] dark:divide-[#2A2722]">
              {RECIPES.filter((r) => r.category === pickerModal.category).map(
                (recipe) => (
                  <div
                    key={recipe.id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-[#ECE8DF] dark:bg-[#282622]">
                        <ImageWithFallback
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-semibold text-[#222222] dark:text-[#ECE8E1] truncate">
                          {recipe.name}
                        </h4>
                        <span className="text-xs text-[#6F6A62] dark:text-[#A09B90] font-mono">
                          {recipe.totalTime} წთ · {recipe.protein}გ ცილა · ~
                          {recipe.calories} კკალ
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSetMeal(pickerModal.day, pickerModal.category, recipe.id);
                        setPickerModal(null);
                      }}
                      className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-[#7C8B70] dark:bg-[#728268] text-white hover:bg-[#6C7B60] dark:hover:bg-[#637259] rounded-md shrink-0 transition-colors"
                    >
                      არჩევა
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
