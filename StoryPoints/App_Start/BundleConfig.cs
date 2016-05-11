using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace StoryPoints.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Scripts/jquery").Include(
                "~/Scripts/Lib/jquery/jquery-{version}.js",
                "~/Scripts/Lib/jquery/jquery.*",
                "~/Scripts/Lib/jquery/jquery-ui-{version}.js")
            );

            bundles.Add(new ScriptBundle("~/Scripts/knockout").Include(
                 "~/Scripts/Lib/knockout/knockout-{version}.js",
                 "~/Scripts/Lib/knockout/knockout-deferred-updates.js")
            );
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                  "~/scripts/jquery.unobtrusive.ajax*",
                  "~/scripts/jquery.validate.unobtrusive.bootstrap*"));
        }
    }
}