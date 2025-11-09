using BudgetApp.Data;
using BudgetApp.DTOs;
using BudgetApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Services
{
    public class ExpenseService
    {
        private readonly BudgetAppDbContext _context;

        public ExpenseService(BudgetAppDbContext context)
        {
            _context = context;
        }
        
        // Return all expenses
        public async Task<List<ExpenseDTO>> GetAllExpensesAsync(string userId)
        {
            return await _context.Expenses
                .Select(e => new ExpenseDTO
                {
                    Id = e.Id,
                    Description = e.Description,
                    Amount = e.Amount,
                    Date = e.Date,
                    BudgetId = e.BudgetId,
                    UserId = userId
                })
                .ToListAsync();
        }

        // Select a specific expense by ID
        public async Task<ExpenseDTO?> GetExpenseByIdAsync(int id, string userId)
        {
            return await _context.Expenses
                .Where(e => e.Id == id)
                .Select(e => new ExpenseDTO
                {
                    Id = e.Id,
                    Description = e.Description,
                    Amount = e.Amount,
                    Date = e.Date,
                    BudgetId = e.BudgetId,
                    UserId = userId
                })
                .FirstOrDefaultAsync();
        }

        // Delete an expense
        public async Task DeleteExpenseAsync(int id, string userId)
        {
            var expense = await _context.Expenses
                .Where(e => e.UserId == userId)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (expense == null)
                throw new KeyNotFoundException();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }

        // Create a new expense
        public async Task<ExpenseDTO> CreateExpenseAsync(AddExpenseDTO dto, string userId)
        {
            var expense = new Expense
            {
                Description = dto.Description,
                Amount = dto.Amount,
                Date = dto.Date,
                BudgetId = dto.BudgetId,
                UserId = userId
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return new ExpenseDTO
            {
                Id = expense.Id,
                Description= expense.Description,
                Amount = expense.Amount,
                Date = expense.Date,
                BudgetId = expense.BudgetId
            };
        }
    }
}
