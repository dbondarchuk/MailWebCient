using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;
using GmailWebClient.Models;
using GmailWebClient.Services;
using GmailWebClient.Services.Abstract;
using GmailWebClient.Services.Models;
using Attachment = AE.Net.Mail.Attachment;
using MailMessage = AE.Net.Mail.MailMessage;

namespace GmailWebClient.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IMailService _mailService = new MailService();

        private UserProfile _user;
        private UserProfile UserProfile
        {
            get
            {
                if (_user == null)
                {
                    var dataContext = new UsersContext();
                    _user = dataContext.UserProfiles.FirstOrDefault(x => x.UserName == User.Identity.Name);

                    if (_user == null)
                    {
                        throw new HttpException((int)HttpStatusCode.Unauthorized, "Unauthorized");
                    }
                }

                return _user;
            }
        } 

        public ActionResult Index()
        {
            ViewBag.UserAddress = UserProfile.GmailAccount;

            return View();
        }

        public JsonNetResult GetMessageList(Mailbox mailBox, int skip, int take)
        {
            var messages = _mailService.GetMessages(UserProfile, mailBox, skip, take);
            
            return new JsonNetResult(messages);
        }
        public JsonNetResult GetMessage(Mailbox mailBox, int uid)
        {
            var message = _mailService.GetMessage(UserProfile, mailBox, uid);
            
            return new JsonNetResult(message);
        }

        public ActionResult GetAttachment(Mailbox mailbox, int uid, int attachmentId)
        {
            var message = _mailService.GetMessage(UserProfile, mailbox, uid, false);

            if (attachmentId < 0 || attachmentId >=  message.Attachments.Count)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            var attachment = message.Attachments.ElementAt(attachmentId);

            return File(attachment.GetData(), attachment.ContentType, attachment.Filename);
        }

        public HttpStatusCodeResult DeleteMessage(int uid)
        {
            _mailService.DeleteMessage(UserProfile, uid.ToString());

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        public HttpStatusCodeResult SendMessage(MailMessageModel message)
        {
            var mailMessage = new MailMessage
                                  {
                                      Body = message.Body,
                                      Subject = message.Subject
                                  };

            foreach (var to in message.To.Split(';'))
            {
                var address = to.Trim();

                if (!string.IsNullOrWhiteSpace(address))
                {
                    mailMessage.To.Add(new MailAddress(address));                    
                }
            }

            if (!string.IsNullOrWhiteSpace(message.Cc))
            {
                foreach (var cc in message.Cc.Split(';'))
                {
                    var address = cc.Trim();

                    if (!string.IsNullOrWhiteSpace(address))
                    {
                        mailMessage.Cc.Add(new MailAddress(address));
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(message.Bcc))
            {
                foreach (var bcc in message.Bcc.Split(';'))
                {
                    var address = bcc.Trim();

                    if (!string.IsNullOrWhiteSpace(address))
                    {
                        mailMessage.Bcc.Add(new MailAddress(address));
                    }
                }
            }

            if (message.Attachments != null && message.Attachments.Any())
            {
                foreach (var attachment in message.Attachments)
                {
                    mailMessage.Attachments.Add(new Attachment(ReadFully(attachment.InputStream), attachment.ContentType,
                                                               attachment.FileName, true));
                }
            }

            _mailService.SendMessage(UserProfile, mailMessage);

            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        private static byte[] ReadFully(Stream input)
        {
            var buffer = new byte[16 * 1024];
            using (var ms = new MemoryStream())
            {
                int read;
                while ((read = input.Read(buffer, 0, buffer.Length)) > 0)
                {
                    ms.Write(buffer, 0, read);
                }
                return ms.ToArray();
            }
        }
    }
}
