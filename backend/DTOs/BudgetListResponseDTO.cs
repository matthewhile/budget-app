namespace BudgetApp.DTOs
{
    public class BudgetListResponseDTO
    {
        public TimePeriodDTO TimePeriod { get; set; } = null!;
        public List<BudgetDTO> Budgets { get; set; } = new();
    }
}
