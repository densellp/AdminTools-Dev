console.warn("Script main.js has loaded")

import * as server from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import * as net from "@minecraft/server-net"

// Code Portion of Addon
console.warn("Script is running, do not panic!")

const world = server.world;

world.afterEvents.itemUse.subscribe(async result => {

    if (result.itemStack.typeId == "dp:admin_book") {
        const form = new ui.ActionFormData()
            .title("Admin Functions")
            .button("Kick Player")
            .button("Ping Http Server")
            .show(result.source)

        form.then(async fulfilled => {
            console.warn("Form Submitted, attempting to lookup players")
            let selection = fulfilled.selection; // This is a number that indexs starting at 0
            console.warn("Here is the selection value")
            console.log(selection)
            let players = getPlayers();
            console.warn("Player info recieved, attempting to navigate button choice")
            if (selection == 0) {
                console.warn("You are trying to kick players?!")
                const playerForm = new ui.ActionFormData()
                    .title("Kick Players")
                    .button(players[0].name)
                    .show(result.source)

                playerForm.then(fulfilled => {
                    let selection = fulfilled.selection;
                    console.warn(`attempting to kick ${players[selection].name}}`)
                    if (selection + 1) {
                        result.source.runCommandAsync(`kick ${players[selection].name}`);
                        console.warn(`Kicked Player ${players[selection].name} from the game`)
                    }
                });
            }
            else if (selection == 1){
                console.warn("You are attempting to ping an http server")

                let req = new net.HttpRequest("http://127.0.0.1:5000")

                console.warn("Contents of body for HTttpRequest")
                await req.setBody("BRUH PLEASE WORK DAMMIT!");
                console.warn(req.body)

                // const testJSON = JSON.stringify({
                //     test: "BRUH",
                // });
                // req.setBody(testJSON);
                // req.SetBody = JSON.stringify({
                //     test: "BRUH",
                // });
                // req.setBody = "Testing One Two...."
                // req.SetMethod = net.HttpRequestMethod.POST;
                // req.setMethod(net.HttpRequestMethod.POST);

                try {
                    const httpResponse = await net.http.request(req);
                    console.warn("here is the body of the response from the server");
                    console.warn(httpResponse.body);
                  } catch (error) {
                    console.error('Error making the HTTP request:', error);
                  }
            }
        });
    }

});

function getPlayers() {
    console.warn("Looking up player data")
    const players = server.world.getPlayers();
    console.log(players); // Show us the player list
    return players;
}

///////////////////////////////////////////////////
