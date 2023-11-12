# This file will write request from the HTTP server to a JSON file and relate the data
# Data that doesn't exist will be written, and data that does exist will be overwritten

from queue import Queue
import time
import threading

# Shared queue between Flask and worker
task_queue = Queue()

def worker():
    while True:
        # Get data from the queue and process it
        data = task_queue.get()
        # Do some work with the data
        print("Processing:", data)
        # Simulate work
        time.sleep(2)

# Start the worker thread
worker_thread = threading.Thread(target=worker)
worker_thread.start()

# Keep the script running
while True:
    pass