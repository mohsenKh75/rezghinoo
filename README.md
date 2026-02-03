# 💰 Finance Tracker

A beautiful and modern finance tracking application built with Next.js that helps you manage your budget and expenses across different categories. All data is stored locally in your browser using localStorage.

## ✨ Features

### Budget Management
- **Set Budget**: Click on any budget amount to set or update the budget for each category
- **Track Spending**: Add expenses with amounts and optional descriptions
- **Real-time Updates**: See your remaining budget update automatically as you add expenses
- **Visual Progress**: Color-coded progress bars show your spending progress
  - 🟢 Green: Under 80%
  - 🟡 Yellow: 80-100%
  - 🔴 Red: Over budget

### Categories
- **Default Categories**: Starts with three categories:
  - 🍕 Food
  - 🛒 Supermarket
  - 🚗 Transport
- **Add Custom Categories**: Create unlimited new categories for your specific needs
- **Delete Any Category**: Remove any category including default ones with the × button in the category header

### Expense Tracking
- **Add Expenses**: Enter amount and optional description for each expense
- **Expense History**: View all expenses in reverse chronological order (newest first)
- **Delete Expenses**: Remove individual expenses with a single click
- **Persian Date Format**: Dates displayed in Persian calendar format
- **Persian Number Format**: All amounts formatted with Persian/Iranian number separators

### Summary Dashboard
- **Total Budget**: See your combined budget across all categories
- **Total Spent**: Track total spending across all categories
- **Total Remaining**: Know exactly how much you have left

### Data Persistence
- **LocalStorage**: All data is automatically saved to your browser's localStorage
- **No Server Required**: Works completely offline
- **Instant Loading**: Your data loads immediately when you open the app
- **Privacy First**: Your financial data never leaves your device
- **Hard Reset**: Clear all data and start fresh with the hard reset button

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 How to Use

### Setting a Budget
1. Click on the budget amount in any category card
2. Enter the budget amount (in Toman)
3. Click "Set" or press Enter

### Adding an Expense
1. (Optional) Enter a description for the expense
2. Enter the amount in the "Amount" field
3. Click "Add" or press Enter
4. The budget will automatically update

### Adding a New Category
1. Click the "+ Add New Category" button
2. Enter the category name
3. Click "Add"
4. Set the budget and start adding expenses

### Deleting Items
- **Delete Expense**: 
  - Mobile: Tap the 🗑️ icon (always visible)
  - Desktop: Hover over an expense and click the 🗑️ icon
- **Delete Category**: Click the × button in the top-right corner of any category card
- **Hard Reset**: Click the "Hard Reset" button in the top-right corner of the page to clear all data
  1. Click the "🔄 Hard Reset" button
  2. Review the warning about what will be deleted
  3. Click "Yes, Delete Everything" to confirm
  4. All data will be cleared and the page will refresh

## 🎨 Design Philosophy

- **Minimal & Clean**: Simple, uncluttered interface focused on what matters
- **Elegant Typography**: Light font weights and generous spacing for easy reading
- **Subtle Interactions**: Smooth transitions and hover effects without overwhelming the user
- **Fully Responsive**: Optimized for mobile, tablet, and desktop with touch-friendly controls
- **Dark Mode Support**: Automatically adapts to your system's dark mode preference
- **Persian Support**: Full support for Persian numbers and dates
- **Accessible**: High contrast, clear hierarchy, and intuitive navigation

## 🛠️ Built With

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **LocalStorage API**: Browser-based data persistence

## 📱 Browser Compatibility

Works in all modern browsers that support localStorage:
- Chrome/Edge 4+
- Firefox 3.5+
- Safari 4+
- Opera 11.5+

## 🔒 Privacy

This app stores all data locally in your browser. No data is sent to any server. Your financial information stays completely private and secure on your device.

## 📝 License

This project is open source and available for personal and commercial use.
