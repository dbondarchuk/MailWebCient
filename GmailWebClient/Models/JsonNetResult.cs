using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace GmailWebClient.Models
{
    public class JsonNetResult : ActionResult
    {
        #region Constructors and Destructors

        public JsonNetResult(object data, Formatting formatting)
            : this(data)
        {
            Formatting = formatting;
        }

        public JsonNetResult(object data)
            : this()
        {
            Data = data;
        }

        public JsonNetResult()
        {
            Formatting = Formatting.None;
            SerializerSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
        }

        #endregion

        #region Public Properties

        public Encoding ContentEncoding { get; set; }

        public string ContentType { get; set; }

        public object Data { get; set; }

        public Formatting Formatting { get; set; }

        public JsonSerializerSettings SerializerSettings { get; set; }

        #endregion

        #region Public Methods and Operators

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = !string.IsNullOrEmpty(ContentType) ? ContentType : "application/json";
            if (ContentEncoding != null)
            {
                response.ContentEncoding = ContentEncoding;
            }

            if (Data == null)
            {
                return;
            }

            var writer = new JsonTextWriter(response.Output) { Formatting = Formatting };
            JsonSerializer serializer = JsonSerializer.Create(SerializerSettings);
            serializer.Serialize(writer, Data);
            writer.Flush();
        }

        #endregion
    }
}