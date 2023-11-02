from flask import Flask, request, Response

app = Flask(__name__)

flagResp = 0 # Default value before response gets sent back

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
    if client_data == "32":
        response_text = "34"
    elif client_data == "33":
        response_text = "35"
    else:
        response_text == "24"
    return Response(response_text, content_type="text/plain")

if __name__ == "__main__":
    app.run(debug=True)
