import mysql.connector
import re
import time
from datetime import date
from dotenv import load_dotenv
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from time import sleep

load_dotenv() # This will load env variables

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="a1b2c3d4e5",
    database="sdp_project"
)

mycursor = mydb.cursor()

def get_scheduled_messages():
    query = "SELECT id, message, status, recipients_id FROM users_dms WHERE status = 'Scheduled'"
    mycursor.execute(query)
    return mycursor.fetchall()

def get_instagram_username(recipients_id):
    query = "SELECT username FROM instagram_accounts WHERE id = %s"
    mycursor.execute(query, (recipients_id,))
    result = mycursor.fetchone()
    return result[0] if result else None

def check_username_exists(driver, username):
    insta_url = 'https://www.instagram.com/'
    driver.get(insta_url + username)
    try:
        check_title_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/div/div/span'))
        )
        check_title_text = check_title_element.text
        if check_title_text == "Sorry, this page isn't available.":
            return False
    except:
        return True

def send_message(driver, username, message):
    insta_url = 'https://www.instagram.com/'
    driver.get(insta_url + username)
    try:
        message_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div/div[1]/section/main/div/header/section[2]/div/div/div[2]/div/div[2]/div'))
        )
        message_button.click()
        sleep(3)

        turn_on_notifications_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '/html/body/div[7]/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[3]/button[1]'))
        )
        turn_on_notifications_button.click()
        sleep(3)

        send_message_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div[1]/p"))
        )
        send_message_field.send_keys(message)
        sleep(3)

        send_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[3]'))
        )
        send_button.click()
        return True
    except:
        return False

def update_message_status(message_id, status):
    query = "UPDATE users_dms SET status = %s WHERE id = %s"
    mycursor.execute(query, (status, message_id))
    mydb.commit()

def main():
    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    insta_url = 'https://www.instagram.com/'
    driver.get(insta_url)

    sleep(3)

    USERNAME = os.environ['IGUSERNAME']
    PASSWORD = os.environ['PASSWORD']

    username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
    username_field.send_keys(USERNAME)

    sleep(3)

    password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
    password_field.send_keys(PASSWORD)

    sleep(15)

    login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
    login_button.click()

    sleep(15) # Ensure the page has loaded properly

    messages = get_scheduled_messages()
    for message_id, message, status, recipients_id in messages:
        username = get_instagram_username(recipients_id)
        if username:
            if check_username_exists(driver, username):
                if send_message(driver, username, message):
                    update_message_status(message_id, "Sent")
                else:
                    update_message_status(message_id, "Failed to Send")
            else:
                update_message_status(message_id, "Invalid Username")
        else:
            update_message_status(message_id, "Invalid Username")

    driver.quit()

if __name__ == "__main__":
    main()
