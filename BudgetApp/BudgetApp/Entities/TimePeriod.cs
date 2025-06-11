using System;
using System.Collections.Generic;

namespace BudgetApp.Entities;

public partial class Timeperiod
{
    public int Id { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public int Userid { get; set; }

    public virtual ICollection<Budget> Budgets { get; set; } = new List<Budget>();

    public virtual User User { get; set; } = null!;
}
