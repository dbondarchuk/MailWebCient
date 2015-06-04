using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using AE.Net.Mail;
using GmailWebClient.Models;
using GmailWebClient.Services.Abstract;
using GmailWebClient.Services.Models;
using MailMessage = AE.Net.Mail.MailMessage;

namespace GmailWebClient.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _settings = InitializeSettings();

        public IEnumerable<MailMessage> GetMessages(UserProfile user, Mailbox mailbox, int skip, int take)
        {
            using (var client = CreateClient(user))
            {
                client.SelectMailbox(mailbox.ToString().ToUpperInvariant());
                
                var endIndex = client.GetMessageCount() - 1 - skip;
                var startIndex = endIndex - take + 1;
                return client.GetMessages(startIndex, endIndex).Reverse().ToArray();
            }
        }

        public void DeleteMessage(UserProfile user, Mailbox mailbox, string uid)
        {
            using (var client = CreateClient(user))
            {
                client.SelectMailbox(mailbox.ToString().ToUpperInvariant());

                client.DeleteMessage(uid);
            }
        }

        public void SendMessage(UserProfile user, MailMessage message)
        {
            using(var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
                             {
                                 EnableSsl = _settings.SmtpSsl,
                                 Timeout = 10000,
                                 UseDefaultCredentials = false,
                                 DeliveryMethod = SmtpDeliveryMethod.Network,
                                 Credentials = new NetworkCredential(user.GmailAccount, user.GmailPassword)
                             })
            {
                message.From = new MailAddress(user.GmailAccount);

                var mail = (System.Net.Mail.MailMessage) message;
                client.Send(mail);
            }
            
        }

        public MailMessage GetMessage(UserProfile user, Mailbox mailbox, int uid, bool setSeen = true)
        {
            using (var client = CreateClient(user))
            {
                client.SelectMailbox(mailbox.ToString().ToUpperInvariant());

                return client.GetMessage(uid.ToString(), false);
            }
        }

        private ImapClient CreateClient(UserProfile user)
        {
            return new ImapClient(_settings.ImapServer, user.GmailAccount, user.GmailPassword, port: _settings.ImapPort, secure: true);
        }

        private static MailSettings InitializeSettings()
        {
            return new MailSettings
                       {
                           SmtpServer = ConfigurationManager.AppSettings["smtpServer"],
                           SmtpPort = int.Parse(ConfigurationManager.AppSettings["smtpPort"]),
                           SmtpSsl = bool.Parse(ConfigurationManager.AppSettings["smtpSSL"]),
                           ImapServer = ConfigurationManager.AppSettings["smtpServer"],
                           ImapPort = int.Parse(ConfigurationManager.AppSettings["imapPort"]),
                           ImapSsl = bool.Parse(ConfigurationManager.AppSettings["imapSSL"]),
                       };
        }
    }
}