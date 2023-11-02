console.warn("Script main.js has loaded")

import * as server from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import * as net from "@minecraft/server-net"

console.warn("Script is running, do not panic!")

// init code
const world = server.world;
const system = server.system;

// Http Server
let runServer = 1; // Set to 0 to disable feature

//call main()
main();

async function main(){

    if (runServer){
        console.warn("Http Client has started");
        let client = await new net.HttpRequest("http://127.0.0.1:5000/server"); // Flask Server Address
        let httpResp;
        await waitForRequest(runServer, client, httpResp); // wait for request from Server
    } else {
        console.warn("Http Client has not started");
    }
}

function getPlayers() {
    console.warn("Looking up player data")
    const players = server.world.getPlayers();
    console.log(players); // Show us the player list
    return players;
}

function playerLookup(playerObj, name){
    const size = playerObj.length
    // console.warn(`list size is: ${size}`);
    for (let i = 0; i < size; i++) {
        // console.warn(`player ${playerObj[i].name} is in the list`);
        if (playerObj[i].name === name){
            // console.warn(`player ${name} exist so code can execute`);
            return;
        }
      }
      console.warn(`player ${name} does not exist, please try again`);
}

async function waitForRequest(runServer, client, httpResp){
    while(runServer){
        await client.setBody("29");
        httpResp = await net.http.request(client)
        // console.warn("Ping Http Server");
        httpResp = Number(httpResp.body);
        if (httpResp === 28){
            console.warn("Recieved instructions from server, executing code");
            // httpResp = 0;
        }
    }
}

async function pingHttpServer(code, result) {
    const tempCode = String(code) // convert code to string to send to server
    console.warn("You are attempting to ping an http server")

    let req = await new net.HttpRequest("http://127.0.0.1:5000")

    console.warn("Contents of body for HttpRequest")
    await req.setBody(tempCode);
    console.warn(req.body)

    try {
        const httpResponse = await net.http.request(req);
        console.warn("here is the body of the response from the server");
        console.warn(httpResponse.body);
        let resp = httpResponse.body;
        resp = Number(resp);
        if (resp === 27){
            result.source.runCommandAsync(`w @s server pinged HTTP Server and received response code ${resp}`); // Run command in addon
        } else {
            result.source.runCommandAsync(`w @s another code was sent back ${resp}, did you mean something else?`);
        }
        } catch (error) {
        console.error('Error making the HTTP request:', error);
        }
}

///////////////////////////////////////////////////

// events
world.afterEvents.itemUse.subscribe(async result => {

    if (result.itemStack.typeId == "dp:admin_book") {
        const form = new ui.ActionFormData()
            .title("Admin Functions")
            .button("Kick Player")
            .button("Ping Http Server")
            .button("Start Http Server")
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
                await pingHttpServer(30, result);
            }
            else if (selection == 2){
                runServer = 1;
            }
        });
    }

});

world.afterEvents.chatSend.subscribe(result => {

    const player = result.sender;
    const msg = result.message;
    result.cancel = true;
    const players = getPlayers();

    const msgList = msg.split(" ");

    if (msgList[0] == "!freeze") {
        if (msgList[0] == null || msgList[0] == ""){
            console.warn("Player name not detected, please enter name");
            return;
        }
        player.runCommand(`say the freeze command does not work yet :(`);
        playerLookup(players, msgList[1]);
    }
});

world.beforeEvents.chatSend.subscribe((data) => {
    const player = data.sender;
    const msg = data.message
    const commands = [".hub", ".gmsp", ".help", ".gmc", ".arena", ".code", ".newskygen", ".gma", ".gui", ".staffcmds"]
   system.run(()=>{
    if (msg == commands[0]) {
        data.cancel = true;
        player.runCommandAsync('tp @s[scores={commandacess=!2}] 375 -59 78');
        player.runCommandAsync('playsound random.orb @s[scores={commandacess=!2}]');
        player.runCommandAsync('tellraw @s[scores={commandacess=!2}] {"rawtext":[{"text":"§aWarped to Hub."}]}');
    } else if (msg == commands[1]) {
        data.cancel = true;
        player.runCommandAsync('gamemode spectator @s[scores={commandacess=!2..},tag=Owner,tag=Staff]')
        player.runCommandAsync('playsound mob.blaze.shoot @s[scores={commandacess=!2..},tag=Owner,tag=Staff]')
        player.runCommandAsync('tellraw @s[scores={commandacess=!2..},tag=Owner,tag=Staff] {"rawtext":[{"text":"§bSpectator has been enabled"}]}')
    } else if (msg == commands[2]) {
        data.cancel = true;
        player.runCommandAsync('tellraw @s {"rawtext":[{"text":"§7.hub: Teleports you to the Hub in a matter of seconds, it cannot be used in certain places tho.\n§7.help: Provides a list of commands that you can use."}]}')
    } else if (msg == commands[3]) {
        data.cancel = true;
        player.runCommandAsync('gamemode c @s[tag=Staff]')
        player.runCommandAsync('tellraw @s[tag=Staff] {"rawtext":[{"text":"Gamemode set to Creative."}]}')
    } else if (msg == commands[4]) {
        data.cancel = true;
        player.runCommandAsync('tp @s[tag=Staff] 1135 -61 -1132')
        player.runCommandAsync('tellraw @s[tag=Staff] {"rawtext":[{"text":"§eUse .hub to teleport back to the hub."}]}')
    } else if (msg == commands[5]) {
        data.cancel = true;
        player.sendMessage('§aClose chat to open the ui!')
        system.run
            (form.show(player))
    }
    else if (msg == commands[6]) {
        data.cancel = true;
        player.runCommandAsync('tp @s[tag=Staff] -21 282 -203')
    }
    else if (msg === commands[7]) {
        data.cancel = true;
        player.runCommandAsync('gamemode a @s[tag=Staff]')
        player.runCommandAsync('tellraw @s[tag=Staff] {"rawtext":[{"text":"Gamemode set to Adventure."}]}')
    }
    else if (msg === commands[8]) {
        data.cancel = true;
        player.runCommandAsync('execute at @s run structure load gui ~~~')
    }
    else if (msg === commands[9]) {
        data.cancel = true;
        player.runCommandAsync('tellraw @s[tag=Staff] {"rawtext":[{"text":"§7.gmsp: Puts you in Spectator\n.gmc: Sets your Gamemode to Creative\n.arena: Teleports you to the Arena\n.newskygen: Teleports you to the new Skygen\n.gma: Sets your Gamemode to Adventure\n.gui: Gives you the WIP server GUI\n.staffcmds: Provides you a list of Staff only commands."}]}')
    }
    else if (!msg.startsWith(".")) {
        return;
    } else if (msg.startsWith(".") && msg != commands.length) {
        data.cancel = true;
        player.sendMessage("§cPlease provide a valid command.")
    }})
})

world.afterEvents.playerJoin.subscribe(result => {

    console.warn(result.playerName);

});

world.afterEvents.playerLeave.subscribe(result => {

    console.warn(result.playerName);

});