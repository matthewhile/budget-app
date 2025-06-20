using BudgetApp.Data;
using BudgetApp.DTOs;
using BudgetApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Services
{
    public class BudgetService
    {
        private readonly BudgetAppContext _context;

        public BudgetService(BudgetAppContext context)
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
                    TotalSpent = b.Expenses.Sum(e => e.Amount)
                    //TimePeriodId = b.TimePeriodId,
                    //UserId = b.UserId
                })
                .ToListAsync();
        }

        public async Task<BudgetDTO?> GetBudgetByIdAsync(int id)
        {
            return await _context.Budgets
                .Where(b => b.Id == id)
                .Select(b => new BudgetDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    MaxAmount = b.MaxAmount,
                    //TimePeriodId = b.TimePeriodId,
                    //UserId = b.UserId
                })
                .FirstOrDefaultAsync();
        }
    }
}
