using System;
using System.Collections.Generic;
using BudgetApp.Entities;
using Microsoft.EntityFrameworkCore;

namespace BudgetApp.Data;

public partial class BudgetAppDbContext : DbContext
{
    public BudgetAppDbContext()
    {
    }

    public BudgetAppDbContext(DbContextOptions<BudgetAppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Budget> Budgets { get; set; }

    public virtual DbSet<Expense> Expenses { get; set; }

    public virtual DbSet<TimePeriod> TimePeriods { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Budget>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Budgets__3214EC0776B0F438");

            entity.Property(e => e.MaxAmount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.TimePeriod).WithMany(p => p.Budgets)
                .HasForeignKey(d => d.TimePeriodId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Budgets__TimePer__3D5E1FD2");

            entity.HasOne(d => d.User).WithMany(p => p.Budgets)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Budgets__UserId__3E52440B");
        });

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Expenses__3214EC07360112DF");

            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.Budget).WithMany(p => p.Expenses)
                .HasForeignKey(d => d.BudgetId)
                .HasConstraintName("FK__Expenses__Budget__412EB0B6");

            entity.HasOne(d => d.User).WithMany(p => p.Expenses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Expenses__UserId__4222D4EF");
        });

        modelBuilder.Entity<TimePeriod>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TimePeri__3214EC0756D85E9D");

            entity.HasOne(d => d.User).WithMany(p => p.TimePeriods)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TimePerio__UserI__3A81B327");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC0785784325");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534CF7B4779").IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

