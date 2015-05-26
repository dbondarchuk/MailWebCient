using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GmailWebClient.Models
{
    public class MailMessageModel
    {
        [Required(ErrorMessage = "Subject is required")]
        [Display(Name = "Subject")]
        public string Subject { get; set; }

        [Required(ErrorMessage = "Field 'To' is required")]
        [RegularExpression(@"(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))+", ErrorMessage = "Please match correct email addresses separeted by ';'")]
        [Display(Name = "To")]
        public string To { get; set; }

        [RegularExpression(@"(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*", ErrorMessage = "Please match correct email addresses separeted by ';'")]
        [Display(Name = "Cc")]
        public string Cc { get; set; }

        [RegularExpression(@"(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*", ErrorMessage = "Please match correct email addresses separeted by ';'")]
        [Display(Name = "Bcc")]
        public string Bcc { get; set; }

        [Display(Name = "Attachments")]
        public IEnumerable<HttpPostedFileBase> Attachments { get; set; }

        [Display(Name = "Body")]
        public string Body { get; set; }
    }
}