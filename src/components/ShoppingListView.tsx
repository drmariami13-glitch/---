import React, { useState } from 'react';
import {
  ShoppingBag,
  Check,
  Plus,
  Trash2,
  Copy,
  CheckCheck
} from 'lucide-react';
import { ShoppingItem } from '../types/recipe';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onAddItem: (name: string, quantity: string) => void;
  onShowToast: (message: string) => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleItem,
  onRemoveItem,
  onClearCompleted,
  onClearAll,
  onAddItem,
  onShowToast
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemQty.trim());
    setNewItemName('');
    setNewItemQty('');
    onShowToast('პროდუქტი დაემატა საყიდლების სიაში');
  };

  const handleCopyList = async () => {
    if (items.length === 0) return;
    const textLines = items.map((item) => {
      const mark = item.completed ? '[x]' : '[ ]';
      return `${mark} ${item.name} — ${item.quantityStr}`;
    });
    const fullText = `🛒 საყიდლების სია (ჩვენი მენიუ):\n\n${textLines.join('\n')}`;

    try {
      await navigator.clipboard.writeText(fullText);
      onShowToast('საყიდლების სია დაკოპირდა ბუფერში');
    } catch {
      onShowToast('სიის კოპირება ვერ მოხერხდა');
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const pendingCount = items.length - completedCount;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E7E2D9] dark:border-[#2F2C27]">
        <div>
          <span className="text-xs text-[#7C8B70] dark:text-[#8F9E84] font-medium tracking-wide block mb-1">
            ინგრედიენტების კალათა
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#222222] dark:text-[#ECE8E1]">
            საყიდლების სია
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6F6A62] dark:text-[#A09B90]">
            {items.length > 0 ? (
              <span>
                სულ {items.length} ინგრედიენტი ({pendingCount} შესაძენი, {completedCount} ნაყიდი)
              </span>
            ) : (
              <span>სია ამჟამად ცარიელია. დაამატეთ კერძებიდან ან ჩაწერეთ პირდაპირ.</span>
            )}
          </p>
        </div>

        {/* Global actions */}
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyList}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white dark:bg-[#201E1B] border border-[#E7E2D9] dark:border-[#2F2C27] text-[#222222] dark:text-[#ECE8E1] hover:bg-[#F8F6F1] dark:hover:bg-[#282622] rounded-md transition-colors shadow-2xs"
              title="სიის კოპირება"
            >
              <Copy className="w-3.5 h-3.5 text-[#7C8B70] dark:text-[#8F9E84]" />
              <span>კოპირება</span>
            </button>

            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs text-[#6F6A62] dark:text-[#A09B90] hover:text-[#222222] dark:hover:text-[#ECE8E1] rounded-md border border-[#E7E2D9] dark:border-[#2F2C27] bg-white dark:bg-[#201E1B] transition-colors"
                title="ნაყიდების წაშლა"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#7C8B70] dark:text-[#8F9E84]" />
                <span>ნაყიდების წაშლა ({completedCount})</span>
              </button>
            )}

            <button
              onClick={onClearAll}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs text-[#B87961] dark:text-[#C4856E] hover:underline rounded-md border border-[#E7E2D9] dark:border-[#2F2C27] bg-white dark:bg-[#201E1B] transition-colors"
              title="მთლიანი სიის წაშლა"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>გასუფთავება</span>
            </button>
          </div>
        )}
      </div>

      {/* Manual Input Form */}
      <form
        onSubmit={handleAdd}
        className="p-3 sm:p-4 bg-white dark:bg-[#201E1B] border border-[#E7E2D9] dark:border-[#2F2C27] rounded-lg flex flex-col sm:flex-row gap-2.5 shadow-2xs"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="პროდუქტის დასახელება (მაგ. ნიორი, ზეითუნის ზეთი)..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#282622] border border-[#E7E2D9] dark:border-[#38342D] text-[#222222] dark:text-[#ECE8E1] placeholder-[#A49F96] dark:placeholder-[#6E6A62] rounded-md focus:outline-none focus:border-[#7C8B70] dark:focus:border-[#8F9E84] focus:bg-white dark:focus:bg-[#201E1B]"
        />
        <input
          type="text"
          value={newItemQty}
          onChange={(e) => setNewItemQty(e.target.value)}
          placeholder="რაოდენობა (მაგ. 500 გ, 2 ც)"
          className="w-full sm:w-40 px-3 py-2 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#282622] border border-[#E7E2D9] dark:border-[#38342D] text-[#222222] dark:text-[#ECE8E1] placeholder-[#A49F96] dark:placeholder-[#6E6A62] rounded-md focus:outline-none focus:border-[#7C8B70] dark:focus:border-[#8F9E84] focus:bg-white dark:focus:bg-[#201E1B]"
        />
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className={`cursor-pointer px-4 py-2 text-xs sm:text-sm font-medium rounded-md flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
            newItemName.trim()
              ? 'bg-[#7C8B70] dark:bg-[#728268] text-white hover:bg-[#6C7B60] dark:hover:bg-[#637259]'
              : 'bg-[#E7E2D9] dark:bg-[#2A2722] text-[#A49F96] dark:text-[#645F56] cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>დამატება</span>
        </button>
      </form>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#201E1B] rounded-lg border border-[#E7E2D9] dark:border-[#2F2C27] p-8">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#C8C2B5] dark:text-[#4A453E] mb-3" />
          <h3 className="font-serif text-lg font-semibold text-[#222222] dark:text-[#ECE8E1]">
            საყიდლების სია ცარიელია
          </h3>
          <p className="mt-1.5 text-xs text-[#6F6A62] dark:text-[#A09B90] max-w-sm mx-auto">
            გადადით კვირის მენიუში ან ნებისმიერ რეცეპტში და დააჭირეთ „საყიდლებში დამატებას“, რათა ინგრედიენტები აქ ავტომატურად აისახოს.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#201E1B] rounded-lg border border-[#E7E2D9] dark:border-[#2F2C27] divide-y divide-[#F1ECE3] dark:divide-[#2A2722] overflow-hidden shadow-2xs">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                item.completed
                  ? 'bg-[#F9F7F3] dark:bg-[#1C1A17]'
                  : 'hover:bg-[#FAF8F5] dark:hover:bg-[#25231F]'
              }`}
            >
              <div
                onClick={() => onToggleItem(item.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    item.completed
                      ? 'bg-[#7C8B70] dark:bg-[#8F9E84] border-[#7C8B70] dark:border-[#8F9E84] text-white dark:text-[#161513]'
                      : 'border-[#C8C2B5] dark:border-[#4A453E] bg-white dark:bg-[#282622] hover:border-[#7C8B70]'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={`text-sm font-medium transition-all ${
                        item.completed
                          ? 'line-through text-[#8F8A80] dark:text-[#645F56]'
                          : 'text-[#222222] dark:text-[#ECE8E1]'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        item.completed
                          ? 'text-[#A49F96] dark:text-[#645F56]'
                          : 'text-[#6F6A62] dark:text-[#A09B90] font-semibold'
                      }`}
                    >
                      — {item.quantityStr}
                    </span>
                  </div>

                  {item.sourceRecipeNames && item.sourceRecipeNames.length > 0 && (
                    <span className="text-[11px] text-[#A49F96] dark:text-[#6E6A62] truncate block mt-0.5">
                      კერძი: {item.sourceRecipeNames.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onRemoveItem(item.id)}
                className="cursor-pointer text-[#C8C2B5] dark:text-[#4A453E] hover:text-[#B87961] dark:hover:text-[#C4856E] transition-colors p-1"
                title="წაშლა"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
