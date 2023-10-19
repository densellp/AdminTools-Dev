import requests

while True:
    data = input("Enter data (or 'exit' to quit): ")
    
    if data.lower() == 'exit':
        break
    
    # Send the data to the Flask server
    response = requests.post('http://localhost:5000/process', data={'data': data})
    
    if response.status_code == 200:
        print(f'Server Response: {response.text}')
    else:
        print('Error sending data to server.')