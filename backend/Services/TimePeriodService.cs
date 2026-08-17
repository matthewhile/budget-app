using BudgetApp.Data;
using BudgetApp.DTOs;
using BudgetApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Services
{
    public class TimePeriodService
    {
        private readonly BudgetAppDbContext _context;

        public TimePeriodService(BudgetAppDbContext context)
        {
            _context = context;
        }

        public async Task<TimePeriodDTO> GetOrCreatePeriodAsync(string userId, int month, int year)
        {
            try
            {
                var period = await _context.TimePeriods
                    .FirstOrDefaultAsync(tp => tp.UserId == userId && tp.Month == month && tp.Year == year);

                if (period == null)
                {
                    period = new Timeperiod
                    {
                        UserId = userId,
                        Month = month,
                        Year = year
                    };

                    _context.TimePeriods.Add(period);
                    await _context.SaveChangesAsync();

                    var systemBudget = new Budget
                    {
                        Name = "Uncategorized",
                        MaxAmount = 0,
                        IsSystem = true,
                        TimePeriodId = period.Id,
                        UserId = userId
                    };

                    _context.Budgets.Add(systemBudget);
                    await _context.SaveChangesAsync();
                }

                return new TimePeriodDTO
                {
                    Id = period.Id,
                    Month = period.Month,
                    Year = period.Year
                };
            }
            catch (Exception e) 
            {
                Console.WriteLine(e.Message);
                throw;

            }
        }
    }
}
