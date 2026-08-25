using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetApp.Migrations
{
    /// <inheritdoc />
    public partial class Add_DefaultBudget_UserId_Name_Unique_Index : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DefaultBudgets_UserId",
                table: "DefaultBudgets");

            migrationBuilder.CreateIndex(
                name: "IX_DefaultBudgets_UserId_Name",
                table: "DefaultBudgets",
                columns: new[] { "UserId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DefaultBudgets_UserId_Name",
                table: "DefaultBudgets");

            migrationBuilder.CreateIndex(
                name: "IX_DefaultBudgets_UserId",
                table: "DefaultBudgets",
                column: "UserId");
        }
    }
}
