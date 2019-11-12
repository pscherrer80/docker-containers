using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TimeEntryCore.Models
{
    public class Project
    {
        [Key]
        public Guid ProjectID { get; set; }
        [Display(Name = "Kurzbezeichnung")]
        [Required]
        public string DescriptionShort { get; set; }
        [Display(Name = "Bezeichnung")]
        public string DescriptionLong { get; set; }
        [Display(Name = "Bemerkungen")]
        public string Remark { get; set; }
    }
}
