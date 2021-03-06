﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using StoryPoints.Classes;
using System.Collections.Concurrent;

namespace StoryPoints.Hubs
{
    public class GameHub : Hub
    {
        public static ConcurrentDictionary<string, Game> games;
        public static ConcurrentDictionary<string, PlayerConnection> connections;
        public static ConcurrentDictionary<string, Player> disconPlayers;
        public static ConcurrentDictionary<string, DateTime> timeouts;

        public void NewConnection(string url)
        {
            //Add player to list of all connections
            PlayerConnection pc = new PlayerConnection();
            pc.pcid = Context.ConnectionId;///unique id that matches player id
            pc.groupId = url;
            
            if(connections == null)
            {
                connections = new ConcurrentDictionary<string, PlayerConnection>();
            }
            //Add new connection to list of all connections
            connections.TryAdd(Context.ConnectionId, pc);

            //create the game if it doesn't exist for the url
            tryAddGame(url);

            //Add connection to the Group
            Groups.Add(Context.ConnectionId, url);
            
            Player player = null;
            //if player exits in the game with a different connection
            if (games[pc.groupId].players.ContainsKey(pc.pcid)) {
                //add the new connection to the player
                games[pc.groupId].players[pc.pcid].connections.Add(Context.ConnectionId);
                player = games[pc.groupId].players[pc.pcid];
            }
            else
            {
                //Create a new player
                player = new Player();
                player.connections.Add(Context.ConnectionId);
                player.groupId = url;
                player.id = Context.ConnectionId;

                //Add the player to the game
                games[pc.groupId].players.TryAdd(pc.pcid, player);
                Clients.Client(Context.ConnectionId).getName();
            }
           
            //if new connection is the only player in the game
            if(games[pc.groupId].players.Count == 1 || !games[pc.groupId].hasModerator())
            {
                //make the player the moderator
                games[pc.groupId].players[pc.pcid].role = "moderator";
                Clients.Client(Context.ConnectionId).isModerator(games[pc.groupId].cardsFlipped);
            }
            else
            {
                //make the player a participant
                games[pc.groupId].players[pc.pcid].role = "player";
                Clients.Client(Context.ConnectionId).isPlayer(games[pc.groupId].cardsFlipped);
            }

        }

        //public override System.Threading.Tasks.Task OnReconnected()
        //{
        //    Clients.Client(Context.ConnectionId).reconnect();
        //    return base.OnReconnected();
        //}

        public void Test(string url)
        {
            Clients.Client(Context.ConnectionId).reconnect(url);
        }

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            if (connections != null && connections.ContainsKey(Context.ConnectionId)) { 
                PlayerConnection pc = connections[Context.ConnectionId];
                //disconnect player
                if (games != null && games.ContainsKey(pc.groupId)) { 
                    Player p = games[pc.groupId].players[pc.pcid];

                    if (!stopCalled)
                    {
                        //store player for possible reconnect
                        //  disconPlayers.TryAdd(Context.ConnectionId, p);
                        //set time out to look for reconnection
                        //timeouts.TryAdd(Context.ConnectionId, new DateTime());
                    }

                    PlayerConnection garbage;
                    Player trash;
                    //Remove player connection for the player
                    connections.TryRemove(Context.ConnectionId, out garbage);

                    if (p.connections.Count == 1)
                    {
                        //remove player
                        games[pc.groupId].players.TryRemove(pc.pcid, out trash);
                    }
                    else
                    {
                        //remove disconnected connection
                        games[pc.groupId].players[pc.pcid].connections.Remove(Context.ConnectionId);
                    }

                    //if no more players in game remove game
                    if (games[pc.groupId].players.Count == 0)
                    {
                        Game garbageGame;
                        games.TryRemove(pc.groupId, out garbageGame);
                    }
                    else
                    {   //Hand off moderation if moderator left
                        if (p.role.Equals("moderator"))
                        {
                            foreach(Player pl in games[pc.groupId].players.Values)
                            {
                                if (!pl.id.Equals(p.id))
                                {
                                    games[pc.groupId].players[pl.id].role = "moderator";
                                    break;
                                }
                            }
                        }
                    }
                    if (games.ContainsKey(pc.groupId)) { 
                        Clients.Group(pc.groupId).showPlayers(games[pc.groupId].players);
                    }
                }
            }

            return base.OnDisconnected(stopCalled);
        }

        public void SetName(string name)
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            games[pc.groupId].players[pc.pcid].name = name;
            //send name to all clients
            Clients.Group(pc.groupId).showPlayers(games[pc.groupId].players);
        }

        public void Reset()
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            if (games[pc.groupId].players[pc.pcid].role.Equals("moderator")) {
                games[pc.groupId].reset();
                Clients.Group(pc.groupId).reset();
            }
        }

        public void UpdateScore(double score)
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            if (games[pc.groupId].players[pc.pcid].role.Equals("moderator"))
            {
                Clients.Group(pc.groupId).updateScore(score);
            }
        }

        public void FlipCards()
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            if (games[pc.groupId].players[pc.pcid].role.Equals("moderator"))
            {
                games[pc.groupId].cardsFlipped = true;
                Clients.Group(pc.groupId).flipCards();
            }
        }

        //public void DisableCards()
        //{
        //    PlayerConnection pc = connections[Context.ConnectionId];
        //    if (games[pc.groupId].players[pc.pcid].role.Equals("moderator"))
        //    {
        //        games[pc.groupId].cardsFlipped = true;
        //        Clients.Group(pc.groupId).disableCards();
        //    }
        //}

        public void PlayCard(string cardId)
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            if (!games[pc.groupId].cardsFlipped) { 
                games[pc.groupId].players[pc.pcid].cardId = cardId;
                Clients.Group(pc.groupId).cardPlayed(games[pc.groupId].players.Values);
            }
        }

        public void HandOffModerator(string pcid)
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            Player p = games[pc.groupId].players[pc.pcid];
            if (p.role.Equals("moderator"))
            {
                if (!pcid.Equals(p.id)) { 
                    games[pc.groupId].players[pcid].role = "moderator";
                    Player newMod = games[pc.groupId].players[pcid];
                    foreach (string conn in newMod.connections)
                    {
                        Clients.Client(conn).isModerator();
                    }

                    games[pc.groupId].players[pc.pcid].role = "player";
                    foreach(string conn in games[pc.groupId].players[pc.pcid].connections)
                    {
                        Clients.Client(conn).isPlayer();
                    }
                    Clients.Group(pc.groupId).showPlayers(games[pc.groupId].players);
                }
            }
        }

        public void UpdateDeck(dynamic cards)
        {
            PlayerConnection pc = connections[Context.ConnectionId];
            if (games[pc.groupId].players[pc.pcid].role.Equals("moderator"))
            {
                games[pc.groupId].reset();
                Clients.Group(pc.groupId).updateDeck(cards);
            }
        }

        private void tryAddGame(string gameId)
        {
            if(games == null)
            {
                games = new ConcurrentDictionary<string, Game>();
            }
            //If the game doesn't exist create it
            if (!games.ContainsKey(gameId))
            {
                games.TryAdd(gameId, new Game() { gameId = gameId });
            }
        }
    }
}