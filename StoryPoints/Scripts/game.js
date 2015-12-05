$(function () {
    // Declare a proxy to reference the hub. 
    var hub = $.connection.gameHub;    

    hub.client.getName = function () {
        //Get Name Modal
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
    });
});