using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Concurrent;


namespace StoryPoints.Classes
{
    public class Game
    {
        public ConcurrentDictionary<string, Player> players { get; set; }
        public string gameId { get; set; }
        public Integration integration { get; set; }

        public Game()
        {
            this.players = new ConcurrentDictionary<string, Player>();
        }
    }
}