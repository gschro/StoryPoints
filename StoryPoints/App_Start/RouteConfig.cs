using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace StoryPoints
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.Add(new CustomSiteRoutes());
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
    public class CustomSiteRoutes : RouteBase
    {

        public override RouteData GetRouteData(HttpContextBase httpContext)
        {
            var routeHandler = new MvcRouteHandler();
            var currentRoute = new Route("{controller}/{action}", routeHandler);
            var routeData = new RouteData(currentRoute, routeHandler);

            string url = httpContext.Request.Url.AbsolutePath;
            if (url.Equals("/"))
            {
                routeData.Values["controller"] = "Site";
                routeData.Values.Add("action", "Index");

                // return the route, or null to have it passed to the next routing engine in the list
                return routeData;
            }
            else if (url.Equals("/Error"))
            {
                routeData.Values["controller"] = "Site";
                routeData.Values.Add("action", "Error");

                return routeData;

            }
            else if (url.Count(f => f == '/') == 1)
            {
                routeData.Values["controller"] = "Site";
                routeData.Values.Add("action", "Game");

                return routeData;

            }

            return null;
        }

        public override VirtualPathData GetVirtualPath(RequestContext requestContext, RouteValueDictionary values)
        {
            //implement this to return url's for routes, or null to just pass it on
            return null;
        }
    }
}
