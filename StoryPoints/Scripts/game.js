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

deck.getScore = function (avg) {
    for (var c in this.cards) {
        if (this.cards.hasOwnProperty(c)) {
            if (avg <= this.cards[c].value) {
                return this.cards[c].displayValue;
            }
        }
    }
    return null;
}

displayCardOptions(deck.cards);

for (var c in cards) {
    if(cards.hasOwnProperty(c)){
        var checked = deck.cards.hasOwnProperty(c) ? 'checked' : '';
        $("#cardsInPlay").append('<div><input type="checkbox" value="'+cards[c].id+'" ' + checked + '/> <span class=""><label class="card-front">' + cards[c].displayValue + '</label></span></div>');
    }
}

function displayCardOptions(cards) {
    $('#card-options').empty();
    for (var card in cards) {
        if (deck.cards.hasOwnProperty(card)) {        
            $('#card-options').append(createCard(cards[card],""));
        }
    }
    $('#card-options .card-back').addClass('hidden');
}

function createCard(card,color) {
    return $('<div class="card-container '+color+'" value="'+card.id+'"><div class="card-front">'+card.displayValue+'</div><div class="card-back">SP</div></div>');
}

function createPlayedCard(player) {
    var $card = $('<div class="played-card"><div class="card-owner" value="'+player.id+'">' + player.name + '</div></div>');
    return $card.prepend(createCard(deck.cards[player.cardId],"card-blue"));
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

    hub.client.updateDeck = function (cards) {
        deck.cards = cards;
        displayCardOptions(deck.cards);
        reset();
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
        $('.mod').removeClass('hidden');
        $('.player').addClass('hidden');
    }

    hub.client.isPlayer = function () {
        //reset game board
        $('.player').removeClass('hidden');
        $('.mod').addClass('hidden');
    }

    hub.client.showPlayers = function (players) {
        //Show connected players
        showPlayers(players);
    }

    hub.client.updateScore = function (score) {
        $('#score').text(score);
        $('#score2').text('');
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
            if($('#score').text() === "-" && $('#scoreEdit').hasClass('hidden')){
                $('.card-container').removeClass('card-selected');
                $('.card-container').removeClass('card-up');
                var $card = $(e.target);
                if (!$card.hasClass('card-container')) {
                    $card = $card.parent();
                }
                $card.addClass('card-selected');
                $card.addClass('card-up');
                hub.server.playCard($card.attr('value'));
            }
        });
        $(document).on('click', '#players li', function (e) {
            hub.server.handOffModerator($(e.target).attr('value'));
        });
        $(document).on('change', '#cardsInPlay input', function (e) {
            var cardId = $(this).val();
            if ($(this).is(':checked')) {
                if (!deck.cards.hasOwnProperty(cardId) && cards.hasOwnProperty(cardId)) {
                    deck.cards[cardId] = cards[cardId];
                }
            }
            else {
                if (deck.cards.hasOwnProperty(cardId)) {
                    delete deck.cards[cardId];
                }
            }
            hub.server.updateDeck(deck.cards);
        });
        $('.glyphicon-ok').click(function () {
            saveScoreEdit(hub);
        });
        $('#scoreEdit').keyup(function (e) {
            if (e.keyCode == 13) {
                saveScoreEdit(hub);
            }
        });
    });
});

$(document).ready(function () {
    $('#settings').click(function () {
        $('#settingsModal').modal();
    });
    $('.glyphicon-pencil').click(function () {
        $('.glyphicon-ok,#scoreEdit').removeClass('hidden');
        $('.glyphicon-pencil,#score').addClass('hidden');
    });
    $(document).on('click', '#card-options .card-container,#card-options .card-front', function (e) {
        if(!$('#scoreEdit').hasClass('hidden')){
            var $card = $(e.target);
            if (!$card.hasClass('card-container')) {
                $card = $card.parent();
            }
            var newScore = deck.cards[$card.attr('value')].value;
            if (newScore === parseFloat(newScore, 10)) {
                $('#scoreEdit').val(newScore);
            }
        }
    });
});

function saveScoreEdit(hub) {
    $('#score').text($('#scoreEdit').val());
    $('.glyphicon-pencil,#score').removeClass('hidden');
    $('.glyphicon-ok,#scoreEdit').addClass('hidden');
    hub.server.updateScore($('#scoreEdit').val());
}

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
            $("#players li[value=" + players[i].id + "]").addClass("card-played");
        }
    }
    $('#game-board .card-front').addClass('hidden');
}

function reset() {
    $("#game-board").empty();
    $("#score").text("-");
    $("#scoreEdit").val(0);
    $("#score2").text("");
    $("#players li").removeClass("card-played");
    $(".card-container").removeClass("card-selected");
    $('.card-container').removeClass('card-up');
    $('.card-container').attr('style', '');
}

function flipCards() {
    $("#game-board .card-back").addClass('hidden');
    $("#game-board .card-front").removeClass('hidden');
    $('.card-container').removeClass('card-up');
    $('.card-container').removeClass('card-blue');
    scoreCards();
}

function scoreCards() {
    var cardCounts = {};
    var total = 0;
    var pass = 0;
    if ($('#game-board .played-card').length > 0) {
        $('#game-board .played-card').each(function () {
            var cardId = $(this).children('.card-container').attr('value');
            if (deck.cards[cardId].value === "P") {
                pass++;
            }
            else {
                total += deck.cards[cardId].value;
            }
            if (cardCounts.hasOwnProperty(cardId)) {
                cardCounts[cardId] += 1;
            }
            else {
                cardCounts[cardId] = 1;
            }

        });
        var playedCards = $('#game-board .played-card').length;
        var avg;
        if (playedCards == pass) {
            avg = "P";
        }
        else {
            avg = total / (playedCards - pass);
        }
        var score1;
        var score2;
        if (avg === "P") {
            score1 = avg;
            score2 = "";
        }
        else {
            score1 = deck.getScore(avg);
            score2 = avg.toFixed(1) + ' Average';
        }
        graphCards(cardCounts, playedCards);
        $('#score').text(score1);
        $('#scoreEdit').val(score1)
        $('#score2').text(score2);
    }
}

function graphCards(cardCounts, playedCards) {
    for (var c in cardCounts) {
        if (cardCounts.hasOwnProperty(c)) {
            var percent = (cardCounts[c] / playedCards) * 100;
            $('#card-options .card-container[value=' + c + ']').attr('style', 'background: linear-gradient(to top, #90EE90 ' + percent.toFixed(2) + '%, #ffffff 0%);');
        }
    }
}

function showPlayers(players) {
    $("#players").empty();
    for (var p in players) {
        if (players.hasOwnProperty(p) && players[p].name != null) {
            if (players[p].role === "moderator") {
                $("#players").append($("<li value='" + players[p].id + "'><span class='glyphicon glyphicon-user pull-right'></span><span>" + players[p].name + "</span></li>"));

            }
            else {
                $("#players").append($("<li value='" + players[p].id + "'>" + players[p].name + "</li>"));
            }
        }
    }
}