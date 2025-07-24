namespace BudgetApp.DTOs
{
    public class UpdateBudgetDTO
    {

        // TODO: Address nullable budget name + forced to update both name and amount issue.
        public string Name { get; set; } 
        public decimal MaxAmount { get; set; }
    }
}
