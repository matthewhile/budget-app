using System;
using System.Collections.Generic;

namespace BudgetApp.Entities;

public partial class Budget
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Maxamount { get; set; }

    public int Timeperiodid { get; set; }

    public int Userid { get; set; }

    public virtual ICollection<Expense> Expenses { get; set; } = new List<Expense>();

    public virtual Timeperiod Timeperiod { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
