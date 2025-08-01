﻿using BudgetApp.Data;
using BudgetApp.DTOs;
using BudgetApp.Models;
using Microsoft.AspNetCore.Http.HttpResults;
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
                    TotalSpent = b.Expenses.Sum(e => e.Amount),
                    TimePeriodId = b.TimePeriodId,
                    UserId = b.UserId
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
                    TotalSpent = b.Expenses.Sum(e => e.Amount),
                    TimePeriodId = b.TimePeriodId,
                    UserId = b.UserId
                })
                .FirstOrDefaultAsync();
        }


        public async Task<BudgetDTO?> UpdateBudgetAsync(int id, UpdateBudgetDTO updateBudgetDto)
        {
            var budget = await _context.Budgets
                .Include(b => b.Expenses)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null) return null; 
            

            if (!string.IsNullOrEmpty(updateBudgetDto.Name))
            {
                budget.Name = updateBudgetDto.Name;
            }

            if (updateBudgetDto.MaxAmount.HasValue)
            {
                budget.MaxAmount = updateBudgetDto.MaxAmount.Value;
            }

            var totalSpent = budget.Expenses.Sum(e => e.Amount);


            await _context.SaveChangesAsync();

            return new BudgetDTO
            {
                Id = budget.Id,
                Name = budget.Name,
                MaxAmount = budget.MaxAmount,
                TotalSpent = totalSpent
                //TimePeriodId = budget.TimePeriodId,
                //UserId = budget.UserId
            };
        }

        public async Task<BudgetDTO> CreateBudgetAsync(AddBudgetDTO dto)
        {
            var budget = new Budget
            {
                Name = dto.Name,
                MaxAmount = dto.MaxAmount,
                TimePeriodId = 1,
                UserId = 1
            };

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            return new BudgetDTO
            {
                Id = budget.Id,
                Name = budget.Name,
                MaxAmount = budget.MaxAmount,
                TotalSpent = 0,
                TimePeriodId = budget.TimePeriodId,
                UserId = budget.UserId
            };
        }
    }
}
