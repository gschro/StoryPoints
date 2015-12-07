var stories = {};
var deck = {};
deck.cards = {
    //1: { id: 1, displayValue: "1/2", value:.5, color: "blue" },
    2: { id: 2, displayValue: "1", value:.5, color: "blue" },
    3: { id: 3, displayValue: "2", value:.5, color: "blue" },
    4: { id: 4, displayValue: "3", value:.5, color: "blue" },
    5: { id: 5, displayValue: "5", value:.5, color: "blue" },
    6: { id: 6, displayValue: "8", value:.5, color: "blue" },
    7: { id: 7, displayValue: "13", value:.5, color: "blue" },
    8: { id: 8, displayValue: "20", value:.5, color: "blue" },
    9: { id: 9, displayValue: "40", value:.5, color: "blue" },
    10: { id: 10, displayValue: "100", value:.5, color: "blue" },
    11: { id: 11, displayValue: "P", value:.5, color: "blue" }
}

displayCardOptions(deck.cards);

function displayCardOptions(cards){
    for (var card in cards) {
        if (deck.cards.hasOwnProperty(card)) {        
            $('#card-options').append(createCard(cards[card].id, cards[card].displayValue));
        }
    }
    $('#card-options .card-back').addClass('hidden');
}

function createCard(id, display) {
    return $('<div class="card-container" value="'+id+'"><div class="card-front">'+display+'</div><div class="card-back">SP</div></div>');
}

$(function () {
    // Declare a proxy to reference the hub. 
    var hub = $.connection.gameHub;    

    hub.client.getName = function () {
        //Show Name Modal
        $('#nameModal').modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#nameModal').on('shown.bs.modal', function () {
            $('#name').focus();
        })
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
        showPlayers(players);
    }
        
    // Start the connection.
    $.connection.hub.start().done(function () {
        hub.server.newConnection(window.location.pathname);
        $('#nameModalOk').click(function () {
            sendName(hub);
        });
        $('#name').keyup(function (e) {
            if (e.keyCode == 13) {
                sendName(hub);
            }
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

$(document).ready(function () {
    $(document).on('click', '.card-container, .card-front', function (e) {
        $('.card-container').removeClass('card-selected');
        var $card = $(e.target);
        console.log('in ' + $card);
        if (!$card.hasClass('card-container')) {
            $card = $card.parent();
        }
        $card.addClass('card-selected');
    })
});

function sendName(hub) {
    //close modal
    $('#nameModal').modal('hide');
    hub.server.setName($('#name').val());
}

function reset() {
    $("#game-board,#score").empty();
    $("#players li").removeClass("card-played");
    $(".card-option").removeClass("card-selected");
}

function flipCards(players) {

}

function showPlayers(players) {
    for (var p in players) {
        if (players.hasOwnProperty(p)) {
            if (players[p].role === "moderator") {
                $("#players").append($("<li value='" + players[p].id + "'><span class='glyphicon glyphicon-user pull-right'></span><span>" + players[p].name + "</span></li>"));

            }
            else {
                $("#players").append($("<li value='" + players[p].id + "'>" + players[p].name + "</li>"));
            }
        }
    }
}