using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TimeEntryCore.Models
{
    public class Employee
    {
        [Key]
        public Guid EmplID { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public DateTime EntryDate { get; set; }
        public DateTime LeaveDate { get; set; }
        public decimal EmplyomentPerc { get; set; }
        public int UserType { get; set; }
        public int Inactive { get; set; }
    }
}
