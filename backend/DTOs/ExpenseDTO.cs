namespace BudgetApp.DTOs
{
    public class ExpenseDTO
    {
        public int Id { get; set; }

        public string? Description { get; set; }

        public decimal Amount { get; set; }

        public DateOnly Date { get; set; }

        public int? BudgetId { get; set; }

        public string UserId { get; set; } = string.Empty;
    }
}
