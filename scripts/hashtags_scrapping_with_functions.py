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
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

load_dotenv() #--> this will load env variables

# def addAccountsAndHashtagsToCombinedTable(hashtag, extracted_usernames):
#     # Connect to the database
#     mydb = mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="a1b2c3d4e5",
#         database="sdp_project"
#     )
#     mycursor = mydb.cursor()

#     # Fetch the hashtag id 
#     sql = "SELECT id FROM instagram_hashtags WHERE hashtag_name = %s"
#     val = (hashtag,)
#     mycursor.execute(sql, val)
#     hashtag_id = mycursor.fetchone()

#     username_ids = []
#     #Fetch the username ids
#     for username in extracted_usernames:
#         sql = "SELECT id FROM instagram_accounts WHERE username = %s"
#         val = (username,)
#         mycursor.execute(sql, val)
#         username_id = mycursor.fetchall()
#         username_ids.append(username_id)

#     # Check existing pairs in accounts_with_hashtags table
#     mycursor.execute("SELECT account_id, hashtag_id FROM accounts_with_hashtags")
#     existing_pairs = mycursor.fetchall()

#     # Inserting into accounts_with_hashtags table
#     for username_id in username_ids:
#             if (username_id, hashtag_id) not in existing_pairs:
#                 sql = "INSERT INTO accounts_with_hashtags (account_id, hashtag_id) VALUES (%s, %s)"
#                 val = (username_id, hashtag_id)
#                 mycursor.execute(sql, val)
#                 mydb.commit()

#     # Close cursor and connection
#     mycursor.close()
#     mydb.close()

def addAccountsAndHashtagsToCombinedTable(hashtag, extracted_usernames):
    # Connect to the database
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()

    # Fetch the hashtag id
    sql = "SELECT id FROM instagram_hashtags WHERE hashtag_name = %s"
    val = (hashtag,)
    mycursor.execute(sql, val)
    hashtag_id = mycursor.fetchone()[0]  # Extracting the ID from the tuple

    # Fetch the username ids
    username_ids = []
    for username in extracted_usernames:
        sql = "SELECT id FROM instagram_accounts WHERE username = %s"
        val = (username,)
        mycursor.execute(sql, val)
        username_id = mycursor.fetchone()
        if username_id:  # Only append if the username exists
            username_ids.append(username_id[0])  # Extracting the ID from the tuple

    # Check existing pairs in accounts_with_hashtags table
    mycursor.execute("SELECT account_id, hashtag_id FROM accounts_with_hashtag")
    existing_pairs = mycursor.fetchall()

    # Inserting into accounts_with_hashtags table
    for username_id in username_ids:
        if (username_id, hashtag_id) not in existing_pairs:
            sql = "INSERT INTO accounts_with_hashtag (account_id, hashtag_id) VALUES (%s, %s)"
            val = (username_id, hashtag_id)
            mycursor.execute(sql, val)
            mydb.commit()

    # Close cursor and connection
    mycursor.close()
    mydb.close()



# Function to add usernames to the database
def addUsernamesToTheDatabase(extracted_usernames):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()

    for username in extracted_usernames:
        sql = "SELECT id FROM instagram_accounts WHERE username = %s"
        val = (username,)
        mycursor.execute(sql, val)
        result = mycursor.fetchone()

        if not result:
            sql = "INSERT INTO instagram_accounts (username, stats, activity) VALUES (%s, 0, 'active')"
            val = (username, )
            mycursor.execute(sql, val)
            mydb.commit()

    mycursor.close()
    mydb.close()

