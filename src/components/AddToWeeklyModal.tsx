import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Recipe, DayOfWeek, Category } from '../types/recipe';
import { DAYS_OF_WEEK } from '../hooks/useWeeklyMenu';

interface AddToWeeklyModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (day: DayOfWeek, mealType: Category, recipeId: string) => void;
}

export const AddToWeeklyModal: React.FC<AddToWeeklyModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('ორშაბათი');
  const [mealType, setMealType] = useState<Category>(recipe?.category || 'lunch');

  React.useEffect(() => {
    if (recipe) {
      setMealType(recipe.category);
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedDay, mealType, recipe.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white dark:bg-[#1E1C19] rounded-lg shadow-xl border border-[#E7E2D9] dark:border-[#2F2C27] p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-[#6F6A62] dark:text-[#A09B90] hover:text-[#222222] dark:hover:text-[#ECE8E1]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#7C8B70] dark:text-[#8F9E84]" />
          <h3 className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1]">
            კვირის მენიუში დამატება
          </h3>
        </div>

        <p className="text-xs text-[#6F6A62] dark:text-[#A09B90] mb-5">
          კერძი: <strong className="text-[#222222] dark:text-[#ECE8E1] font-medium">{recipe.name}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day selection */}
          <div>
            <label className="block text-xs font-medium text-[#222222] dark:text-[#ECE8E1] mb-1.5">
              აირჩიეთ დღე
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`cursor-pointer px-3 py-2 text-xs text-left rounded-md border transition-all ${
                    selectedDay === day
                      ? 'border-[#7C8B70] dark:border-[#8F9E84] bg-[#7C8B70]/10 dark:bg-[#8F9E84]/15 text-[#222222] dark:text-[#ECE8E1] font-semibold'
                      : 'border-[#E7E2D9] dark:border-[#2F2C27] text-[#6F6A62] dark:text-[#A09B90] hover:border-[#D1C9BC] dark:hover:border-[#423E37]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Meal type selection */}
          <div>
            <label className="block text-xs font-medium text-[#222222] dark:text-[#ECE8E1] mb-1.5">
              კვება
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: 'breakfast', label: 'საუზმე' },
                  { key: 'lunch', label: 'სადილი' },
                  { key: 'dessert', label: 'დესერტი' }
                ] as const
              ).map((type) => (
                <button
                  type="button"
                  key={type.key}
                  onClick={() => setMealType(type.key)}
                  className={`cursor-pointer py-2 text-xs rounded-md border text-center transition-all ${
                    mealType === type.key
                      ? 'border-[#7C8B70] dark:border-[#8F9E84] bg-[#7C8B70] dark:bg-[#728268] text-white font-medium'
                      : 'border-[#E7E2D9] dark:border-[#2F2C27] text-[#6F6A62] dark:text-[#A09B90] hover:border-[#D1C9BC] dark:hover:border-[#423E37]'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-xs text-[#6F6A62] dark:text-[#A09B90] hover:text-[#222222] dark:hover:text-[#ECE8E1]"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="cursor-pointer px-5 py-2 text-xs font-medium text-white bg-[#7C8B70] dark:bg-[#728268] hover:bg-[#6C7B60] dark:hover:bg-[#637259] rounded-md transition-colors"
            >
              მენიუში დამატება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
