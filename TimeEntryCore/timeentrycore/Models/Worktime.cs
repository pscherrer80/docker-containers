using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace TimeEntryCore.Models
{
    public class Worktime
    {
        [Key]
        public Guid WorktimeID { get; set; }
        // Foreign Key
        //public Guid EmplID { get; set; }

        public string UserID { get; set; }

        [Display(Name = "Projekt")]
        public Guid ProjectID { get; set; }
        [Display(Name = "Aufgabe")]
        public Guid ServiceID { get; set; }

        [DisplayFormat(DataFormatString = "{0:dd.MM.yyyy}", ApplyFormatInEditMode = true)]
        //[DisplayFormat(DataFormatString = "{0:d}")]
        [Display(Name = "Datum")]
        [Required]
        public DateTime WorkDate { get; set; }

        [Display(Name = "Stunden")]
        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TimeUsed { get; set; }

        [Display(Name = "Fahrzeit in Min")]
        public int? DrivingTime { get; set; }

        [Display(Name = "Mittagszulage")]
        [Column("Lunch", TypeName = "Bit")]
        [DefaultValue(false)]
        public bool Lunch { get; set; }

        public Project ProjectDetails { get; set; }
        public Service ServiceDetails { get; set; }
    }
}
