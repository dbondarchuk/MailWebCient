namespace GmailWebClient.Services.Models
{
    public class MailSettings
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public bool SmtpSsl { get; set; }

        public string ImapServer { get; set; }
        public int ImapPort { get; set; }
        public bool ImapSsl { get; set; }
    }
}