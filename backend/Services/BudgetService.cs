using BudgetApp.Data;
using BudgetApp.DTOs;
using BudgetApp.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Services
{
    public class BudgetService
    {
        private readonly BudgetAppDbContext _context;
        private readonly TimePeriodService _timePeriodService;

        public BudgetService(BudgetAppDbContext context, TimePeriodService timePeriodService)
        {
            _context = context;
            _timePeriodService = timePeriodService;
        }

        // Return all budgets for the given month/year period
        public async Task<BudgetListResponseDTO> GetAllBudgetsAsync(string userId, int month, int year)
        {
            try
            {
                var period = await _timePeriodService.GetOrCreatePeriodAsync(userId, month, year);

                var budgets = await _context.Budgets
                    .Where(b => b.UserId == userId && b.TimePeriodId == period.Id)
                    .Select(b => new BudgetDTO
                    {
                        Id = b.Id,
                        Name = b.Name,
                        MaxAmount = b.MaxAmount,
                        TotalSpent = b.Expenses.Sum(e => e.Amount),
                        TimePeriodId = b.TimePeriodId,
                        IsSystem = b.IsSystem,
                    })
                    .ToListAsync();

                return new BudgetListResponseDTO
                {
                    TimePeriod = period,
                    Budgets = budgets
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        // Return a specified budget and the expenses assigned to it
        public async Task<BudgetDTO> GetBudgetByIdAsync(int id, string userId)
        {
            try
            {
                var budget = await _context.Budgets
                    .Where(b => b.UserId == userId)
                    .Include(b => b.Expenses)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null) return null;

                return new BudgetDTO
                {
                    Id = budget.Id,
                    Name = budget.Name,
                    MaxAmount = budget.MaxAmount,
                    TimePeriodId = budget.TimePeriodId,
                    TotalSpent = budget.Expenses.Sum(e => e.Amount),
                    IsSystem = budget.IsSystem,
                    Expenses = budget.Expenses.Select(e => new ExpenseDTO
                    {
                        Id = e.Id,
                        Description = e.Description,
                        Amount = e.Amount,
                        Date = e.Date,
                        BudgetId = e.BudgetId
                    }).ToList()
                };

            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        // Create a new budget
        public async Task<BudgetDTO> CreateBudgetAsync(AddBudgetDTO dto, string userId)
        {
            try
            {
                var budget = new Budget
                {
                    Name = dto.Name,
                    MaxAmount = dto.MaxAmount,
                    TimePeriodId = dto.TimePeriodId,
                    UserId = userId
                };

                _context.Budgets.Add(budget);
                await _context.SaveChangesAsync();

                return new BudgetDTO
                {
                    Id = budget.Id,
                    Name = budget.Name,
                    MaxAmount = budget.MaxAmount,
                    TotalSpent = 0,
                    TimePeriodId = budget.TimePeriodId,
                    IsSystem = budget.IsSystem
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        // Update/edit a budget
        public async Task<BudgetDTO?> UpdateBudgetAsync(int id, UpdateBudgetDTO updateBudgetDto, string userId)
        {
            try
            {
                var budget = await _context.Budgets
                    .Where(b => b.UserId == userId)
                    .Include(b => b.Expenses)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null) return null;

                if (!string.IsNullOrEmpty(updateBudgetDto.Name))
                {
                    budget.Name = updateBudgetDto.Name;
                }

                if (updateBudgetDto.MaxAmount.HasValue)
                {
                    budget.MaxAmount = updateBudgetDto.MaxAmount.Value;
                }

                var totalSpent = budget.Expenses.Sum(e => e.Amount);

                await _context.SaveChangesAsync();

                return new BudgetDTO
                {
                    Id = budget.Id,
                    Name = budget.Name,
                    MaxAmount = budget.MaxAmount,
                    TotalSpent = totalSpent,
                    IsSystem = budget.IsSystem
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }

        // Delete a specified budget
        public async Task DeleteBudgetAsync(int id, string userId)
        {
            try
            {
                var budget = await _context.Budgets
                   .Where(b => b.UserId == userId)
                   .Include(b => b.Expenses)
                   .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null)
                    throw new KeyNotFoundException();

                var systemBudget = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.UserId == userId && b.IsSystem && b.TimePeriodId == budget.TimePeriodId);

                var expenses = budget.Expenses;
                foreach (var expense in expenses)
                {
                    expense.BudgetId = systemBudget!.Id;
                }

                _context.Budgets.Remove(budget);
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                throw;
            }
        }
    }
}
