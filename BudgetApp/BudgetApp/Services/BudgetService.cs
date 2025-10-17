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

        public async Task<List<BudgetDTO>> GetAllBudgetsAsync()
        {
            return await _context.Budgets
                .Select(b => new BudgetDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    MaxAmount = b.MaxAmount,
                    TotalSpent = b.Expenses.Sum(e => e.Amount),
                    TimePeriodId = b.TimePeriodId,
                    UserId = b.UserId
                })
                .ToListAsync();
        }

        public async Task<BudgetDTO> GetBudgetByIdAsync(int id)
        {
            var budget = await _context.Budgets
                .Include(b => b.Expenses)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null) return null;

            return new BudgetDTO
            {
                Id = budget.Id,
                Name = budget.Name,
                MaxAmount = budget.MaxAmount,
                TimePeriodId = budget.TimePeriodId,
                UserId = budget.UserId,
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

        public async Task DeleteBudgetAsync(int id)
        {
            var budget = await _context.Budgets
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


        public async Task<BudgetDTO> CreateBudgetAsync(AddBudgetDTO dto)
        {
            var budget = new Budget
            {
                Name = dto.Name,
                MaxAmount = dto.MaxAmount,
                TimePeriodId = 1,
                UserId = dto.UserId
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
                UserId = budget.UserId
            };
        }


        public async Task<BudgetDTO?> UpdateBudgetAsync(int id, UpdateBudgetDTO updateBudgetDto)
        {
            var budget = await _context.Budgets
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

        
    }
}
