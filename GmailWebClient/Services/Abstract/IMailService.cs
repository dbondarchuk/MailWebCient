using System.Collections.Generic;
using AE.Net.Mail;
using GmailWebClient.Models;
using GmailWebClient.Services.Models;

namespace GmailWebClient.Services.Abstract
{
    public interface IMailService
    {
        IEnumerable<MailMessage> GetMessages(UserProfile user, Mailbox mailbox, int skip, int take);

        void DeleteMessage(UserProfile user, Mailbox mailbox, string uid);

        void SendMessage(UserProfile user, MailMessage message);

        MailMessage GetMessage(UserProfile user, Mailbox mailbox, int uid, bool setSeen = true);
    }
}