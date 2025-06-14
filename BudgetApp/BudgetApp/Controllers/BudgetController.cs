using Microsoft.AspNetCore.Mvc;

namespace BudgetApp.Controllers
{
    public class BudgetController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
