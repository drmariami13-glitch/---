import { useState, useEffect } from 'react';
import { DayOfWeek, DayPlan, WeeklyPlan, Category } from '../types/recipe';

const STORAGE_KEY = 'our_menu_weekly_plan';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'ორშაბათი',
  'სამშაბათი',
  'ოთხშაბათი',
  'ხუთშაბათი',
  'პარასკევი',
  'შაბათი',
  'კვირა'
];

const DEFAULT_PLAN: WeeklyPlan = {
  'ორშაბათი': { breakfast: null, lunch: null, dessert: null },
  'სამშაბათი': { breakfast: null, lunch: null, dessert: null },
  'ოთხშაბათი': { breakfast: null, lunch: null, dessert: null },
  'ხუთშაბათი': { breakfast: null, lunch: null, dessert: null },
  'პარასკევი': { breakfast: null, lunch: null, dessert: null },
  'შაბათი': { breakfast: null, lunch: null, dessert: null },
  'კვირა': { breakfast: null, lunch: null, dessert: null }
};

export function useWeeklyMenu() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all days exist
        const merged = { ...DEFAULT_PLAN };
        DAYS_OF_WEEK.forEach((day) => {
          if (parsed[day]) {
            merged[day] = {
              breakfast: parsed[day].breakfast || null,
              lunch: parsed[day].lunch || null,
              dessert: parsed[day].dessert || null
            };
          }
        });
        return merged;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PLAN;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(weeklyPlan));
    } catch {
      // ignore
    }
  }, [weeklyPlan]);

  const setMeal = (day: DayOfWeek, mealType: Category, recipeId: string | null) => {
    setWeeklyPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: recipeId
      }
    }));
  };

  const removeMeal = (day: DayOfWeek, mealType: Category) => {
    setMeal(day, mealType, null);
  };

  const clearWeeklyPlan = () => {
    setWeeklyPlan(DEFAULT_PLAN);
  };

  const getPlannedRecipeIds = (): string[] => {
    const ids: string[] = [];
    DAYS_OF_WEEK.forEach((day) => {
      const plan = weeklyPlan[day];
      if (plan.breakfast) ids.push(plan.breakfast);
      if (plan.lunch) ids.push(plan.lunch);
      if (plan.dessert) ids.push(plan.dessert);
    });
    return ids;
  };

  const hasAnyDishes = getPlannedRecipeIds().length > 0;

  return {
    weeklyPlan,
    setMeal,
    removeMeal,
    clearWeeklyPlan,
    getPlannedRecipeIds,
    hasAnyDishes,
    daysOfWeek: DAYS_OF_WEEK
  };
}
