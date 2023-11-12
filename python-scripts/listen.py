from flask import Flask, request, Response
from pymongo import MongoClient
from queue import Queue
from datetime import datetime
import threading

app = Flask(__name__)

task_queue = Queue()
# client = MongoClient("localhost", 27017) # connect to db instance
client = MongoClient("mongodb://localhost:27017/") # connect to db instance
db = client.playerdb # Create or reference the player db
players = db.players # collection to parse
flagResp = 0 # Default value before response gets sent back

# Code form ChatGPT to start a queue with threading
def worker():
    while True:
        data = task_queue.get()
        print("Processing", data)
        if data[0] == "32":
            print("Save Player Login Time")
            now = datetime.now()
            formatted_timestamp = now.strftime("%B %d %I:%M%p")
            print(formatted_timestamp)
            players.insert_one({"name": data[1], "login": formatted_timestamp})
        elif data[0] == "33":
            print("Calculate Player total Time and save Logout Time")
            now = datetime.now()
            formatted_timestamp = now.strftime("%B %d %I:%M%p")
            print(formatted_timestamp)

worker_thread = threading.Thread(target=worker)
worker_thread.start()

@app.route("/", methods=["GET"])
def inGameCommands():
    # Get the data sent by the client
    # print("Here is the data from the client RAW")
    # print(request.data)
    client_data = request.data.decode("utf-8")  # Assuming UTF-8 encoding
    # Print the client data to the terminal
    print("Received data from client:")
    client_data = str(client_data)
    print(client_data)
    if client_data == "30":
        response_text = "27"
    else:
        response_text == "24"
    return Response(response_text, content_type="text/plain")

@app.route("/server", methods=["GET"])
def outGameCommands():
    # Get the data sent by the client
    # print("Here is the data from the client RAW")
    # print(request.data)
    client_data = request.data.decode("utf-8")  # Assuming UTF-8 encoding
    # Print the client data to the terminal
    # print("Received data from client:")
    # print(client_data)
    # print("flagResp Value is")
    # print(flagResp)
    global flagResp  # Declare flagResp as a global variable
    if flagResp == 28:
        flagResp = 0
        response_text = "28"
        return Response(response_text, content_type="text/plain")
    else:
        response_text = "26"
        return Response(response_text, content_type="text/plain")

# Create a route to handle form submission from the web interface
@app.route('/process', methods=['POST'])
def process():
    global flagResp  # Declare flagResp as a global variable
    print("Data from POST")
    print(int(request.form['data']))
    flagResp = int(request.form['data'])
    print("Changed value of flagResp to")
    print(flagResp)
    return f'Data from web interface: {flagResp}'

@app.route("/request", methods=["GET"])
def inGameRequests():
    # Get the data sent by the client
    # print("Here is the data from the client RAW")
    # print(request.data)
    client_data = request.data.decode("utf-8")  # Assuming UTF-8 encoding
    # Print the client data to the terminal
    print("Received data from client:")
    client_data = str(client_data)
    print(client_data)
    result_list = client_data.split() # Place request into a list to grab error code and player name
    task_queue.put(result_list)
    if result_list[0] == "32":
        response_text = "34"
    elif result_list[0] == "33":
        response_text = "35"
    else:
        response_text == "24"
    return Response(response_text, content_type="text/plain")

if __name__ == "__main__":
    app.run(debug=True)
