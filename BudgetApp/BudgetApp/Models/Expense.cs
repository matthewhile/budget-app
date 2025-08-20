using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BudgetApp.Models;

public class Expense
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Amount { get; set; }

    [Required]
    public int BudgetId { get; set; }

    [ForeignKey(nameof(BudgetId))]
    public virtual Budget Budget { get; set; } = null!;

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [Required]
    public DateOnly Date { get; set; }

    [MaxLength(255)]
    public string? Description { get; set; }
}
