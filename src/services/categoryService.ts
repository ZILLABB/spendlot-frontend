import { apiService } from './api';
import { API_ENDPOINTS } from '../constants';
import { Category, ApiResponse } from '../types';

interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number;
  is_income?: boolean;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number;
  is_income?: boolean;
  is_active?: boolean;
}

class CategoryService {
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return await apiService.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST);
  }

  async getCategoryTree(): Promise<ApiResponse<Category[]>> {
    return await apiService.get<Category[]>(API_ENDPOINTS.CATEGORIES.TREE);
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    const url = API_ENDPOINTS.CATEGORIES.LIST + `/${id}`;
    return await apiService.get<Category>(url);
  }

  async createCategory(data: CreateCategoryData): Promise<ApiResponse<Category>> {
    return await apiService.post<Category>(
      API_ENDPOINTS.CATEGORIES.CREATE,
      data
    );
  }

  async updateCategory(
    id: number,
    data: UpdateCategoryData
  ): Promise<ApiResponse<Category>> {
    const url = API_ENDPOINTS.CATEGORIES.UPDATE.replace(':id', id.toString());
    return await apiService.put<Category>(url, data);
  }

  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    const url = API_ENDPOINTS.CATEGORIES.DELETE.replace(':id', id.toString());
    return await apiService.delete<void>(url);
  }

  // Get categories by type (income/expense)
  async getCategoriesByType(isIncome: boolean): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories();
    if (response.success && response.data) {
      const filteredCategories = response.data.filter(
        category => category.is_income === isIncome
      );
      return {
        success: true,
        data: filteredCategories,
      };
    }
    return response;
  }

  // Get active categories only
  async getActiveCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories();
    if (response.success && response.data) {
      const activeCategories = response.data.filter(
        category => category.is_active
      );
      return {
        success: true,
        data: activeCategories,
      };
    }
    return response;
  }

  // Get parent categories (no parent_id)
  async getParentCategories(): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories();
    if (response.success && response.data) {
      const parentCategories = response.data.filter(
        category => !category.parent_id
      );
      return {
        success: true,
        data: parentCategories,
      };
    }
    return response;
  }

  // Get subcategories for a parent category
  async getSubcategories(parentId: number): Promise<ApiResponse<Category[]>> {
    const response = await this.getCategories();
    if (response.success && response.data) {
      const subcategories = response.data.filter(
        category => category.parent_id === parentId
      );
      return {
        success: true,
        data: subcategories,
      };
    }
    return response;
  }

  // Build hierarchical category tree
  buildCategoryTree(categories: Category[]): Category[] {
    const categoryMap = new Map<number, Category & { children?: Category[] }>();
    const rootCategories: (Category & { children?: Category[] })[] = [];

    // Create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build tree structure
    categories.forEach(category => {
      const categoryWithChildren = categoryMap.get(category.id)!;
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children!.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  }

  // Get default expense categories
  getDefaultExpenseCategories(): CreateCategoryData[] {
    return [
      {
        name: 'Food & Dining',
        description: 'Restaurants, cafes, and dining out',
        icon: '🍽️',
        color: '#0ea5e9',
        is_income: false,
      },
      {
        name: 'Groceries',
        description: 'Grocery shopping and food supplies',
        icon: '🛒',
        color: '#22c55e',
        is_income: false,
      },
      {
        name: 'Transportation',
        description: 'Gas, public transport, rideshare',
        icon: '🚗',
        color: '#f59e0b',
        is_income: false,
      },
      {
        name: 'Shopping',
        description: 'Retail purchases and online shopping',
        icon: '🛍️',
        color: '#ef4444',
        is_income: false,
      },
      {
        name: 'Entertainment',
        description: 'Movies, games, and leisure activities',
        icon: '🎬',
        color: '#8b5cf6',
        is_income: false,
      },
      {
        name: 'Healthcare',
        description: 'Medical expenses and health services',
        icon: '🏥',
        color: '#06b6d4',
        is_income: false,
      },
      {
        name: 'Utilities',
        description: 'Electricity, water, internet, phone',
        icon: '⚡',
        color: '#f97316',
        is_income: false,
      },
      {
        name: 'Other',
        description: 'Miscellaneous expenses',
        icon: '📝',
        color: '#6b7280',
        is_income: false,
      },
    ];
  }

  // Get default income categories
  getDefaultIncomeCategories(): CreateCategoryData[] {
    return [
      {
        name: 'Salary',
        description: 'Regular employment income',
        icon: '💼',
        color: '#10b981',
        is_income: true,
      },
      {
        name: 'Freelance',
        description: 'Freelance and contract work',
        icon: '💻',
        color: '#3b82f6',
        is_income: true,
      },
      {
        name: 'Investment',
        description: 'Investment returns and dividends',
        icon: '📈',
        color: '#8b5cf6',
        is_income: true,
      },
      {
        name: 'Other Income',
        description: 'Miscellaneous income sources',
        icon: '💰',
        color: '#f59e0b',
        is_income: true,
      },
    ];
  }

  // Initialize default categories for new users
  async initializeDefaultCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const expenseCategories = this.getDefaultExpenseCategories();
      const incomeCategories = this.getDefaultIncomeCategories();
      const allDefaultCategories = [...expenseCategories, ...incomeCategories];

      const createdCategories: Category[] = [];

      for (const categoryData of allDefaultCategories) {
        const response = await this.createCategory(categoryData);
        if (response.success && response.data) {
          createdCategories.push(response.data);
        }
      }

      return {
        success: true,
        data: createdCategories,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to initialize default categories',
      };
    }
  }
}

export const categoryService = new CategoryService();
export default CategoryService;
