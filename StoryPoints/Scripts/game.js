$(function () {
    // Declare a proxy to reference the hub. 
    var hub = $.connection.gameHub;    

    hub.client.getName = function () {
        //Get Name Modal
    }

    hub.client.flipCards = function () {
        //flip cards
    }

    hub.client.reset = function () {
        //reset game board
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