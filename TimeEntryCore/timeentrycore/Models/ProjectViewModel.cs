using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimeEntryCore.Models
{
    public class ProjectViewModel
    {
        public string ProjectDescription { get; set; }
        public decimal SumTime { get; set; }
        public int SumDrivingTime { get; set; }

    }
}
