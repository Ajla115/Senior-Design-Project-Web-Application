from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from time import sleep
from selenium import webdriver
from selenium.webdriver.chrome.service import Service


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

service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)
driver.maximize_window()

# Login part
insta_url = 'https://www.instagram.com/'
driver.get(insta_url)

sleep(1)

USERNAME = os.environ['IGUSERNAME']
PASSWORD = os.environ['PASSWORD']

# Username field
username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
username_field.send_keys(USERNAME)

sleep(1)

# Password field
password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
password_field.send_keys(PASSWORD)

sleep(1)

# Login button
login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
login_button.click()

sleep(10)  # To ensure that page has loaded properly

hashtag = 'fitness'
hashtags_url = 'https://www.instagram.com/explore/tags/'
driver.get(hashtags_url + hashtag)  # Accessing specific hashtag page
sleep(5)

# Get the elements within posts under the hashtag
posts = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, '//*[@id="mount_0_0_4t"]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/article/div/div/div/div[1]/div[1]/a')))

# Print the hrefs of the first ten posts
for post in posts[:10]:
    href = post.get_attribute('href')
    if href:
        print(href)

driver.quit()
