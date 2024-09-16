import threading
import random
import mysql.connector
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from time import sleep
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys  

# This will load env variables
load_dotenv() 

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="a1b2c3d4e5",
    database="sdp_project"
)

mycursor = mydb.cursor()

def get_scheduled_messages():
    query = "SELECT ud.users_email, ud.users_password, ia.username, ud.message, ud.port_value, ud.id FROM users_dms ud JOIN instagram_accounts ia ON ud.recipients_id = ia.id WHERE ud.status = 'Scheduled'"
    mycursor.execute(query)
    results = mycursor.fetchall()

    if not results:
        print("No scheduled messages found.")
        exit()  

    for result in results:
        port_value = result[4] 
        user_email = result[0]

        if port_value is None or port_value == '':
            print("Port value is missing, creating a new port first...")
            
            # Generate a unique new port
            new_port_value = generate_new_port()
            
            # Update the record with the new unique port value
            update_query = "UPDATE users_dms SET port_value = %s WHERE users_email = %s"
            mycursor.execute(update_query, (new_port_value, user_email))
            mydb.commit()

    query2 = "SELECT ud.users_email, ud.users_password, ia.username, ud.message, ud.port_value, ud.id FROM users_dms ud JOIN instagram_accounts ia ON ud.recipients_id = ia.id WHERE ud.status = 'Scheduled'"
    mycursor.execute(query2)
    results2 = mycursor.fetchall()

    return results2

def generate_new_port():
    while True:
        # Generate a new port value
        new_port = random.randint(100, 10000)
        # Check if this port is unique
        mycursor.execute("SELECT COUNT(*) FROM users_dms WHERE port_value = %s", (new_port,))
        if mycursor.fetchone()[0] == 0:
            # Port is unique, return it
            return new_port

def get_unique_senders():
    query = "SELECT users_email FROM users_dms WHERE status = 'Scheduled' GROUP BY users_email;"
    mycursor.execute(query)
    return mycursor.fetchall()

def no_of_messages_per_user():
    query = "SELECT users_email, COUNT(message) FROM users_dms WHERE status = 'Scheduled' GROUP BY users_email;"
    mycursor.execute(query)
    return mycursor.fetchall()
     

def log_in(driver, fb_email, fb_password):

    sleep(2)

    email_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'email')))
    email_field.send_keys(fb_email)

    sleep(3)

    password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'pass')))
    password_field.send_keys(fb_password)

    sleep(3)

    login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'login')))
    login_button.click()

    sleep(15)


def check_if_logged_in(driver):
    try:
        check_search_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//input[contains(@class, 'x1ix68h3') and contains(@class, 'x19gujb8')]"))
        )
        print("Logged in.")
        return True
    except TimeoutException:
        print("Not logged in.")
        return False
    
def check_fb_account_existence(driver, fb_username):
    fb_url = 'https://www.facebook.com/'
    driver.get(fb_url + fb_username)
    try:
        check_return_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'x1lliihq') and contains(@class, 'x6ikm8r')]"))
        )
        return_button_text = check_return_button.text
        if return_button_text == "Go to News Feed":
            print("Username does not exist. Exiting...")
            return False
        else:
            print("Username exists. Proceeding with further action.")
            return True
    except:
        return -1
    
def send_dm(driver, fb_username, message):

    #go to messenger page
    driver.get('https://www.messenger.com/')

    current_url = driver.current_url  
    #print(current_url)

    if current_url == "https://www.messenger.com/":
        continue_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//span[contains(@class, '_4zls')]"))
            )
        
        continue_button.click()

        sleep(10)

    new_message_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//a[contains(@class, 'x1ejq31n') and contains(@class, 'xd10rxx')]"))
            )
    new_message_button.click()

    enter_name =  WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[contains(@class, 'xjbqb8w') and contains(@class, 'x76ihet')]"))
            )
    enter_name.send_keys(fb_username)

#ovo ovdje pada
    choose_name = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div[2]/div/div/div[2]/div/div/div[1]/div[1]/ul/li[2]/ul/div[1]/li/a"))
            )
    choose_name.click()

    message_field =  WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'xzsf02u') and contains(@class, 'x1a2a7pz')]"))
            )
    message_field.click()
    message_field.send_keys(message)

    send_button =  WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'xdj266r') and contains(@class, 'xat24cr') and contains(@class, 'x2lwn1j') and contains(@class, 'xeuugli') and contains(@class, 'x1n2onr6')]"))
            )
    
    send_button.send_keys(Keys.ENTER)

    sleep(100)

def main():
   
    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=' + "9226") 
    options.add_argument('--user-data-dir=C:\selenum\ChromeProfile' + "9226") 
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    driver.get("https://www.facebook.com/")

    fb_email = "korman.ajla115@gmail.com"
    fb_password = "lalesuzute115"
    fb_username = "suada.korman"

    if not (check_if_logged_in(driver)):
        log_in(driver, fb_email, fb_password)

    if not (check_fb_account_existence(driver, fb_username)):
        exit()

    send_dm(driver, fb_username, "This is an automated message.")

if __name__ == "__main__":

    main()
