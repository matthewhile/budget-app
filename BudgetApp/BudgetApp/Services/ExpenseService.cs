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

        // Select a specific expense by ID
        public async Task<ExpenseDTO?> GetExpenseByIdAsync(int id)
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
                    UserId = e.UserId
                })
                .FirstOrDefaultAsync();
        }

        // Delete an expense
        public async Task DeleteExpenseAsync(int id)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);

            if (expense == null)
                throw new KeyNotFoundException();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
        }

        // Create a new expense
        public async Task<ExpenseDTO> CreateExpenseAsync(AddExpenseDTO dto)
        {
            var expense = new Expense
            {
                Description = dto.Description,
                Amount = dto.Amount,
                Date = dto.Date,
                BudgetId = dto.BudgetId,
                UserId = dto.UserId
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();

            return new ExpenseDTO
            {
                Id = expense.Id,
                Description= expense.Description,
                Amount = expense.Amount,
                Date = expense.Date,
                BudgetId = expense.BudgetId,
                UserId = expense.UserId
            };
        }
    }
}
