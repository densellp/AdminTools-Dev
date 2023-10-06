console.warn("Script main.js has loaded")

import * as server from "@minecraft/server"
import * as ui from "@minecraft/server-ui"
import * as net from "@minecraft/server-net"

// import * as hello from './hello.js';
// console.warn(hello.sayHello("Bruh this works!"));

console.warn("Script is running, do not panic!")

// init code
const world = server.world;

// Http Server
let runServer = 1; // Set to 0 to disable feature

//call main()
main();

async function main(){

    // This whole block of code does not work right now
    let client = await new net.HttpRequest("http://127.0.0.1:5000/server"); // Flask Server Address
    let httpResp;
    console.warn("Http Client has started");

    await waitForRequest(runServer, client, httpResp); // wait for request from Server
}

function getPlayers() {
    console.warn("Looking up player data")
    const players = server.world.getPlayers();
    console.log(players); // Show us the player list
    return players;
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