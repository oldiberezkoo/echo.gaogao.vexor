"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface KnowledgeBaseSelectorProps {
  categories: Category[];
  onGenerate: (categoryId: string, productId: string) => void;
  isLoading?: boolean;
}

export function KnowledgeBaseSelector({
  categories,
  onGenerate,
  isLoading = false,
}: KnowledgeBaseSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const canGenerate = selectedCategory && selectedProduct;

  return (
    <div className="space-y-4">
      {/* Category Selector */}
      <div className="space-y-2">
        <label className="text-sm text-neutral-400">Категория</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProduct("");
          }}
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#3BCBFF] transition-colors"
        >
          <option value="">Выберите категорию...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Selector */}
      {selectedCategory && currentCategory && (
        <div className="space-y-2">
          <label className="text-sm text-neutral-400">Продукт</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-[#3BCBFF] transition-colors"
          >
            <option value="">Выберите продукт...</option>
            {currentCategory.products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Generate Button */}
      {canGenerate && (
        <button
          onClick={() => onGenerate(selectedCategory, selectedProduct)}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#3BCBFF] to-[#2CDB8E] text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Сгенерировать опрос с ИИ
            </>
          )}
        </button>
      )}
    </div>
  );
}
