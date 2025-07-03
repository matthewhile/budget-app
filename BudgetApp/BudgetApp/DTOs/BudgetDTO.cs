using BudgetApp.Models;

namespace BudgetApp.DTOs
{
    public class BudgetDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal MaxAmount { get; set; }

        public int TimePeriodId { get; set; }

        public int UserId { get; set; }

        public decimal TotalSpent { get; set; }
    }
}
