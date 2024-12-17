import threading
import random
import mysql.connector
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from time import sleep
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys  

# This will load env variables
load_dotenv() 

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="sdp_project"
)

#Autocommit is set to True, so everything will get autocomitted by default
mydb.autocommit = True
mycursor = mydb.cursor()

def get_scheduled_messages():
    query = "SELECT fd.users_email, fd.users_password, fa.account_name, fd.message, fd.port_value, fd.id FROM facebook_dms fd JOIN facebook_accounts fa ON fd.recipients_id = fa.id WHERE fd.status = 'Scheduled'"
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
            # First, check if that user email already has somewhere else a db port in the db
            # If it has then use the same port, otherwise create a new one port
            query = "SELECT port_value FROM facebook_dms WHERE users_email = %s"
            #This %s needs a tuple as a parameter so below where the user_email is the only parameter
            # comma should be put behind it to mimic the behavior of a tuple
            mycursor.execute(query, (user_email, ))
            users_port_value = mycursor.fetchone()
            #Perhaps, this one port has been previously used multiple times by the user email so it is enough just to extract it once when we reach it
            if users_port_value:
                #Extract the exact value from the tuple
                users_port_value = users_port_value[0]
                print("This ", user_email, " already has an existing port valu ", users_port_value, ". Therefore this one will be used.")
            else:
                #If this user email has never had a port before, a new one will get generated foor the user
                users_port_value = generate_new_port()
            
            # Clear any unread results
            # Because above I had mycursor.fetchone() all rows got returned, but only one got read
            # There are other rows that are stuck inbetween and that are nto read, but the cursor is filled with them so it cannot execute other queries
            # So, with the statement below, we are reading rows that were left behind, and cčeaning the cursor so we can go on with the query
            mycursor.fetchall()

            # Update the record with the new unique port value or the one that already existed
            update_query = "UPDATE facebook_dms SET port_value = %s WHERE users_email = %s"
            mycursor.execute(update_query, (users_port_value, user_email))
          

    query2 ="SELECT fd.users_email, fd.users_password, fa.account_name, fd.message, fd.port_value, fd.id FROM facebook_dms fd JOIN facebook_accounts fa ON fd.recipients_id = fa.id WHERE fd.status = 'Scheduled'"
    mycursor.execute(query2)
    results2 = mycursor.fetchall()

    return results2  

def generate_new_port():
    while True:
        # Generate a new port value
        new_port = random.randint(100, 10000)
        # Check if this port is unique
        mycursor.execute("SELECT COUNT(*) FROM facebook_dms WHERE port_value = %s", (new_port,))
        if mycursor.fetchone()[0] == 0:
            # Port is unique, return it
            return new_port

def get_unique_senders():
    query = "SELECT users_email FROM facebook_dms WHERE status = 'Scheduled' GROUP BY users_email;"
    mycursor.execute(query)
    return mycursor.fetchall()

def no_of_messages_per_user():
    query = "SELECT users_email, COUNT(message) FROM facebook_dms WHERE status = 'Scheduled' GROUP BY users_email;"
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
            elements = driver.find_element(By.XPATH, "/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[1]/div[2]/div/div/div/div[4]/div/div/div[2]/div/div/div")
            print(elements.text)
            
            return True
    except:
        return -1
    

def send_dm(driver, fb_username, message):
    message_sent = False 

    for _ in range(7):

        try:
            messages_button = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.XPATH, "//span[contains(@class, 'x1lliihq') and contains(@class, 'x6ikm8r') and contains(@class, 'x10wlt62') and contains(@class, 'x1n2onr6') and contains(@class, 'xlyipyv') and contains(@class, 'xuxw1ft')]"))
            )
            print(len(messages_button))
            for message_button in messages_button:
                print(message_button.text)

                sleep(10)
           

                if message_button.text == "Poruka" or message_button.text == "Message":
                    message_button.click()

                    sleep(3)  

                    send_message_field = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'xzsf02u') and contains(@class, 'x1a2a7pz') and contains(@class, 'x1n2onr6') and contains(@class, 'x14wi4xw')]"))
                    )

                    sleep(3)

                    send_message_field.send_keys(message)
                    send_message_field.send_keys(Keys.ENTER)

                    sleep(3)  
                    message_sent = True
                    return 1

                else :
                    print("Poruka button is not found.")
                    

        except TimeoutException:
            print(f"Message button or message field not found for {fb_username}.")
            return -1

def find(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1

def send_bulk_dms(sender):
    service = Service(executable_path="C:\\Users\\DT User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=' + sender["port"]) 
    options.add_argument('--user-data-dir=C:\selenum\ChromeProfile' + sender["port"]) 
    options.add_argument('disable-popup-blocking')
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    
    driver.get("https://www.facebook.com/")

    sleep(3)

    check_login_results = check_if_logged_in(driver)

    if check_login_results == False:
        log_in(driver, sender["sender"], sender["password"])

    sleep(3)

    successfully_sent_messages = []

    for message in sender["messages"]:

        check_fb_account_exists_result = check_fb_account_existence(driver, message[0])

        if  check_fb_account_exists_result == False:
                exit()
        #if the username does not exist, just exit

        sleep(3)
        if (send_dm(driver, message[0], message[1])) :
            successfully_sent_messages.append(message)

    driver.quit()
    return successfully_sent_messages

def find(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1

def change_message_status_to_sent(messages):
    id_list = []
    for message in messages:
        message_id = message[2]  
        id_list.append(message_id)
        #  
    id_list_str = ','.join(map(str, id_list))
    query = "UPDATE facebook_dms SET status = 'Sent' WHERE id IN (" + id_list_str + ")"
    mycursor.execute(query)
    mydb.commit()

def main():

    # fb_email = "korman.ajla115@gmail.com"
    # fb_password = "lalesuzute115"
    # fb_username = "suada.korman"

    messages = get_scheduled_messages()
    messages = tuple(messages)

    dms_to_send = []

    for message in messages:
        if not any(d['sender'] == message[0] for d in dms_to_send):
            dms_to_send.append({
                "sender" : message[0],
                "password" : message[1],
                "port" : message[4],
                "messages" : [(message[2], message[3], message[5])]
            })
        else:
            index = find(dms_to_send, "sender", message[0])
            dms_to_send[index]["messages"].append((message[2], message[3], message[5]))
        print(message)

    threads = []
    all_successfully_sent_messages = []

    for sender in dms_to_send:
        thread = threading.Thread(target=lambda s=sender: all_successfully_sent_messages.extend(send_bulk_dms(s)))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    change_message_status_to_sent(all_successfully_sent_messages)
    print("All scheduled messages are successfully sent.")


    # for sender in dms_to_send:
    #     threads.append(threading.Thread(target=send_bulk_dms, args=(sender,)))
    #     threads[counter].start()
    #     counter += 1

    # for thread in threads:
    #     thread.join()


if __name__ == "__main__":

    main()


    # if not (check_if_logged_in(driver)):
    #     log_in(driver, fb_email, fb_password)

    # if not (check_fb_account_existence(driver, fb_username)):
    #     exit()

    # send_dm(driver, fb_username, "This is an automated message.")

