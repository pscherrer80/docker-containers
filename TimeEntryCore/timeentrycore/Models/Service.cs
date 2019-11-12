using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TimeEntryCore.Models
{
    public class Service
    {
        [Key]
        public Guid ServiceID { get; set; }
        [Display(Name = "Beschreibung")]
        [Required]
        public string ServiceDesc { get; set; }
        [Display(Name = "Einheit")]
        [Required]
        public string UnitType { get; set; }
        [Display(Name = "Absenz")]
        [Required]
        public string AbsenceType { get; set; }
    }
}
