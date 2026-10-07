import React, { useState, useEffect } from 'react';
import { X, Sparkles, RefreshCw, ChefHat, Clock } from 'lucide-react';
import { Recipe, Category } from '../types/recipe';
import { RECIPES } from '../data/recipes';
import { ImageWithFallback } from './ImageWithFallback';

interface RandomDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RandomDishModal: React.FC<RandomDishModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'any'>('any');
  const [selectedMaxTime, setSelectedMaxTime] = useState<number | null>(null);
  const [currentDish, setCurrentDish] = useState<Recipe | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const filterDishes = () => {
    return RECIPES.filter((r) => {
      if (selectedCategory !== 'any' && r.category !== selectedCategory) return false;
      if (selectedMaxTime !== null && r.totalTime > selectedMaxTime) return false;
      return true;
    });
  };

  const pickRandom = () => {
    const candidates = filterDishes();
    if (candidates.length === 0) {
      setCurrentDish(null);
      return;
    }
    setIsShuffling(true);

    setTimeout(() => {
      const remaining = candidates.filter((c) => !currentDish || c.id !== currentDish.id);
      const pool = remaining.length > 0 ? remaining : candidates;
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      setCurrentDish(chosen);
      setIsShuffling(false);
    }, 200);
  };

  useEffect(() => {
    if (isOpen) {
      pickRandom();
    }
  }, [isOpen, selectedCategory, selectedMaxTime]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#1E1C19] rounded-lg shadow-xl border border-[#E7E2D9] dark:border-[#2F2C27] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D9] dark:border-[#2F2C27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7C8B70] dark:text-[#8F9E84]" />
            <h3 className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1]">
              რა მოვამზადო?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-[#6F6A62] dark:text-[#A09B90] hover:text-[#222222] dark:hover:text-[#ECE8E1] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-[#F8F6F1] dark:bg-[#24221E] border-b border-[#E7E2D9] dark:border-[#2F2C27] space-y-3 text-xs">
          <div>
            <span className="text-[#6F6A62] dark:text-[#A09B90] block mb-1">კატეგორია:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'any', label: 'ნებისმიერი' },
                { key: 'breakfast', label: 'საუზმე' },
                { key: 'lunch', label: 'სადილი' },
                { key: 'dessert', label: 'დესერტი' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key as any)}
                  className={`cursor-pointer px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedCategory === cat.key
                      ? 'bg-[#7C8B70] dark:bg-[#8F9E84] text-white dark:text-[#161513] font-medium'
                      : 'bg-white dark:bg-[#2A2722] text-[#6F6A62] dark:text-[#A09B90] border border-[#E7E2D9] dark:border-[#38342D] hover:bg-[#F2EFE8] dark:hover:bg-[#34302A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[#6F6A62] dark:text-[#A09B90] block mb-1">დრო:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { time: null, label: 'მნიშვნელობა არ აქვს' },
                { time: 15, label: '15 წუთამდე' },
                { time: 30, label: '30 წუთამდე' }
              ].map((item) => (
                <button
                  key={String(item.time)}
                  onClick={() => setSelectedMaxTime(item.time)}
                  className={`cursor-pointer px-2.5 py-1 rounded text-xs transition-colors ${
                    selectedMaxTime === item.time
                      ? 'bg-[#7C8B70] dark:bg-[#8F9E84] text-white dark:text-[#161513] font-medium'
                      : 'bg-white dark:bg-[#2A2722] text-[#6F6A62] dark:text-[#A09B90] border border-[#E7E2D9] dark:border-[#38342D] hover:bg-[#F2EFE8] dark:hover:bg-[#34302A]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Dish Display */}
        <div className="p-5">
          {currentDish ? (
            <div
              className={`transition-opacity duration-200 ${
                isShuffling ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="aspect-[16/10] w-full rounded-md overflow-hidden bg-[#ECE8DF] dark:bg-[#282622] mb-4">
                <ImageWithFallback
                  src={currentDish.image}
                  alt={currentDish.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-[#7C8B70] dark:text-[#8F9E84] font-mono mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {currentDish.totalTime} წთ
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{currentDish.protein}გ ცილა</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">~{currentDish.calories} კკალ</span>
              </div>

              <h4 className="font-serif text-xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
                {currentDish.name}
              </h4>
              <p className="mt-1 text-xs text-[#6F6A62] dark:text-[#A09B90] leading-relaxed">
                {currentDish.shortDescription}
              </p>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#6F6A62] dark:text-[#A09B90]">
              ამ პარამეტრებით კერძი ვერ მოიძებნა. შეცვალეთ დრო ან კატეგორია.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E7E2D9] dark:border-[#2F2C27] bg-[#FAF8F5] dark:bg-[#24221E] flex items-center justify-between gap-3">
          <button
            onClick={pickRandom}
            disabled={isShuffling}
            className="cursor-pointer flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#222222] dark:text-[#ECE8E1] bg-white dark:bg-[#2E2B26] border border-[#E7E2D9] dark:border-[#38342D] hover:bg-[#F2EFE8] dark:hover:bg-[#34302A] rounded-md transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#7C8B70] dark:text-[#8F9E84] ${
                isShuffling ? 'animate-spin' : ''
              }`}
            />
            <span>კიდევ ერთი</span>
          </button>

          {currentDish && (
            <button
              onClick={() => {
                onSelectRecipe(currentDish);
                onClose();
              }}
              className="cursor-pointer flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-[#7C8B70] dark:bg-[#728268] hover:bg-[#6C7B60] dark:hover:bg-[#637259] rounded-md transition-colors"
            >
              <ChefHat className="w-4 h-4" />
              <span>მომზადება</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
