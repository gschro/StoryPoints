var stories = {};
var deck = {};

var cards = {
        1: { id: 1, displayValue: "1/2", value:.5, color: "blue" },
        2: { id: 2, displayValue: "1", value: 1, color: "blue" },
        3: { id: 3, displayValue: "2", value: 2, color: "blue" },
        4: { id: 4, displayValue: "3", value: 3, color: "blue" },
        5: { id: 5, displayValue: "5", value: 5, color: "blue" },
        6: { id: 6, displayValue: "8", value: 8, color: "blue" },
        7: { id: 7, displayValue: "13", value: 13, color: "blue" },
        8: { id: 8, displayValue: "20", value: 20, color: "blue" },
        9: { id: 9, displayValue: "40", value: 40, color: "blue" },
        10: { id: 10, displayValue: "100", value: 100, color: "blue" },
        11: { id: 11, displayValue: "P", value: "P", color: "blue" }
}

deck.cards = {
    //1: { id: 1, displayValue: "1/2", value:.5, color: "blue" },
    2: { id: 2, displayValue: "1", value: 1, color: "blue" },
    3: { id: 3, displayValue: "2", value: 2, color: "blue" },
    4: { id: 4, displayValue: "3", value: 3, color: "blue" },
    5: { id: 5, displayValue: "5", value: 5, color: "blue" },
    6: { id: 6, displayValue: "8", value: 8, color: "blue" },
    7: { id: 7, displayValue: "13", value: 13, color: "blue" },
    8: { id: 8, displayValue: "20", value: 20, color: "blue" },
    9: { id: 9, displayValue: "40", value: 40, color: "blue" },
    10: { id: 10, displayValue: "100", value: 100, color: "blue" },
    11: { id: 11, displayValue: "P", value: "P", color: "blue" }
}

displayCardOptions(deck.cards);

for (var c in cards) {
    if(cards.hasOwnProperty(c)){
        var checked = deck.cards.hasOwnProperty(c) ? 'checked' : '';
        $("#cardsInPlay").append('<input type="checkbox" ' + checked + '/> <label>' + cards[c].displayValue + '</label>');
    }
}

function displayCardOptions(cards){
    for (var card in cards) {
        if (deck.cards.hasOwnProperty(card)) {        
            $('#card-options').append(createCard(cards[card]));
        }
    }
    $('#card-options .card-back').addClass('hidden');
}

function createCard(card) {
    return $('<div class="card-container" value="'+card.id+'"><div class="card-front">'+card.displayValue+'</div><div class="card-back">SP</div></div>');
}

function createPlayedCard(player) {
    var $card = $('<div class="played-card"><div class="card-owner" value="'+player.id+'">' + player.name + '</div></div>');
    return $card.prepend(createCard(deck.cards[player.cardId]));
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
        });
    }

    hub.client.cardPlayed = function (players) {
        showCards(players);
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
        $(document).on('click', '#card-options .card-container,#card-options .card-front', function (e) {
            if($('#score').text() === "-"){
                $('.card-container').removeClass('card-selected');
                $('.card-container').removeClass('card-up');
                var $card = $(e.target);
                console.log('in ' + $card);
                if (!$card.hasClass('card-container')) {
                    $card = $card.parent();
                }
                $card.addClass('card-selected');
                $card.addClass('card-up');
                hub.server.playCard($card.attr('value'));
            }
        });
        $(document).on('click', '.players li', function (e) {
            hub.server.handOffModerator($(e.target).val());
        });
    });
});

$(document).ready(function () {
    $("#settings").click(function () {
        $("#settingsModal").modal();
    });
});

function sendName(hub) {
    //close modal
    $('#nameModal').modal('hide');
    hub.server.setName($('#name').val());
}

function showCards(players) {
    $('#game-board').empty();
    for (var i = 0; i < players.length; i++) {
        if (players[i].cardId != null) {
            $("#game-board").append(createPlayedCard(players[i]));
        }
    }
    $('#game-board .card-front').addClass('hidden');
}

function reset() {
    $("#game-board").empty();
    $("#score").text("-");
    $("#players li").removeClass("card-played");
    $(".card-container").removeClass("card-selected");
    $('.card-container').removeClass('card-up');
}

function flipCards() {
    $("#game-board .card-back").addClass('hidden');
    $("#game-board .card-front").removeClass('hidden');
    $('.card-container').removeClass('card-up');

    scoreCards();
}

function scoreCards() {
   
    $('#game-board .card-played').each(function () {


    });
    $('#score').text('4');
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