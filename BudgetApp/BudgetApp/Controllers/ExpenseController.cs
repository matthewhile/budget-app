using BudgetApp.DTOs;
using BudgetApp.Models;
using BudgetApp.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace BudgetApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly ExpenseService _expenseService;

        private readonly BudgetService _budgetService;

        public ExpenseController(ExpenseService expenseService, BudgetService budgetService)
        {
            _expenseService = expenseService;
            _budgetService = budgetService;
        }

        [HttpGet("expenseId/{id}")]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            var expense = await _expenseService.GetExpenseByIdAsync(id);
            if (expense == null)
            {
                return NotFound();
            }
            return Ok(expense);
        }

        [HttpGet("budgetId/{id}")]
        public async Task<IActionResult> GetBudgetExpenses(int id)
        {
            var expenses = await _expenseService.GetBudgetExpensesAsync(id);
            if (expenses == null)
            {
                return NotFound();
            }
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> AddNewExpense(AddExpenseDTO dto)
        {
            if (dto == null) return BadRequest();
            var newExpense = await _expenseService.CreateExpenseAsync(dto);
            var updatedBudget = await _budgetService.GetBudgetByIdAsync((int)newExpense.BudgetId);
            return CreatedAtAction(nameof(GetExpenseById), new {id = newExpense.Id}, new {addedExpense = newExpense, updatedBudget});
        }
    }
}
