#Import needed to connect to the database
import mysql.connector

#Import regular expressions --> needed to seperate number from a word (posts, followers, following)
import re

#Time module - to always get current timestamp
import time
#get actual date
from datetime import date

#Imports needed for web scrapping
from time import sleep
from dotenv import load_dotenv
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

load_dotenv() #--> this will load env variables

#Connecting to the database
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="a1b2c3d4e5",
  database="sdp_project"
)

mycursor = mydb.cursor()

#Kad budem radila frontend, onda preko frontenda uzimati tacne podatke za username ovdje
#Prvo spasiti username u varijablu u bazu podataka pa onda odatle vuci podatke
# mycursor.execute("SELECT username FROM instagram_accounts LIMIT 1")
# myresult = mycursor.fetchone()

# for data in myresult:
#   print(data)
#this will print me just one outcome, because I only have one user with this name

service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)
driver.maximize_window()

insta_url = 'https://www.instagram.com/'
driver.get(insta_url)

sleep(3)

USERNAME = os.environ['IGUSERNAME']
PASSWORD = os.environ['PASSWORD']

#this username is the name of the HTML element, there was no id
#I accessed it through the CSS Selector then
username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
username_field.send_keys(USERNAME)

sleep(3)

#this password is the name of the HTML element, there was no id
password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
password_field.send_keys(PASSWORD)

sleep(15)

login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
login_button.click()

sleep(15) # --> to ensure that page has loaded properly

usernames = ["korman_ajla123", "asyya.m", "suada_korman"]
existing_usernames = []
for username in usernames:
    driver.get(insta_url + username) # --> check if users exist
    try:
      check_title_element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/div/div/span')))
      check_title_text = check_title_element.text
      if check_title_text == "Sorry, this page isn't available.":
        print(f"The page for {username} isn't available.")
    except:
      print(f"The username {username} exists.")
      existing_usernames.append(username)


#switch to messages page
dm_page_url = 'https://www.instagram.com/direct/inbox/'
driver.get(dm_page_url)

sleep(15)

cancel_notifications = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[3]/div[1]/div/div[2]/div/div/div/div/div[2]/div/div/div[3]/button[2]')))
cancel_notifications.click()

sleep(15)

for single_username in existing_usernames:
  send_dm_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[1]/div/div[1]/div[2]/div/div')))
  send_dm_button.click()
  input_recipient = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'queryBox')))
  input_recipient.click()
  input_recipient.send_keys(single_username)
  sleep(15)
  choose_recipient = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'ContactSearchResultCheckbox')))
  choose_recipient.click()
  sleep(15)
  chat_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[6]/div[1]/div/div[2]/div/div/div/div/div/div/div[1]/div/div[4]/div")))
  chat_button.click()
  sleep(15)
  send_message = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[2]/div/div[1]")))
  send_message.send_keys("This is an automated message. Please don't respond.")
  sleep(15)
  send_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/div/div/div/div[1]/div/div[2]/div/div/div/div/div/div/div[2]/div/div/div[2]/div/div/div[3]')))
  send_button.click()
  sleep(5)
  




sleep(10)

driver.quit()
