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

        public ExpenseController(ExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBudgetExpenses(int id)
        {
            var expenses = await _expenseService.GetBudgetExpensesAsync(id);
            if (expenses == null)
            {
                return NotFound();
            }
            return Ok(expenses);
        }
    }
}
