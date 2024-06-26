import cv2
import os
import sys
import time
import logging
from cv2 import CAP_DSHOW

# Configure logging
logging.basicConfig(filename='capture_image.log', level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def capture_image(filename):
    logging.info("Starting image capture process...")
    
    cap = cv2.VideoCapture(0, CAP_DSHOW)
    while not cap.isOpened():
        cap = cv2.VideoCapture(0)

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

    ret, frame = cap.read()

    if ret:
        img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../Captured-images")
        
        if not os.path.exists(directory):
            os.makedirs(directory)

        os.chdir(directory)
        cv2.imwrite(filename, img)
        logging.info(f"Image '{filename}' captured and saved successfully in '{directory}' directory.")
    else:
        logging.error("Failed to capture image.")

    cap.release()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        logging.error("Please provide a filename as a command-line argument.")
        raise ValueError("Invalid Filename!")
    else:
        filename = sys.argv[1]
        capture_image(filename)
