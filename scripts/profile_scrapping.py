from time import sleep
from dotenv import load_dotenv
import os
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service


load_dotenv()

USERNAME = os.environ['IGUSERNAME']
PASSWORD = os.environ['PASSWORD']

print(USERNAME, PASSWORD)

service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)
driver.maximize_window()

insta_url = 'https://www.instagram.com/'
driver.get(insta_url)

sleep(1)

username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
username_field.send_keys(USERNAME)

sleep(1)

password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
password_field.send_keys(PASSWORD)

sleep(1)

login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
login_button.click()

sleep(15) 
#to ensure that page has loaded properly

driver.get(insta_url + 'cristiano')
sleep(5)

#ul - unordered list
#li - list item
ul = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "ul")))
#items = ul.find_elements_by_tag_name("li")
items = ul.find_elements(By.TAG_NAME, "li")

for li in items:
    print(li.text)





