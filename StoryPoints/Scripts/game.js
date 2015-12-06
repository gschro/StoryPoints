var stories = {};
var deck = {};
deck.cards = {
    1: { id: 1, displayValue: .5, value: .5, color: blue },
    2: { id: 2, displayValue: 1, value: .5, color: blue },
    3: { id: 3, displayValue: 2, value: .5, color: blue },
    4: { id: 4, displayValue: 3, value: .5, color: blue },
    5: { id: 5, displayValue: 5, value: .5, color: blue },
    6: { id: 6, displayValue: 8, value: .5, color: blue },
    7: { id: 7, displayValue: 13, value: .5, color: blue },
    8: { id: 8, displayValue: 20, value: .5, color: blue },
    9: { id: 9, displayValue: 40, value: .5, color: blue },
    10: { id: 10, displayValue: 100, value: .5, color: blue },
    11: { id: 11, displayValue: P, value: .5, color: blue }
}

$(function () {
    // Declare a proxy to reference the hub. 
    var hub = $.connection.gameHub;    

    hub.client.getName = function () {
        //Get Name Modal
    }

    hub.client.flipCards = function () {
        flipCards();
    }

    hub.client.reset = function () {
        reset();
    }

    hub.client.isModerator = function () {
        //reset game board
    }

    hub.client.isPlayer = function () {
        //reset game board
    }

    hub.client.showPlayers = function (players) {
        //Show connected players
    }
        
    // Start the connection.
    $.connection.hub.start().done(function () {
        hub.server.newConnection(window.location.pathname);
        $('#nameModalOk').click(function () {
            //close modal
            hub.server.setName($('#displayname').val());
        });
        $('#flip').click(function () {
            hub.server.flipCards();
        });
        $('#reset').click(function () {
            hub.server.reset();
        });
        $(document).on('click', '.players li', function (e) {
            hub.server.handOffModerator($(e.target).val());
        });
    });
});

function reset() {
    $("#game-board,#score").empty();
    $("#players li").removeClass("card-played");
    $(".card-option").removeClass("card-selected");
}

function flipCards(players) {

}

function showPlayers(players) {
    for (var p in players) {
        if (players.hasOwnProperty(p)){
            $("#players").append($("<li value='"+players[p].id+"'>"+players[p].name+"</li>"));
        }
    }
}