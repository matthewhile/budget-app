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
        private readonly BudgetService _budgeService;
        private readonly UserManager<User> _userManager;

        public BudgetController(BudgetService budgeService, UserManager<User> userManager)
        {
            _budgeService = budgeService;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBudgets()
        {
            var userId = _userManager.GetUserId(User);
            var budgets = await _budgeService.GetAllBudgetsAsync(userId);
            return Ok(budgets);
        }

        [HttpGet("budgetId/{id}")]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            var userId = _userManager.GetUserId(User);
            var budget = await _budgeService.GetBudgetByIdAsync(id, userId);
            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        [HttpPost]
        public async Task<IActionResult> AddBudget([FromBody] AddBudgetDTO dto)
        {
            if (dto == null) return BadRequest();
            var userId = _userManager.GetUserId(User);
            var newBudget = await _budgeService.CreateBudgetAsync(dto, userId);
            return CreatedAtAction(nameof(GetBudgetById), new { id = newBudget.Id }, newBudget);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, UpdateBudgetDTO dto)
        {
            if (dto == null) return BadRequest();
            var userId = _userManager.GetUserId(User);
            var updatedBudget = await _budgeService.UpdateBudgetAsync(id, dto, userId);
            return Ok(updatedBudget);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            try
            {
                var userId = _userManager.GetUserId(User);
                await _budgeService.DeleteBudgetAsync(id, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
