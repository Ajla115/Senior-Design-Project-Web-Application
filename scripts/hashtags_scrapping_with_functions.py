import mysql.connector
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

load_dotenv()  # Load environment variables

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
        sql = "SELECT id FROM instagram_accounts WHERE username = %s AND activity = 'active'"
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

def addUsernamesToTheDatabase(extracted_usernames):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()

    for username in extracted_usernames:
        sql = "SELECT id FROM instagram_accounts WHERE username = %s AND activity = 'active'"
        val = (username,)
        mycursor.execute(sql, val)
        result = mycursor.fetchone()

        if not result:
            sql = "INSERT INTO instagram_accounts (username, stats, activity) VALUES (%s, 0, 'active')"
            val = (username,)
            mycursor.execute(sql, val)
            mydb.commit()

    mycursor.close()
    mydb.close()

def getActiveHashtagsFromDatabase():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT hashtag_name FROM instagram_hashtags WHERE activity = 'active'")
    hashtags = mycursor.fetchall()
    mycursor.close()
    mydb.close()
    return [hashtag[0] for hashtag in hashtags]

def main():
    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    # Login part
    insta_url = 'https://www.instagram.com/'
    driver.get(insta_url)
    sleep(1)

    USERNAME = os.environ['IGUSERNAME']
    PASSWORD = os.environ['PASSWORD']

    username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
    username_field.send_keys(USERNAME)
    sleep(1)

    password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
    password_field.send_keys(PASSWORD)
    sleep(1)

    login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
    login_button.click()
    sleep(10)

    # Fetch all active hashtags from the database
    active_hashtags = getActiveHashtagsFromDatabase()
    print(f"Extracted all active hashtags from the database: {active_hashtags}")

    hashtags_url = 'https://www.instagram.com/explore/tags/'

    for hashtag in active_hashtags:
        print(f"Working with hashtag: {hashtag}")
        driver.get(hashtags_url + hashtag)
        sleep(5)

        extracted_usernames = []

        picture1 = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '/html/body/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div[2]/section/main/article/div/div/div/div[1]/div[1]/a')))
        picture1.click()
        sleep(5)

        for i in range(10):
            sleep(5)
            username_prompt = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe.x1qjc9v5.xjbqb8w.x1lcm9me.x1yr5g0i.xrt01vj.x10y3i5r.xr1yuqi.xkrivgy.x4ii5y1.x1gryazu.x15h9jz8.x47corl.xh8yej3.xir0mxb.x1juhsu6 > div > article > div > div.x1qjc9v5.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x78zum5.xdt5ytf.x1iyjqo2.x5wqa0o.xln7xf2.xk390pu.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x1pi30zi.x18d9i69.x1swvt13 > ul > div.x1qjc9v5.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x78zum5.xdt5ytf.x2lah0s.xk390pu.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.xggy1nq.x11njtxf > li > div > div > div._a9zr > h2 > div > span > div > a")))

            link_to_username = username_prompt.get_attribute('href')
            actual_username = link_to_username.split('/')[3]
            extracted_usernames.append(actual_username)

            sleep(5)
            actions = ActionChains(driver)
            actions.send_keys(Keys.RIGHT).perform()
            sleep(5)

        print(f"Extracted usernames for hashtag '{hashtag}': {extracted_usernames}")

        addUsernamesToTheDatabase(extracted_usernames)
        addAccountsAndHashtagsToCombinedTable(hashtag, extracted_usernames)
        print(f"Completed processing for hashtag: {hashtag}\n")

    driver.quit()

if __name__ == '__main__':
    main()
