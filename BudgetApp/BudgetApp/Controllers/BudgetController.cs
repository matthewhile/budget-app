using BudgetApp.DTOs;
using BudgetApp.Models;
using BudgetApp.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly BudgetService _budgetService;
        private readonly UserManager<User> _userManager;

        public BudgetController(BudgetService budgetService, UserManager<User> userManager)
        {
            _budgetService = budgetService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBudgets()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var budgets = await _budgetService.GetAllBudgetsAsync(userId);
            if (budgets == null) return NotFound();

            return Ok(budgets);
        }

        [HttpGet("budgetId/{id}")]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var budget = await _budgetService.GetBudgetByIdAsync(id, userId);
            if (budget == null) return NotFound();

            return Ok(budget);
        }

        [HttpGet("budgetIdExpenses/{id}")]
        public async Task<IActionResult> GetBudgetExpenses(int id)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var budget = await _budgetService.GetBudgetByIdAsync(id, userId);
            if (budget == null) return NotFound();

            return Ok(budget.Expenses);
        }

        [HttpPost]
        public async Task<IActionResult> AddBudget([FromBody] AddBudgetDTO dto)
        {
            if (dto == null) return BadRequest();

            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var newBudget = await _budgetService.CreateBudgetAsync(dto, userId);
            return CreatedAtAction(nameof(GetBudgetById), new { id = newBudget.Id }, newBudget);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, UpdateBudgetDTO dto)
        {
            if (dto == null) return BadRequest();

            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var updatedBudget = await _budgetService.UpdateBudgetAsync(id, dto, userId);
            return Ok(updatedBudget);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            await _budgetService.DeleteBudgetAsync(id, userId);
            return Ok();
        }
    }
}
