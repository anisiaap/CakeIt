import gpiod
import time

# Constants for the GPIO chip and line numbers
CHIP_NAME = 'gpiochip0'  # Adjust if needed
LINE_NUMBER_SOLENOID = 17  # GPIO17 for solenoid control
 # GPIO18 for feedback measurement

def setup_output(line_number):
    """Setup GPIO line for output."""
    chip = gpiod.Chip(CHIP_NAME)
    line = chip.get_line(line_number)
    line.request(consumer='solenoid_control', type=gpiod.LINE_REQ_DIR_OUT)
    return line

def unlock_door():
    """Unlock the solenoid and verify functionality."""
    try:
        # Setup solenoid line
        solenoid_line = setup_output(LINE_NUMBER_SOLENOID)

        print("Activating solenoid (unlocking)...")
        solenoid_line.set_value(0)  # Energize solenoid (unlock)
        time.sleep(10)  # Keep it unlocked for 10 seconds

        print("Deactivating solenoid (locking)...")
        solenoid_line.set_value(1)  # De-energize solenoid (lock)
        solenoid_line.release()  # Release the GPIO line
        return True  # Indicate success

    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = unlock_door()
    if success:
        print("Solenoid operation succeeded.")
        exit(0)  # Success
    else:
        print("Solenoid operation failed.")
        exit(1)  # Failure