# Function to add hashtags to the database
def addHashtagToTheDatabase(hashtag):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()

    sql = "SELECT * FROM instagram_hashtags WHERE hashtag_name = %s AND activity != 'deleted'"
    val = (hashtag,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()

    if not result:
        # Check if the hashtag exists but is marked as deleted
        sql = "SELECT * FROM instagram_hashtags WHERE hashtag_name = %s"
        mycursor.execute(sql, val)
        result_deleted = mycursor.fetchone()

        if result_deleted:
            # Update the record if it exists but is marked as deleted
            sql = "UPDATE instagram_hashtags SET activity = 'active' WHERE hashtag_name = %s"
            print(f"Hashtag '{hashtag}' was marked as deleted and has now been reactivated.")
        else:
            # Insert the new hashtag into the database
            sql = "INSERT INTO instagram_hashtags (hashtag_name, activity) VALUES (%s, 'active')"
            print(f"Hashtag '{hashtag}' added to the database.")

        mycursor.execute(sql, val)
        mydb.commit()

    else:
        print(f"Hashtag '{hashtag}' already exists in the database and is active.")

    mycursor.close()
    mydb.close()
 

def addHashtagToTheDatabase(hashtag):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()

    # Check if the hashtag exists and is not marked as deleted
    sql = "SELECT * FROM instagram_hashtags WHERE hashtag_name = %s AND activity != 'deleted'"
    val = (hashtag,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()

    if not result:
        # Check if the hashtag exists but is marked as deleted
        sql = "SELECT * FROM instagram_hashtags WHERE hashtag_name = %s"
        mycursor.execute(sql, val)
        result_deleted = mycursor.fetchone()
        
        if result_deleted:
            # Update the record if it exists but is marked as deleted
            sql = "UPDATE instagram_hashtags SET activity = 'active' WHERE hashtag_name = %s"
            print(f"Hashtag '{hashtag}' was marked as deleted and has now been reactivated.")
        else:
            # Insert the new hashtag into the database
            sql = "INSERT INTO instagram_hashtags (hashtag_name, activity) VALUES (%s, 'active')"
            print(f"Hashtag '{hashtag}' added to the database.")

        mycursor.execute(sql, val)
        mydb.commit()

    else:
        print(f"Hashtag '{hashtag}' already exists in the database and is active.")

    mycursor.close()
    mydb.close()

def main(): 

    hashtag = input("Enter desired hashtag you want to search for: ") 
    addHashtagToTheDatabase(hashtag)

    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver.exe")
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
    driver.get(hashtags_url + hashtag) # --> accessing specific hashtag page


    #access first three rows of posts under hashtag
    ##posts = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "x1i10hfl")))

    extracted_usernames = []
    sleep(5)

    picture1 = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/article/div/div/div/div[1]/div[1]/a')))
    picture1.click()

    sleep(5)
    for i in range(10):
        sleep(5)
        #repeat the whole process 10 times, so that we ge ten most recent usernames under each hashtag
        username_prompt = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe.x1qjc9v5.xjbqb8w.x1lcm9me.x1yr5g0i.xrt01vj.x10y3i5r.xr1yuqi.xkrivgy.x4ii5y1.x1gryazu.x15h9jz8.x47corl.xh8yej3.xir0mxb.x1juhsu6 > div > article > div > div.x1qjc9v5.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x78zum5.xdt5ytf.x1iyjqo2.x5wqa0o.xln7xf2.xk390pu.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x65f84u.x1vq45kp.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x11njtxf > div > div > div.x78zum5.xdt5ytf.x1q2y9iw.x1n2onr6.xh8yej3.x9f619.x1iyjqo2.x18l3tf1.x26u7qi.xy80clv.xexx8yu.x4uap5.x18d9i69.xkhd6sd > div.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x2lwn1j.x1odjw0f.x1n2onr6.x9ek82g.x6ikm8r.xdj266r.x11i5rnm.x4ii5y1.x1mh8g0r.xexx8yu.x1pi30zi.x18d9i69.x1swvt13 > ul > div.x1qjc9v5.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x78zum5.xdt5ytf.x2lah0s.xk390pu.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.xggy1nq.x11njtxf > li > div > div > div._a9zr > h2 > div > span > div > a")))


        link_to_username = username_prompt.get_attribute('href') 
        #here, it prints it in the form of https://www.instagram.com/team_falchetta_/
        #the first 25 characters are the ig url, and I will just slice or slip that so I will use just the actual name

        actual_username = link_to_username.split('/')


        extracted_usernames.append(actual_username[3])
        #this just gives me the actual username 

        sleep(5)
        # next_arrow_button =  WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div:nth-child(1) > div > div > div > button")))
        # next_arrow_button.click()
        actions = ActionChains(driver)
        actions.send_keys(Keys.RIGHT).perform()
        sleep(5)

    #print(extracted_usernames)
    addUsernamesToTheDatabase(extracted_usernames)

    addAccountsAndHashtagsToCombinedTable(hashtag, extracted_usernames)



if __name__ == '__main__':
    main()