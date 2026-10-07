import { useState, useEffect } from 'react';
import { ShoppingItem, Recipe } from '../types/recipe';
import { RECIPES } from '../data/recipes';

const STORAGE_KEY = 'our_menu_shopping_list';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.completed));
  };

  const clearAll = () => {
    setItems([]);
  };

  const addItem = (name: string, quantityStr: string) => {
    if (!name.trim()) return;
    const newItem: ShoppingItem = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      quantityStr: quantityStr.trim() || '1',
      completed: false,
      sourceRecipeNames: ['დამატებული']
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // Generate or append from list of recipe IDs
  const generateFromRecipeIds = (recipeIds: string[]) => {
    const recipeMap = new Map<string, Recipe>();
    RECIPES.forEach((r) => recipeMap.set(r.id, r));

    // Ingredient aggregation map
    // Key: clean lowercased ingredient name
    const aggMap = new Map<
      string,
      {
        displayName: string;
        numericTotal: number;
        hasNumeric: boolean;
        unit: string;
        notes: Set<string>;
        sources: Set<string>;
      }
    >();

    recipeIds.forEach((id) => {
      const recipe = recipeMap.get(id);
      if (!recipe) return;

      recipe.ingredients.forEach((ing) => {
        const key = ing.name.trim().toLowerCase();
        let existing = aggMap.get(key);

        if (!existing) {
          existing = {
            displayName: ing.name.trim(),
            numericTotal: 0,
            hasNumeric: false,
            unit: ing.unit.trim(),
            notes: new Set(),
            sources: new Set()
          };
          aggMap.set(key, existing);
        }

        existing.sources.add(recipe.name);

        const numVal = typeof ing.amount === 'number' ? ing.amount : parseFloat(String(ing.amount));
        if (!isNaN(numVal) && numVal > 0) {
          existing.numericTotal += numVal;
          existing.hasNumeric = true;
          if (!existing.unit && ing.unit) existing.unit = ing.unit.trim();
        } else {
          existing.notes.add(String(ing.amount) + (ing.unit ? ' ' + ing.unit : ''));
        }
      });
    });

    const newItems: ShoppingItem[] = [];
    aggMap.forEach((val, key) => {
      let quantityStr = '';
      if (val.hasNumeric) {
        quantityStr = `${Math.round(val.numericTotal * 10) / 10} ${val.unit}`.trim();
        if (val.notes.size > 0) {
          quantityStr += ` (${Array.from(val.notes).join(', ')})`;
        }
      } else if (val.notes.size > 0) {
        quantityStr = Array.from(val.notes).join(', ');
      } else {
        quantityStr = 'გემოვნებით';
      }

      newItems.push({
        id: 'ing-' + key.replace(/\s+/g, '-'),
        name: val.displayName,
        quantityStr,
        completed: false,
        sourceRecipeNames: Array.from(val.sources)
      });
    });

    setItems(newItems);
  };

  // Add ingredients of a single recipe into existing list
  const addRecipeIngredients = (recipe: Recipe) => {
    setItems((prev) => {
      const updated = [...prev];
      recipe.ingredients.forEach((ing) => {
        const existingIdx = updated.findIndex(
          (item) => item.name.toLowerCase() === ing.name.trim().toLowerCase()
        );
        const qtyStr = `${ing.amount} ${ing.unit}`.trim();
        if (existingIdx >= 0) {
          const item = updated[existingIdx];
          const sources = new Set(item.sourceRecipeNames);
          sources.add(recipe.name);
          updated[existingIdx] = {
            ...item,
            quantityStr: item.quantityStr ? `${item.quantityStr} + ${qtyStr}` : qtyStr,
            sourceRecipeNames: Array.from(sources)
          };
        } else {
          updated.push({
            id: 'ing-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            name: ing.name.trim(),
            quantityStr: qtyStr,
            completed: false,
            sourceRecipeNames: [recipe.name]
          });
        }
      });
      return updated;
    });
  };

  return {
    items,
    toggleItem,
    removeItem,
    clearCompleted,
    clearAll,
    addItem,
    generateFromRecipeIds,
    addRecipeIngredients
  };
}
