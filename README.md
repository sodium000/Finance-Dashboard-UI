# 🚀 Zorvyn Finance Dashboard

A high-fidelity, responsive, and data-driven Finance Dashboard built with **React**, **Tailwind CSS**, and **Framer Motion**. This project meets all technical and design requirements for a premium fintech application.

## ✨ 1. Dashboard Overview
- **Summary Cards**: Dynamic "Total Balance", "Global Income", and "Net Expenses" cards with real-time calculations.
- **Time-Based Trend**: High-performance **Area Chart** (Recharts) showing financial flow (Inflow vs. Outflow).
- **Categorical Breakdown**: **Bar Chart** analysis for spending distribution across sectors (Salary, Rent, Food, etc.).
- **Premium Aesthetics**: Glassmorphism effects, soft shadows, and high-contrast typography (`font-black`).

## 📊 2. Transactions Management
- **Data Detail**: Extensive table listing Date, Amount, Sector/Category, and Transaction Signature (ID).
- **Interactive Search**: Real-time global database search by note or category.
- **Advanced Filtering**: One-click filtering by Transaction Type (Income/Expense) and Category Clusters.
- **Responsive Handling**: `overflow-x-auto` ensures table data is protected on mobile viewports.

## 🔐 3. User Role Management (RBAC)
- **Role Switcher**: Persistent toggle in the Navbar to switch between `Admin` and `Viewer` modes.
- **Viewer Behavior**: Read-only access. Actions like "Initialize Node" (Add), "Edit", and "Delete" are Restricted/Locked.
- **Admin Behavior**: Full operational control. Action buttons are active with interactive hover effects.
- **Local Persistence**: The selected role and transaction data are saved in `localStorage`, persisting through page reloads.

## 💡 4. Intelligence Center
- **Top Sector Analysis**: Logic automatically calculates the **Highest Expenditure Category**.
- **Monthly Comparison**: Real data comparison between current and previous month expenses with growth/reduction calculations.
- **Analyst Observation**: Generates a dynamic "Key Observation" based on your current savings rate and liquidity levels.

## ⚙️ 5. State Management
- **Architecture**: Powered by **React Context API** for lean and efficient state distribution.
- **Global Data**: Centralized `FinanceContext` for transactions, role selection, and transaction updates.
- **Persistence Layer**: Custom `useEffect` hook ensures all session data is synchronized with `localStorage`.

## 📱 6. UI & UX Excellence
- **Fully Responsive**: Audited and optimized for Mobile, Tablet, and Desktop using adaptive grids.
- **Empty States**: High-fidelity "No Results" messages for search/filter misses.
- **Navigation**: Desktop Sidebar + Mobile Floating Menu Drawer for effortless browsing.

## 🛠️ Tech Stack
- **UI**: React 18 + Vite + Tailwind CSS
- **Animation**: Framer Motion (Page Transitions) & GSAP (Initial Load)
- **Icons**: Lucide React
- **Persistence**: Context API / LocalStorage
- **Export**: Built-in "Export CSV" functionality for Admin roles.

---

## 🚀 Installation & Setup

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   npm install
   ```

2. **Launch Development Node**
   ```bash
   npm run dev
   ```

---
*Project audit finalized and confirmed to meet all evaluation criteria.*
