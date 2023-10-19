console.warn("Script main.js has loaded")

import * as server from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import * as net from "@minecraft/server-net"

// import * as hello from './hello.js';
// console.warn(hello.sayHello("Bruh this works!"));

console.warn("Script is running, do not panic!")

// init code
const world = server.world;
const system = server.system;

// Http Server
let runServer = 0; // Set to 0 to disable feature

//call main()
main();

async function main(){

    if (runServer){
        console.warn("Http Client has started");
        // This whole block of code does not work right now
        let client = await new net.HttpRequest("http://127.0.0.1:5000/server"); // Flask Server Address
        let httpResp;
        await waitForRequest(runServer, client, httpResp); // wait for request from Server
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
        // Code to be repeated goes here
        // console.warn(`player ${playerObj[i].name} is in the list`);
        if (playerObj[i].name === name){
            // console.warn(`player ${name} exist so code can execute`);
            return;
        }
      }
      console.warn(`player ${name} does not exist, please try again`);
}

// async function setHttpData(data) {
//     await data.setBody("Request data from Flask Server");
//     return data;
// }s

// async function sleep(ms) {
//     const start = Date.now();
//     while (Date.now() - start < ms) {}
// }

async function waitForRequest(runServer, client, httpResp){
    while(runServer){
        //await sleep(2000); // Wait for 2 seconds
        //httpResp = await makeHttpRequest(httpResp, client);
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

// async function makeHttpRequest(data, client) {
//     data = await net.http.request(client);
//     return data;
// }

// async function testLoop(){
//     while(1){
//         await sleep(2000);
//         console.warn("Testing Loop")
//     }
// }

// async function asyncFunc() {
//     let n = 0;
//     while(n < 5){
//         await sleep(2000);
//         console.warn(`Testing Loop ${n}`);
//         n += 1;
//     }
//     return;
// }

///////////////////////////////////////////////////

// events
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

                let req = await new net.HttpRequest("http://127.0.0.1:5000")

                console.warn("Contents of body for HTttpRequest")
                await req.setBody("30");
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
                    let resp = httpResponse.body;
                    resp = Number(resp);
                    if (resp === 27){
                        result.source.runCommandAsync(`w @s server pinged HTTP Server and received response code ${resp}`); // Run command in addon
                    }
                  } catch (error) {
                    console.error('Error making the HTTP request:', error);
                  }
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