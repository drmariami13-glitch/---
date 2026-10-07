import React, { useState, useMemo } from 'react';
import { Recipe, Category } from '../types/recipe';
import { RecipeCard } from './RecipeCard';
import { SearchBar } from './SearchBar';
import { FilterBar, FilterState } from './FilterBar';

interface CategoryViewProps {
  category: Category;
  recipes: Recipe[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const CATEGORY_META: Record<
  Category,
  { title: string; subtitle: string; lead: string }
> = {
  breakfast: {
    title: 'საუზმე',
    subtitle: '10 კერძი',
    lead: 'მსუბუქი, გემრიელი და ნოყიერი დასაწყისი — გათვლილი 3 ადამიანის ოჯახზე.'
  },
  lunch: {
    title: 'სადილი',
    subtitle: '14 კერძი',
    lead: 'დაბალანსებული, ცილოვანი და დახვეწილი კერძები რესტორნის განწყობით.'
  },
  dessert: {
    title: 'დესერტი',
    subtitle: '9 კერძი',
    lead: 'სუფთა სიტკბო დამატებული შაქრის გარეშე, ბუნებრივი ინგრედიენტებით.'
  }
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  recipes,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe
}) => {
  const meta = CATEGORY_META[category];

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: category,
    maxTime: null,
    proteinLevel: 'all',
    difficulty: 'all'
  });

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (r.category !== category) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesDesc = r.shortDescription.toLowerCase().includes(q);
        const matchesIng = r.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(q)
        );
        const matchesTags = r.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng && !matchesTags) {
          return false;
        }
      }

      if (filters.maxTime !== null && r.totalTime > filters.maxTime) {
        return false;
      }

      if (filters.proteinLevel === 'high' && r.protein < 25) return false;
      if (filters.proteinLevel === 'medium' && (r.protein < 15 || r.protein >= 25))
        return false;
      if (filters.proteinLevel === 'light' && r.protein >= 15) return false;

      if (filters.difficulty !== 'all' && r.difficulty !== filters.difficulty) {
        return false;
      }

      return true;
    });
  }, [recipes, category, searchQuery, filters]);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E7E2D9] dark:border-[#2F2C27] pb-6">
        <span className="text-xs text-[#7C8B70] dark:text-[#8F9E84] font-medium tracking-wide uppercase block mb-1">
          {meta.subtitle}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#6F6A62] dark:text-[#A09B90] max-w-2xl leading-relaxed">
          {meta.lead}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar query={searchQuery} onChange={setSearchQuery} />
        <FilterBar
          filters={filters}
          onChange={(newFilters) =>
            setFilters({ ...newFilters, category })
          }
          totalCount={filteredRecipes.length}
        />
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#201E1B] rounded-lg border border-[#E7E2D9] dark:border-[#2F2C27] p-8">
          <p className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1]">
            ამ ძიებით კერძი ვერ ვიპოვეთ.
          </p>
          <p className="mt-1.5 text-xs text-[#6F6A62] dark:text-[#A09B90]">
            სცადეთ სხვა საძიებო სიტყვა ან მოხსენით ფილტრები.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({
                category,
                maxTime: null,
                proteinLevel: 'all',
                difficulty: 'all'
              });
            }}
            className="cursor-pointer mt-4 px-4 py-2 text-xs font-medium text-[#7C8B70] dark:text-[#8F9E84] hover:underline"
          >
            ფილტრების გასუფთავება
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
};
