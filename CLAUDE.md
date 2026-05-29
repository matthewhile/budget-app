# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BudgetApp25 is a full-stack personal budgeting application. The backend is an ASP.NET Core 8 Web API and the frontend is a React 19 + Vite SPA.

- Backend: `BudgetApp/BudgetApp/`
- Frontend: `frontend/`

## Commands

### Backend
```powershell
cd BudgetApp/BudgetApp
dotnet run           # runs on http://localhost:5023 / https://localhost:7230
dotnet build
dotnet ef database update   # apply migrations
```

### Frontend
```powershell
cd frontend
npm run dev          # runs on http://localhost:5173
npm run build
npm run lint
```

## Architecture

### Backend (ASP.NET Core 8)

**Stack:** Entity Framework Core 8 + PostgreSQL, ASP.NET Identity with Bearer tokens.

**Layers:**
- `Controllers/` — thin HTTP layer; extracts `userId` from the auth token via `_userManager.GetUserId(User)` and passes it into services
- `Services/` — all business logic; every method accepts `userId` and filters data to that user
- `Data/BudgetAppDbContext.cs` — EF Core context extending `IdentityDbContext<User>`
- `Models/` — domain entities: `User` (extends IdentityUser), `Budget`, `Expense`, `Timeperiod`
- `DTOs/` — request/response contracts separate from domain models

**Auth:** `AddAuthentication().AddBearerToken()` + `app.MapIdentityApi<User>()`. All API routes require `[Authorize]`. CORS is configured to allow `localhost:5173` with credentials.

**Data rules:**
- All service queries filter by `userId` for isolation.
- Deleting a budget reassigns its expenses to the system "uncategorized" budget (the budget with `IsSystem = true`, currently `Id = 1`).
- `Budget.TimePeriodId` is currently hardcoded to `1` in `CreateBudgetAsync` — a known placeholder.

### Frontend (React 19 + Vite)

**State:** Two React contexts carry all shared state:
- `AuthContext` (`contexts/AuthContext.jsx`) — `login`, `logout`, `isAuthenticated`; token persisted in `localStorage`
- `BudgetsContext` (`contexts/BudgetContext.jsx`) — all budget/expense CRUD methods and cached data

**API client:** `api/axiosClient.js` — `baseURL: http://localhost:5023`, request interceptor reads the Bearer token from `localStorage` and adds it to every request automatically.

**Routing (`App.jsx`):**
- `/` — redirects to `/dashboard` if authenticated, else `/login`
- `/login` — redirects away if already authenticated
- `/dashboard` — protected; main budget management view

**Component pattern:** Feature modals (`AddBudgetModal`, `EditBudgetModal`, `ViewExpensesModal`, etc.) are opened from `Dashboard.jsx` and call context methods directly.

## Database

PostgreSQL on `localhost:5432`, database `BudgetApp`. Connection string is in `BudgetApp/BudgetApp/appsettings.json` (gitignored). A single EF migration (`20260524213845_Create_Database`) defines the full schema.
