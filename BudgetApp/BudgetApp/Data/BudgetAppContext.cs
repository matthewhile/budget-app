using BudgetApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Data;

public class BudgetAppContext : DbContext
{
    public BudgetAppContext(DbContextOptions<BudgetAppContext> options)
        : base(options)
    {
    }

    public DbSet<Budget> Budgets { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Timeperiod> TimePeriods { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Unique index on User.Email 
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}
