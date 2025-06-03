using System;
using System.Collections.Generic;

namespace BudgetApp.Data;

public partial class Budget
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal MaxAmount { get; set; }

    public int TimePeriodId { get; set; }

    public int UserId { get; set; }

    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public virtual TimePeriod TimePeriod { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
