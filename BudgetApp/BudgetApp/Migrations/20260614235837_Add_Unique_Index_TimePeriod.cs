using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetApp.Migrations
{
    /// <inheritdoc />
    public partial class Add_Unique_Index_TimePeriod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TimePeriods_UserId",
                table: "TimePeriods");

            migrationBuilder.CreateIndex(
                name: "IX_TimePeriods_UserId_Month_Year",
                table: "TimePeriods",
                columns: new[] { "UserId", "Month", "Year" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TimePeriods_UserId_Month_Year",
                table: "TimePeriods");

            migrationBuilder.CreateIndex(
                name: "IX_TimePeriods_UserId",
                table: "TimePeriods",
                column: "UserId");
        }
    }
}
