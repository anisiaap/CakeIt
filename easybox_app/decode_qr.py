from picamera2 import Picamera2
from pyzbar.pyzbar import decode
import cv2
import sys

def capture_and_decode():
    picam2 = Picamera2()
    picam2.configure(picam2.create_preview_configuration())
    picam2.start()
    timeout = 20  # Timeout in seconds
    start_time = cv2.getTickCount()
    qr_code = None

    while qr_code is None:
        frame = picam2.capture_array()
        decoded_objects = decode(frame)
        if decoded_objects:
            qr_code = decoded_objects[0].data.decode("utf-8")
            break

        elapsed_time = (cv2.getTickCount() - start_time) / cv2.getTickFrequency()
        if elapsed_time > timeout:
            break

    picam2.stop()
    if qr_code:
        print(qr_code)  # Output the QR code to stdout
        sys.exit(0)     # Exit with success
    else:
        sys.exit(1)     # Exit with failure

if __name__ == "__main__":
    capture_and_decode()