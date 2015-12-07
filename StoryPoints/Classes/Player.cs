using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StoryPoints.Classes
{
    public class Player
    {
        public string name { get; set; }
        public string id { get; set; }
        public string role { get; set; }
        public string cardId { get; set; }
        public string groupId { get; set; }
        public List<string> connections { get; set; }

        public Player()
        {
            this.connections = new List<string>();
        }
    }
}