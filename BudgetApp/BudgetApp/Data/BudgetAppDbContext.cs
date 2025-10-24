using BudgetApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Data;

public class BudgetAppDbContext : IdentityDbContext<User>
{
    public BudgetAppDbContext(DbContextOptions<BudgetAppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Budget> Budgets { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Timeperiod> TimePeriods { get; set; }
}
