using BudgetApp.Data;
using BudgetApp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using BudgetApp.Models;
using BudgetApp.Extensions;



var builder = WebApplication.CreateBuilder(args);

// Add PostgreSQL db context 
builder.Services.AddDbContext<BudgetAppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("BudgetAppDB")));

builder.Services.AddScoped<BudgetService>();
builder.Services.AddScoped<ExpenseService>();

builder.Services.AddAuthorization();

//builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();



builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<BudgetAppDbContext>()
    .AddApiEndpoints();

builder.Services.AddControllersWithViews();

builder.Services.AddControllers();

// Configure CORS for React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.ApplyMigrations();
//}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.UseAuthentication();

app.UseCors("AllowFrontend");

app.MapIdentityApi<User>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
