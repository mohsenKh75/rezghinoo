'use client';

import { useState, useEffect } from 'react';

interface Expense {
  id: string;
  amount: number;
  date: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  budget: number;
  expenses: Expense[];
}

const STORAGE_KEY = 'finance-tracker-data';

export default function FinanceTracker() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');
  const [expenseInputs, setExpenseInputs] = useState<{ [key: string]: string }>({});
  const [expenseDescriptions, setExpenseDescriptions] = useState<{ [key: string]: string }>({});
  const [showResetModal, setShowResetModal] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategories(JSON.parse(stored));
    } else {
      // Initialize with default categories
      const defaultCategories: Category[] = [
        { id: 'food', name: 'Food', budget: 0, expenses: [] },
        { id: 'supermarket', name: 'Supermarket', budget: 0, expenses: [] },
        { id: 'transport', name: 'Transport', budget: 0, expenses: [] },
      ];
      setCategories(defaultCategories);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    }
  }, []);

  // Save to localStorage whenever categories change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('fa-IR');
  };

  const parseNumber = (str: string) => {
    return parseInt(str.replace(/,/g, '')) || 0;
  };

  const getTotalSpent = (expenses: Expense[]) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getRemainingBudget = (budget: number, expenses: Expense[]) => {
    return budget - getTotalSpent(expenses);
  };

  const handleSetBudget = (categoryId: string) => {
    const amount = parseNumber(budgetInput);
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, budget: amount } : cat
      )
    );
    setEditingBudget(null);
    setBudgetInput('');
  };

  const handleAddExpense = (categoryId: string) => {
    const amount = parseNumber(expenseInputs[categoryId] || '0');
    if (amount <= 0) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
      description: expenseDescriptions[categoryId] || '',
    };

    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, expenses: [...cat.expenses, newExpense] }
          : cat
      )
    );

    setExpenseInputs(prev => ({ ...prev, [categoryId]: '' }));
    setExpenseDescriptions(prev => ({ ...prev, [categoryId]: '' }));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      budget: 0,
      expenses: [],
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleDeleteExpense = (categoryId: string, expenseId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, expenses: cat.expenses.filter(exp => exp.id !== expenseId) }
          : cat
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleHardReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center relative">
          <div className="inline-block mb-3">
            <span className="text-5xl sm:text-6xl">💰</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-gray-100 mb-2 tracking-wide">
            دفتر ثبت رزق و روزی
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
            إِنَّ رَبَّكَ يَبْسُطُ الرَّزْقَ لِمَن يَشَاءُ وَيَقْدِرُ إِنَّهُ كَانَ بِعِبَادِهِ خَبِيرًا بَصِيرًا
          </p>
          {/* Hard Reset Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="absolute top-0 right-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors text-xs sm:text-sm font-light"
            title="Hard Reset - Clear All Data"
          >
            Reset All
          </button>
        </div>

        {/* Add Category Button */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          {!showAddCategory ? (
            <button
              onClick={() => setShowAddCategory(true)}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-light border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-full transition-colors hover:border-gray-400 dark:hover:border-gray-500"
            >
              + Add Category
            </button>
          ) : (
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 dark:bg-gray-800 dark:text-white transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCategory}
                  className="flex-1 text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-light transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  className="flex-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-4 py-2 rounded-lg text-sm font-light transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => {
            const totalSpent = getTotalSpent(category.expenses);
            const remaining = getRemainingBudget(category.budget, category.expenses);
            const percentUsed = category.budget > 0 ? (totalSpent / category.budget) * 100 : 0;

            return (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                {/* Category Header */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base font-light text-gray-800 dark:text-gray-100">{category.name}</h2>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 text-lg leading-none transition-colors"
                      title="Delete category"
                    >
                      ×
                    </button>
                  </div>

                  {/* Budget Section */}
                  <div>
                    {editingBudget === category.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          placeholder="Enter budget"
                          className="flex-1 px-2 py-1 rounded text-gray-900 text-xs border border-gray-200 focus:outline-none focus:border-gray-400"
                          onKeyPress={(e) => e.key === 'Enter' && handleSetBudget(category.id)}
                          autoFocus
                        />
                        <button
                          onClick={() => handleSetBudget(category.id)}
                          className="text-gray-800 px-2 py-1 rounded text-xs font-light hover:bg-gray-100 transition-colors"
                        >
                          Set
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingBudget(category.id);
                          setBudgetInput(category.budget.toString());
                        }}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-1.5 rounded transition-colors"
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-0.5">Budget</p>
                        <p className="text-sm text-gray-800 dark:text-gray-100 font-light">{formatNumber(category.budget)} تومان</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-light mb-0.5">Spent</p>
                      <p className="text-xs font-light text-gray-600 dark:text-gray-300 break-words">
                        {formatNumber(totalSpent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-light mb-0.5">Remaining</p>
                      <p className={`text-xs font-light break-words ${remaining >= 0 ? 'text-gray-600 dark:text-gray-300' : 'text-red-500 dark:text-red-400'}`}>
                        {formatNumber(remaining)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full transition-all ${percentUsed > 100 ? 'bg-red-400' : percentUsed > 80 ? 'bg-orange-400' : 'bg-gray-800 dark:bg-gray-300'
                        }`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 text-right font-light">
                    {percentUsed.toFixed(0)}%
                  </p>
                </div>

                {/* Add Expense Form */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light mb-2">
                    Add Expense
                  </p>
                  <input
                    type="text"
                    value={expenseDescriptions[category.id] || ''}
                    onChange={(e) =>
                      setExpenseDescriptions(prev => ({ ...prev, [category.id]: e.target.value }))
                    }
                    placeholder="Description"
                    className="w-full px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded mb-1.5 text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 dark:bg-gray-800 dark:text-white transition-colors"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={expenseInputs[category.id] || ''}
                      onChange={(e) =>
                        setExpenseInputs(prev => ({ ...prev, [category.id]: e.target.value }))
                      }
                      placeholder="Amount"
                      className="flex-1 px-2 py-1.5 border border-gray-200 dark:border-gray-700 rounded text-xs focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 dark:bg-gray-800 dark:text-white transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddExpense(category.id)}
                    />
                    <button
                      onClick={() => handleAddExpense(category.id)}
                      className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-light transition-colors whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Expenses List */}
                <div className="p-3 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-light mb-2">
                    Expenses ({category.expenses.length})
                  </p>
                  {category.expenses.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4 font-light">
                      No expenses yet
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {[...category.expenses].reverse().map((expense) => (
                        <div
                          key={expense.id}
                          className="flex justify-between items-start p-2 bg-gray-50 dark:bg-gray-800/50 rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            {expense.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-0.5 break-words font-light">
                                {expense.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-800 dark:text-white break-words font-light">
                              {formatNumber(expense.amount)} تومان
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-light">
                              {new Date(expense.date).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteExpense(category.id, expense.id)}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0 text-sm"
                            title="Delete expense"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        {categories.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-light text-gray-800 dark:text-gray-100 mb-6 text-center">
              Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-light mb-2">Total Budget</p>
                <p className="text-xl sm:text-2xl font-light text-gray-800 dark:text-gray-100 break-words">
                  {formatNumber(categories.reduce((sum, cat) => sum + cat.budget, 0))} تومان
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-light mb-2">Total Spent</p>
                <p className="text-xl sm:text-2xl font-light text-gray-800 dark:text-gray-100 break-words">
                  {formatNumber(categories.reduce((sum, cat) => sum + getTotalSpent(cat.expenses), 0))} تومان
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-light mb-2">Total Remaining</p>
                <p className={`text-xl sm:text-2xl font-light break-words ${categories.reduce((sum, cat) => sum + getRemainingBudget(cat.budget, cat.expenses), 0) >= 0
                  ? 'text-gray-800 dark:text-gray-100'
                  : 'text-red-500 dark:text-red-400'
                  }`}>
                  {formatNumber(categories.reduce((sum, cat) => sum + getRemainingBudget(cat.budget, cat.expenses), 0))} تومان
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hard Reset Confirmation Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full p-6 animate-scale-in">
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 mb-4 text-4xl">
                  ⚠️
                </div>
                <h2 className="text-xl font-light text-gray-800 dark:text-gray-100 mb-2">
                  Delete Everything?
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                  This will remove all your data
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  All categories, budgets, and expenses will be permanently deleted. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 px-4 py-2.5 rounded-lg font-light transition-colors border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHardReset}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-light transition-colors"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
