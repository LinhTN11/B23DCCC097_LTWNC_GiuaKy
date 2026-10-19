import { create } from 'zustand';
import type { Category } from '../types/book';

export type CategoryFilter = 'Tất cả' | Category;

export interface FilterState {
  keyword: string;
  category: CategoryFilter;
  setKeyword: (keyword: string) => void;
  setCategory: (category: CategoryFilter) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  keyword: '',
  category: 'Tất cả',
  setKeyword: (keyword: string) => set({ keyword }),
  setCategory: (category: CategoryFilter) => set({ category }),
  resetFilters: () => set({ keyword: '', category: 'Tất cả' }),
}));
