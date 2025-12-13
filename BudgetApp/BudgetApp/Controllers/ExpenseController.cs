using BudgetApp.DTOs;
using BudgetApp.Models;
using BudgetApp.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<User> _userManager;

        public ExpenseController(ExpenseService expenseService, BudgetService budgetService, UserManager<User> userManager)
        {
            _expenseService = expenseService;
            _budgetService = budgetService;
            _userManager = userManager;
        }

        [HttpGet("expenseId/{id}")]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var expense = await _expenseService.GetExpenseByIdAsync(id, userId);
            if (expense == null) return NotFound();

            return Ok(expense);
        }

        [HttpPost]
        public async Task<IActionResult> AddNewExpense(AddExpenseDTO dto)
        {
            if (dto == null) return BadRequest();

            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var newExpense = await _expenseService.CreateExpenseAsync(dto, userId);
            var updatedBudget = await _budgetService.GetBudgetByIdAsync((int)newExpense.BudgetId, userId);

            return Ok(updatedBudget);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var expense = await _expenseService.GetExpenseByIdAsync(id, userId);
            await _expenseService.DeleteExpenseAsync(id, userId);

            var updatedBudget = await _budgetService.GetBudgetByIdAsync((int)expense.BudgetId, userId);
                
            return Ok(updatedBudget);
        }
    }
}
