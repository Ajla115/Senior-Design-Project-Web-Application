import threading
import random
import mysql.connector
from time import sleep
from dotenv import load_dotenv
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
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
    query = "SELECT ud.users_email, ud.users_password, ia.username, ud.message, ud.port_value, ud.id FROM users_dms ud JOIN instagram_accounts ia ON ud.recipients_id = ia.id WHERE ud.status = 'Scheduled'"
    mycursor.execute(query)
    results = mycursor.fetchall()

    if not results:
        print("No scheduled messages found therefore nothing can be sent to anybody.")
        exit()  

    for result in results:
        port_value = result[4] 
        user_email = result[0]

        if port_value is None or port_value == '':
            print("Port value is missing for certain DM sendings, therefore first that will get solved.")
            
            # Generate a unique new port
            # First, check if that user email already has somewhere else a db port in the db
            # If it has then use the same port, otherwise create a new one port

            query = "SELECT port_value FROM users_dms WHERE users_email = %s"
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
            update_query = "UPDATE users_dms SET port_value = %s WHERE users_email = %s"
            mycursor.execute(update_query, (users_port_value, user_email))
          

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
     

def log_in(driver, ig_username, ig_password):

    username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
    username_field.send_keys(ig_username)

    sleep(3)

    password_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'password')))
    password_field.send_keys(ig_password)

    sleep(3)

    login_button = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="loginForm"]/div/div[3]/button')))
    login_button.click()

    sleep(15)

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
            EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'x1lliihq') and contains(@class, 'x1plvlek')]"))
        )
        check_title_text = check_title_element.text
        if check_title_text == "Sorry, this page isn't available.":
            print("Username does not exist. Exiting...")
            return False
        else:
            print("Username exists. Proceeding with further action.")
            return True
    except:
        return -1

def check_if_logged_in(driver):
    try:
        username_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, 'username')))
        print("Nobody is logged in.")
        return False
    except TimeoutException:
        print("Already logged in.")
        return True
    
def send_dm(driver, username, message):

    try:

        message_button = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'x1gjpkn9') and contains(@class, 'x5n08af')]")))
        message_button.click()

        sleep(7)

        #Part to turn off notifications if it appears
        try:
            turn_off_notifications = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, "//button[contains(@class, '_a9--') and contains(@class, '_ap36') and contains(@class, '_a9_1')]")))
            
            turn_off_notifications.click()
        except :
            print("There is no notifications prompt so just continue regularly.")
    

        message_input_field = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'xzsf02u') and contains(@class, 'x1a2a7pz')]")))
        
        message_input_field.click()
        message_input_field.send_keys(message)
        message_input_field.send_keys(Keys.ENTER)

        sleep(3)
        return True 
    #Flag to indicate that the message has been sent
    except:
        print("Failed to sent message ", message, " to ", username)
        return False


def instagram_driver(sender, password, recipient, message,  port_value):

    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=' + port_value) 
    options.add_argument('--user-data-dir=C:\selenum\ChromeProfile' + port_value) 
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    insta_url = 'https://www.instagram.com/'
    driver.get(insta_url)
   
    sleep(3)

    check_login_results = check_if_logged_in(driver)

    if check_login_results == False:
        log_in(driver, sender, password)

    sleep(3)

    check_username_exists_result = check_username_exists(driver, recipient)

    if  check_username_exists_result == False:
            exit()
    #if the username does not exist, just exit

    sleep(3)

    send_dm(driver, recipient, message)

    driver.quit()

def send_bulk_dms(sender):
    service = Service(executable_path="C:\\Users\\DT User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=' + sender["port"]) 
    options.add_argument('--user-data-dir=C:\selenum\ChromeProfile' + sender["port"]) 
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    insta_url = 'https://www.instagram.com/'
    driver.get(insta_url)

    sleep(3)

    check_login_results = check_if_logged_in(driver)

    if check_login_results == False:
        log_in(driver, sender["sender"], sender["password"])

    sleep(3)

    successfully_sent_messages = []

    for message in sender["messages"]:

        check_username_exists_result = check_username_exists(driver, message[0])

        if  check_username_exists_result == False:
                exit()
        #if the username does not exist, just exit

        sleep(3)

        #For all messages that were successfully sent, and where the return value was True, append that whole message to the list
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

    id_list_str = ','.join(map(str, id_list))
    query = "UPDATE users_dms SET status = 'Sent' WHERE id IN (" + id_list_str + ")"
    mycursor.execute(query)
    
def main():

    messages = get_scheduled_messages()
    messages= tuple(messages)

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
    counter = 0

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
