namespace BudgetApp.DTOs
{
    public class AddExpenseDTO
    {
        public int Id { get; set; }

        public string? Description { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public DateOnly Date { get; set; }

        public int BudgetId { get; set; }
    }
}
