using System;
using System.Collections.Generic;

namespace BudgetApp.Entities;

public partial class Expense
{
    public int Id { get; set; }

    public string? Description { get; set; }

    public decimal Amount { get; set; }

    public DateOnly Date { get; set; }

    public int? BudgetId { get; set; }

    public int UserId { get; set; }

    public virtual Budget? Budget { get; set; }

    public virtual User User { get; set; } = null!;
}
