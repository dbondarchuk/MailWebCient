using System.Web;
using System.Web.Optimization;

namespace GmailWebClient
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/external/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/external/angular/angular*",
                        "~/Scripts/internal/app.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        "~/Scripts/external/bootstrap/bootstrap.*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/external/jquery-ui/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/external/jqueryval/jquery.unobtrusive*",
                        "~/Scripts/external/jqueryval/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/external/plugins/modernizr/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/email").Include(
                        "~/Scripts/internal/controllers/emailController.js",
                        "~/Scripts/internal/directives/*.js",
                        "~/Scripts/internal/filters/*.js",
                        "~/Scripts/internal/services/messageService.js",
                        "~/Scripts/external/plugins/handlebars/handlebars-*",
                        "~/Scripts/external/plugins/iscroll/iscroll*",
                        "~/Scripts/external/plugins/viewportchecker/jquery.viewportchecker.js",
                        "~/Scripts/internal/pages/main.js"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/Content/bootstrap.min.css", "~/Content/bootstrap-theme.min.css"));
            bundles.Add(new StyleBundle("~/Content/font-awesome").Include("~/Content/font-awesome.min.css"));
            bundles.Add(new StyleBundle("~/Content/login").Include("~/Content/login.css"));
            bundles.Add(new StyleBundle("~/Content/email").Include("~/Content/email.css"));
            bundles.Add(new StyleBundle("~/Content/pure").Include("~/Content/pure.min.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}