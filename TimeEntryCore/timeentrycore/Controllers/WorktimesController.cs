using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using TimeEntryCore.Data;
using TimeEntryCore.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TimeEntryCore.Controllers
{
    [Authorize]
    public class WorktimesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public WorktimesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Worktimes
        public async Task<IActionResult> Index(string searchMonth)
        {
            //set current month as standard-filter
            if (string.IsNullOrEmpty(searchMonth))
                searchMonth = DateTime.Now.Month.ToString();
            
            ViewData["currentMonthFilter"] = searchMonth;
            List<ProjectViewModel> projectviewlist = new List<ProjectViewModel>();
            var worktime = from s in _context.Worktime
                           select s;

            worktime = worktime.Where(s => s.UserID == this.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (!String.IsNullOrEmpty(searchMonth))
            {
                if (searchMonth != "0")
                    worktime = worktime.Where(s => s.WorkDate.Month.ToString() == searchMonth);
            }


            foreach (var item in _context.Project.OrderBy(x => x.DescriptionShort))
            {
                ProjectViewModel projectview = new ProjectViewModel();
                projectview.ProjectDescription = item.DescriptionShort;
                projectview.SumTime = worktime.Where(x => x.ProjectID == item.ProjectID).Sum(x => x.TimeUsed);
                projectview.SumDrivingTime = worktime.Where(x => x.ProjectID == item.ProjectID).Sum(x => x.DrivingTime.GetValueOrDefault());
                projectviewlist.Add(projectview);
            }
            ViewBag.ProjectList = projectviewlist;

            return View(await worktime.Include(i => i.ProjectDetails).Include(i => i.ServiceDetails).OrderByDescending(x => x.WorkDate).ToListAsync());
        }

        // GET: Worktimes/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var worktime = await _context.Worktime
                .FirstOrDefaultAsync(m => m.WorktimeID == id);
            if (worktime == null)
            {
                return NotFound();
            }

            return View(worktime);
        }

        // GET: Worktimes/Create
        public IActionResult Create()
        {
            PopulateProjectDropDownList();
            PopulateServiceDropDownList();
            return View();
        }

        // POST: Worktimes/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("WorktimeID,EmplID,ProjectID,ServiceID,WorkDate,TimeUsed,DrivingTime,Lunch")] Worktime worktime)
        {
            if (ModelState.IsValid)
            {
                worktime.WorktimeID = Guid.NewGuid();
                worktime.UserID = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                _context.Add(worktime);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(worktime);
        }

        // GET: Worktimes/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var worktime = await _context.Worktime.FindAsync(id);
            if (worktime == null)
            {
                return NotFound();
            }
            PopulateProjectDropDownList(worktime.ProjectID);
            PopulateServiceDropDownList(worktime.ServiceID);
            return View(worktime);
        }

        // POST: Worktimes/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("WorktimeID,EmplID,ProjectID,ServiceID,WorkDate,TimeUsed,DrivingTime,Lunch")] Worktime worktime)
        {
            if (id != worktime.WorktimeID)
            {
                return NotFound();
            }
            worktime.UserID = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(worktime);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!WorktimeExists(worktime.WorktimeID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            PopulateProjectDropDownList(worktime.ProjectID);
            PopulateServiceDropDownList(worktime.ServiceID);
            return View(worktime);
        }

        // GET: Worktimes/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var worktime = await _context.Worktime
                .FirstOrDefaultAsync(m => m.WorktimeID == id);
            if (worktime == null)
            {
                return NotFound();
            }

            return View(worktime);
        }

        // POST: Worktimes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var worktime = await _context.Worktime.FindAsync(id);
            _context.Worktime.Remove(worktime);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool WorktimeExists(Guid id)
        {
            return _context.Worktime.Any(e => e.WorktimeID == id);
        }
        //custom code
        private void PopulateProjectDropDownList(object selectedProject = null)
        {
            var projectQuery = from d in _context.Project
                                   orderby d.DescriptionLong
                                   select d;
            ViewBag.ProjectID = new SelectList(projectQuery.AsNoTracking(), "ProjectID", "DescriptionLong", selectedProject);
        }

        private void PopulateServiceDropDownList(object selectedService = null)
        {
            var serviceQuery = from d in _context.Service
                               orderby d.ServiceDesc
                               select d;
            ViewBag.ServiceID = new SelectList(serviceQuery.AsNoTracking(), "ServiceID", "ServiceDesc", selectedService);
        }
    }
}
