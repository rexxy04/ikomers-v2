"use client";

import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import FilterChip from "./FilterChip";
import { FilterOptions } from "@/lib/products";
import { Star } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Partial<FilterOptions>) => void;
  currentFilters: Partial<FilterOptions>;
}

const CATEGORIES = ["Baju", "Celana", "Sepatu", "Aksesoris"];
const PRICE_PRESETS = [
  { label: "Rp 0 - 100k", min: 0, max: 100000 },
  { label: "Rp 101k - 200k", min: 101000, max: 200000 },
  { label: "Rp 201k - 400k", min: 201000, max: 400000 },
  { label: "Rp 401k - 500k", min: 401000, max: 500000 },
  { label: "Rp 500k +", min: 500001, max: 99999999 },
];
const SORTS = [
  { label: "Terbaru", value: "newest" },
  { label: "Harga Terendah", value: "price_low" },
  { label: "Harga Tertinggi", value: "price_high" },
];

// PASTIKAN ADA 'export default' DI SINI
export default function SearchFilterModal({ isOpen, onClose, onApply, currentFilters }: Props) {
  const [minPrice, setMinPrice] = useState<string>(currentFilters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState<string>(currentFilters.maxPrice?.toString() || "");
  const [selectedCat, setSelectedCat] = useState<string | undefined>(currentFilters.category);
  const [selectedSort, setSelectedSort] = useState<string | undefined>(currentFilters.sortBy);
  const [selectedRating, setSelectedRating] = useState<number | undefined>(currentFilters.rating);

  const handleApply = () => {
    onApply({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      category: selectedCat,
      sortBy: selectedSort as any,
      rating: selectedRating
    });
    onClose();
  };

  const handlePresetPrice = (min: number, max: number) => {
    setMinPrice(min.toString());
    setMaxPrice(max > 10000000 ? "" : max.toString());
  };

  return (
    <BottomSheet isOpen={isOpen} title="Filter" onClose={onClose}>
      <div className="space-y-6 pb-20">
        
        {/* 1. Range Harga Manual */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">Rentang Harga</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
               <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Rp</span>
               <input 
                 type="number" 
                 placeholder="Terendah"
                 className="w-full pl-8 pr-3 py-2 border rounded-xl text-sm focus:outline-yellow-400"
                 value={minPrice}
                 onChange={(e) => setMinPrice(e.target.value)}
               />
            </div>
            <span className="text-gray-300">-</span>
            <div className="relative flex-1">
               <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Rp</span>
               <input 
                 type="number" 
                 placeholder="Tertinggi"
                 className="w-full pl-8 pr-3 py-2 border rounded-xl text-sm focus:outline-yellow-400"
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(e.target.value)}
               />
            </div>
          </div>
        </div>

        {/* 2. Chip Harga Preset */}
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset, idx) => (
            <FilterChip 
              key={idx} 
              isActive={Number(minPrice) === preset.min && (preset.max > 10000000 ? !maxPrice : Number(maxPrice) === preset.max)}
              onClick={() => handlePresetPrice(preset.min, preset.max)}
            >
              {preset.label}
            </FilterChip>
          ))}
        </div>

        {/* 3. Kategori */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">Kategori</h4>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <FilterChip 
                key={cat} 
                isActive={selectedCat === cat}
                onClick={() => setSelectedCat(selectedCat === cat ? undefined : cat)}
              >
                {cat}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* 4. Urutkan */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">Urutkan</h4>
          <div className="flex flex-wrap gap-2">
            {SORTS.map((sort) => (
              <FilterChip 
                key={sort.value} 
                isActive={selectedSort === sort.value}
                onClick={() => setSelectedSort(sort.value)}
              >
                {sort.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* 5. Rating */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 mb-3">Rating</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FilterChip 
                key={star} 
                isActive={selectedRating === star}
                onClick={() => setSelectedRating(selectedRating === star ? undefined : star)}
              >
                <div className="flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> {star}
                </div>
              </FilterChip>
            ))}
          </div>
        </div>

      </div>

      {/* Button Konfirmasi */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 rounded-b-3xl">
        <Button fullWidth onClick={handleApply}>Konfirmasi</Button>
      </div>
    </BottomSheet>
  );
}