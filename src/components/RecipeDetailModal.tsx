import React, { useEffect } from 'react';
import {
  X,
  Heart,
  CalendarPlus,
  ShoppingBag,
  Share2,
  Printer,
  Clock,
  Users,
  Flame,
  Lightbulb
} from 'lucide-react';
import { Recipe } from '../types/recipe';
import { ImageWithFallback } from './ImageWithFallback';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToWeekly: (recipe: Recipe) => void;
  onAddToShoppingList: (recipe: Recipe) => void;
  onShowToast: (message: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToWeekly,
  onAddToShoppingList,
  onShowToast
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !recipe) return null;

  const handleShare = async () => {
    const shareData = {
      title: recipe.name,
      text: `${recipe.name} — ${recipe.shortDescription}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        onShowToast('რეცეპტის ბმული დაკოპირდა ბუფერში');
      } catch {
        onShowToast('ბმულის კოპირება ვერ მოხერხდა');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-recipe-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 transition-all"
    >
      {/* Backdrop click area */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1E1C19] sm:rounded-lg overflow-hidden shadow-2xl z-10 min-h-screen sm:min-h-0 max-h-screen sm:max-h-[92vh] flex flex-col my-auto border border-[#E7E2D9] dark:border-[#2F2C27] print-page">
        {/* Sticky Close & Quick Actions Bar */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 no-print">
          <button
            onClick={handleShare}
            className="cursor-pointer p-2 rounded-full bg-white/90 dark:bg-[#201E1B]/90 text-[#222222] dark:text-[#ECE8E1] hover:bg-white dark:hover:bg-[#282622] shadow-xs transition-colors"
            title="გაზიარება"
            aria-label="გაზიარება"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="cursor-pointer p-2 rounded-full bg-white/90 dark:bg-[#201E1B]/90 text-[#222222] dark:text-[#ECE8E1] hover:bg-white dark:hover:bg-[#282622] shadow-xs transition-colors"
            title="ბეჭდვა"
            aria-label="ბეჭდვა"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full bg-white/90 dark:bg-[#201E1B]/90 text-[#222222] dark:text-[#ECE8E1] hover:bg-white dark:hover:bg-[#282622] shadow-xs transition-colors"
            title="დახურვა"
            aria-label="დახურვა"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Food Photography */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#ECE8DF] dark:bg-[#282622]">
            <ImageWithFallback
              src={recipe.image}
              alt={recipe.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Recipe Content */}
          <div className="p-5 sm:p-8 space-y-6">
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7C8B70] dark:text-[#8F9E84] font-medium tracking-wide mb-2 uppercase">
                <span>
                  {recipe.category === 'breakfast'
                    ? 'საუზმე'
                    : recipe.category === 'lunch'
                    ? 'სადილი'
                    : 'დესერტი'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{recipe.difficulty}</span>
              </div>
              <h2
                id="modal-recipe-title"
                className="font-serif text-2xl sm:text-3xl font-semibold text-[#222222] dark:text-[#ECE8E1] leading-tight"
              >
                {recipe.name}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#6F6A62] dark:text-[#A09B90] leading-relaxed">
                {recipe.shortDescription}
              </p>
            </div>

            {/* Unboxed Nutrition & Key Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8F6F1] dark:bg-[#24221E] rounded-md border border-[#E7E2D9] dark:border-[#2F2C27] text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#7C8B70] dark:text-[#8F9E84] shrink-0" />
                <div>
                  <div className="text-[#6F6A62] dark:text-[#A09B90]">მომზადება</div>
                  <div className="font-semibold text-[#222222] dark:text-[#ECE8E1] tabular-nums">
                    {recipe.totalTime} წუთი
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#7C8B70] dark:text-[#8F9E84] shrink-0" />
                <div>
                  <div className="text-[#6F6A62] dark:text-[#A09B90]">პორცია</div>
                  <div className="font-semibold text-[#222222] dark:text-[#ECE8E1] tabular-nums">
                    {recipe.servings} ადამიანზე
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 text-[#B87961] dark:text-[#C4856E] font-bold text-sm flex items-center justify-center shrink-0">
                  🥩
                </div>
                <div>
                  <div className="text-[#6F6A62] dark:text-[#A09B90]">ცილა (თითოზე)</div>
                  <div className="font-semibold text-[#222222] dark:text-[#ECE8E1] tabular-nums">
                    ~{recipe.protein} გრამი
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-[#B87961] dark:text-[#C4856E] shrink-0" />
                <div>
                  <div className="text-[#6F6A62] dark:text-[#A09B90]">ენერგია</div>
                  <div className="font-semibold text-[#222222] dark:text-[#ECE8E1] tabular-nums">
                    ~{recipe.calories} კკალ
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 pb-1 border-b border-[#E7E2D9] dark:border-[#2F2C27] no-print">
              <button
                onClick={() => onToggleFavorite(recipe.id)}
                className={`cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium border transition-colors ${
                  isFavorite
                    ? 'border-[#B87961] bg-[#B87961]/15 text-[#B87961] dark:text-[#C4856E]'
                    : 'border-[#E7E2D9] dark:border-[#2F2C27] bg-white dark:bg-[#201E1B] text-[#222222] dark:text-[#ECE8E1] hover:bg-[#F8F6F1] dark:hover:bg-[#282622]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? 'fill-[#B87961] dark:fill-[#C4856E]' : ''}`}
                />
                <span>{isFavorite ? 'რჩეულებშია' : 'რჩეულებში დამატება'}</span>
              </button>

              <button
                onClick={() => onAddToWeekly(recipe)}
                className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium border border-[#E7E2D9] dark:border-[#2F2C27] bg-white dark:bg-[#201E1B] text-[#222222] dark:text-[#ECE8E1] hover:bg-[#F8F6F1] dark:hover:bg-[#282622] transition-colors"
              >
                <CalendarPlus className="w-4 h-4 text-[#7C8B70] dark:text-[#8F9E84]" />
                <span>კვირის მენიუში დამატება</span>
              </button>

              <button
                onClick={() => {
                  onAddToShoppingList(recipe);
                  onShowToast('ინგრედიენტები დაემატა საყიდლების სიაში');
                }}
                className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium bg-[#7C8B70] dark:bg-[#728268] text-white hover:bg-[#6C7B60] dark:hover:bg-[#637259] transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>საყიდლებში დამატება</span>
              </button>
            </div>

            {/* Ingredients Section */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1]">
                  ინგრედიენტები
                </h3>
                <span className="text-xs text-[#6F6A62] dark:text-[#A09B90]">
                  გათვლილია 3 ადამიანის ოჯახზე
                </span>
              </div>
              <ul className="divide-y divide-[#F1ECE3] dark:divide-[#2A2722] border-t border-b border-[#F1ECE3] dark:border-[#2A2722]">
                {recipe.ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    className="py-2.5 flex items-center justify-between text-sm"
                  >
                    <span className="text-[#222222] dark:text-[#ECE8E1]">{ing.name}</span>
                    <span className="font-mono text-xs sm:text-sm font-medium text-[#6F6A62] dark:text-[#A09B90] tabular-nums">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1] mb-3">
                მომზადება
              </h3>
              <ol className="space-y-3.5">
                {recipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed">
                    <span className="font-mono text-xs font-semibold text-[#7C8B70] dark:text-[#8F9E84] bg-[#7C8B70]/10 dark:bg-[#8F9E84]/15 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-[#333333] dark:text-[#D5D0C7]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Chef Tip */}
            {recipe.chefTip && (
              <div className="p-4 bg-[#F3F6F1] dark:bg-[#1E251C] border-l-3 border-[#7C8B70] dark:border-[#8F9E84] rounded-r-md text-xs sm:text-sm text-[#444C3F] dark:text-[#CAD6C5] flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-[#7C8B70] dark:text-[#8F9E84] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5 text-[#2E362A] dark:text-[#E2EBE0]">
                    ჩვენი რჩევა
                  </span>
                  <span>{recipe.chefTip}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
