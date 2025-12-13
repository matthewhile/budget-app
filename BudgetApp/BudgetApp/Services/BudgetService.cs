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

        public BudgetService(BudgetAppDbContext context)
        {
            _context = context;
        }

        // Return all budgets
        public async Task<List<BudgetDTO>> GetAllBudgetsAsync(string userId)
        {
            try 
            {
                return await _context.Budgets
                .Where(b => b.UserId == userId)
                .Select(b => new BudgetDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    MaxAmount = b.MaxAmount,
                    TotalSpent = b.Expenses.Sum(e => e.Amount),
                    TimePeriodId = b.TimePeriodId,
                })
                .ToListAsync();
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
                    TimePeriodId = 1,
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
                    TimePeriodId = budget.TimePeriodId
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
                    TotalSpent = totalSpent
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

                var expenses = budget.Expenses;
                foreach (var expense in expenses)
                {
                    expense.BudgetId = 1;
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
