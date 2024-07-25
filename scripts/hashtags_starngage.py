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

def getActiveHashtagsFromUsersHashtags():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()
    mycursor.execute("SELECT hashtags_id FROM users_hashtags WHERE status = 'active'")
    active_hashtags = mycursor.fetchall()
    mycursor.close()
    mydb.close()
    return [hashtag[0] for hashtag in active_hashtags]

def checkHashtagInAccountsWithHashtagTable(hashtag_id):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="a1b2c3d4e5",
        database="sdp_project"
    )
    mycursor = mydb.cursor()
    sql = "SELECT COUNT(*) FROM accounts_with_hashtag WHERE hashtag_id = %s"
    val = (hashtag_id,)
    mycursor.execute(sql, val)
    count = mycursor.fetchone()[0]
    mycursor.close()
    mydb.close()
    return count > 0

def main():
    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    

    # Login part
    # insta_url = 'https://www.instagram.com/'
    # driver.get(insta_url)
    # sleep(1)

    # USERNAME = os.environ['IGUSERNAME']
    # PASSWORD = os.environ['PASSWORD']

    # username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
    # username_field.send_keys(USERNAME)
    # sleep(1)

    # password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
    # password_field.send_keys(PASSWORD)
    # sleep(1)

    # login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
    # login_button.click()
    # sleep(10)

    # Fetch all active hashtags from users_hashtags table
    active_hashtags_ids = getActiveHashtagsFromUsersHashtags()
    print(f"Extracted all active hashtags from the users_hashtags table: {active_hashtags_ids}")

    hashtags_url = 'https://app.brandmentions.com/h/k/'

    for hashtag_id in active_hashtags_ids:
        if not checkHashtagInAccountsWithHashtagTable(hashtag_id):
            print(f"Hashtag ID {hashtag_id} is not mentioned in the accounts_with_hashtags table.")

            # Fetch the hashtag name from the instagram_hashtags table
            mydb = mysql.connector.connect(
                host="localhost",
                user="root",
                password="a1b2c3d4e5",
                database="sdp_project"
            )
            mycursor = mydb.cursor()
            sql = "SELECT hashtag_name FROM instagram_hashtags WHERE id = %s"
            val = (hashtag_id,)
            mycursor.execute(sql, val)
            hashtag_name = mycursor.fetchone()[0]
            mycursor.close()
            mydb.close()

            print(f"Working with hashtag: {hashtag_name}")
            try:
                driver.get(hashtags_url + hashtag_name)
                sleep(10)

                extracted_usernames = []

                # Scroll to the table
                table_element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[4]/div[1]/div[2]/div[1]/div[2]/div[6]/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/div[1]/div[2]"))
                )
                actions = ActionChains(driver)
                actions.move_to_element(table_element).perform()
                sleep(3)

                # Extract usernames from the table
                for i in range(1, 6): 
                    instagram_post = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[4]/div[1]/div[2]/div[1]/div[2]/div[6]/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/div[1]/div[2]"))
                )
                    instagram_post.click()

                    sleep(10)
                    ig_post_element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[4]/div[1]/div[2]/div[1]/div[2]/div[6]/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/div[2]/div/div/div/div[2]/div[2]/div[1]"))
                )
                    actions = ActionChains(driver)
                    actions.move_to_element(ig_post_element).perform()

                    ig_post_element2 = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[4]/div[1]/div[2]/div[1]/div[2]/div[6]/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/div[2]/div/div/div/div[2]/div[3]/div[2]/div[2]"))
                )
                    actions = ActionChains(driver)
                    actions.move_to_element(ig_post_element2).perform()
                    sleep(10)

                #     instagram_post_link = WebDriverWait(driver, 10).until(
                #     EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div[4]/div[1]/div[2]/div[1]/div[2]/div[6]/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/div[2]/div/div/div/div[2]/div[2]/div[2]"))
                # )

                    #instagram_post_link.click()
            #         username_element = WebDriverWait(driver, 10).until(
            #             EC.presence_of_element_located((By.XPATH, username_xpath))
            #         )
            #         extracted_usernames.append(username_element.text.replace('@', ''))

            except Exception as e:
                print(f"Error occurred while processing hashtag '{hashtag_name}': {e}")
                #continue

            # print(f"Extracted usernames for hashtag '{hashtag_name}': {extracted_usernames}")

            # addUsernamesToTheDatabase(extracted_usernames)
            # addAccountsAndHashtagsToCombinedTable(hashtag_name, extracted_usernames)

            # # Add to users_accounts table
            # mydb = mysql.connector.connect(
            #     host="localhost",
            #     user="root",
            #     password="a1b2c3d4e5",
            #     database="sdp_project"
            # )
            # mycursor = mydb.cursor()

            # for username in extracted_usernames:
            #     sql = "SELECT id FROM instagram_accounts WHERE username = %s AND activity = 'active'"
            #     val = (username,)
            #     mycursor.execute(sql, val)
            #     account_id = mycursor.fetchone()[0]  # Extracting the ID from the tuple

            #     # Fetch the users_id from users_hashtags
            #     sql = "SELECT users_id FROM users_hashtags WHERE hashtags_id = %s"
            #     val = (hashtag_id,)
            #     mycursor.execute(sql, val)
            #     users_id = mycursor.fetchone()[0]  # Extracting the ID from the tuple

            #     # Insert into users_accounts table
            #     sql = "INSERT INTO users_accounts (users_id, accounts_id, status) VALUES (%s, %s, 'active')"
            #     val = (users_id, account_id)
            #     mycursor.execute(sql, val)
            #     mydb.commit()

            # mycursor.close()
            # mydb.close()

            # print(f"Completed processing for hashtag: {hashtag_name}\n")

    driver.quit()

if __name__ == '__main__':
    main()
