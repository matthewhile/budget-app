using BudgetApp.Data;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace BudgetApp.Extensions
{
    public static class MigrationExtensions
    {
        public static void ApplyMigrations(this IApplicationBuilder app)
        {
            using IServiceScope scope = app.ApplicationServices.CreateScope();

            using BudgetAppDbContext context = scope.ServiceProvider.GetRequiredService<BudgetAppDbContext>();

            context.Database.Migrate();
        }
    }
}
