using BudgetApp.Data;
using BudgetApp.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Services
{
    public class ExpenseService
    {
        private readonly BudgetAppContext _context;

        public ExpenseService(BudgetAppContext context)
        {
            _context = context;
        }
        
        public async Task<List<ExpenseDTO>> GetAllExpensesAsync()
        {
            return await _context.Expenses
                .Select(e => new ExpenseDTO
                {
                    Id = e.Id,
                    Description = e.Description,
                    Amount = e.Amount,
                    Date = e.Date,
                    BudgetId = e.BudgetId,
                    UserId = e.UserId
                })
                .ToListAsync();
        }
    }
}
