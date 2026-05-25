using BudgetApp.Data;
using BudgetApp.Models;

namespace BudgetApp.Services
{
    public class UserInitializationService
    {
        private readonly BudgetAppDbContext _context;

        public UserInitializationService(BudgetAppDbContext context)
        {
            _context = context;
        }

        /* 
         * TODO: When a new user is registerd / created, automatically create an initial time period entry and uncategorized budget entry for the time period.
         * 1. Create TimePeriod
           2. Save TimePeriod
           3. Create Uncategorized budget
           4. Save Budget
         */

        //public async Task InitializeNewUserAsync(User user)
        //{

        //}

    }
}
