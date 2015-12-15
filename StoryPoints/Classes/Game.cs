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
        public Boolean cardsFlipped { get; set; }

        public Game()
        {
            this.players = new ConcurrentDictionary<string, Player>();
            cardsFlipped = false;
        }

        public void reset()
        {
            foreach(Player p in this.players.Values)
            {
                p.cardId = null;
            }
            cardsFlipped = false;
        }

        public bool hasModerator()
        {
            foreach (Player p in this.players.Values)
            {
                if (p.role.Equals("moderator"))
                {
                    return true;
                }
            }
            return false;
        }
    }
}