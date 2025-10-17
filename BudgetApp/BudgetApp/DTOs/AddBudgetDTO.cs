namespace BudgetApp.DTOs
{
    public class AddBudgetDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal MaxAmount { get; set; }

        public int TimePeriodId { get; set; } = 1;

        public string UserId { get; set; } = string.Empty;
    }
}
