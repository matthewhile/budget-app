using BudgetApp.DTOs;
using BudgetApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace BudgetApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly BudgetService _budgeService;

        public BudgetController(BudgetService budgeService)
        {
            _budgeService = budgeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBudgets()
        {
            var budgets = await _budgeService.GetAllBudgetsAsync();
            return Ok(budgets);
        }

        [HttpGet("budgetId/{id}")]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            var budget = await _budgeService.GetBudgetByIdAsync(id);
            if (budget == null)
                return NotFound();

            return Ok(budget);
        }

        [HttpPost]
        public async Task<IActionResult> AddBudget([FromBody] AddBudgetDTO dto)
        {
            if (dto == null) return BadRequest();
            var newBudget = await _budgeService.CreateBudgetAsync(dto);
            return CreatedAtAction(nameof(GetBudgetById), new { id = newBudget.Id }, newBudget);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, UpdateBudgetDTO dto)
        {
            if (dto == null) return BadRequest();
            var updatedBudget = await _budgeService.UpdateBudgetAsync(id, dto);
            return Ok(updatedBudget);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            try
            {
                await _budgeService.DeleteBudgetAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
