#Import needed to connect to the database
import mysql.connector

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

hashtag = input("Enter desired hashtag you want to search for: ") 

#Kad budem radila frontend, onda preko frontenda uzimati tacne podatke za hashtags ovdje
#Prvo spasiti hashtags u varijablu u bazu podataka pa onda odatle vuci podatke
# mycursor.execute("SELECT hashtag_name FROM instagram_hashtags LIMIT 1")
# myresult = mycursor.fetchone()

# for data in myresult:
#   print(data)
# #this will print me just one outcome, because I only have one user with this name

service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)
driver.maximize_window()

#Login part
insta_url = 'https://www.instagram.com/'
driver.get(insta_url)

sleep(1)

USERNAME = os.environ['IGUSERNAME']
PASSWORD = os.environ['PASSWORD']

#this username is the name of the HTML element, there was no id
#I accessed it through the CSS Selector then
username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
username_field.send_keys(USERNAME)

sleep(1)

#this password is the name of the HTML element, there was no id
password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
password_field.send_keys(PASSWORD)

sleep(1)

login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
login_button.click()

sleep(10) # --> to ensure that page has loaded properly

hashtags_url = 'https://www.instagram.com/explore/tags/'
# hashtag = 'fitness'
driver.get(hashtags_url + hashtag) # --> accessing specific hashtag page
sleep(5)

#open first post
first_post = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH,  "//*[@id='mount_0_0_VY']/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/article/div/div/div/div[1]/div[1]/a")))
first_post.click()

sleep(5)
# #ul - unordered list
# #li - list item
# ul = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "ul")))
# items = ul.find_elements(By.TAG_NAME, "li")
# statistics = []

# for li in items:
#     text = li.text
#     numbers = re.findall(r'\d+', text)
    
#     for number in numbers:
#        statistics.append(number) #I have three different numbers, and I need to save all of them
#        #print(number)

# sql = "UPDATE instagram_accounts SET post_number = %s, followers_number = %s, followings_number = %s, date_and_time = %s, stats = %s WHERE username = %s"
# #current_timestamp = time.time()
# current_date = date.today()
         
# #posts, followers, following, time of web scrapping, and number 1 to indicate that this username is written like this, and connects to this data
# values = (statistics[0], statistics[1], statistics[2], current_date, 1, "korman_ajla") 
# #I had to put username here in the values, because in the insert into sql stmt I had problem with ' " (triple unintended quotes) at the end
# mycursor.execute(sql, values)

# mydb.commit() #needed to save the change, without it, is like we never changed anything

#print("Came to the end")





