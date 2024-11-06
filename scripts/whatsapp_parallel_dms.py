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
from selenium.webdriver.remote.webelement import WebElement

# This will load env variables
load_dotenv() 
global sent_messages_id_list
sent_messages_id_list = []

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="sdp_project"
)

mycursor = mydb.cursor()

def get_scheduled_messages():
    query = "SELECT wd.users_phone_number,  wc.phone_number, wd.message, wd.port_value, wd.id FROM whatsapp_dms wd JOIN whatsapp_contacts wc ON wd.recipients_id = wc.id WHERE wd.status = 'Scheduled'"
    mycursor.execute(query)
    results = mycursor.fetchall()

    if not results:
        print("No scheduled messages found.")
        exit()  

    for result in results:
        port_value = result[3] 
        users_phone_number = result[0]

        if port_value is None or port_value == '':
            print("Port value is missing, creating a new port first...")
            
            # Generate a unique new port
            new_port_value = generate_new_port()
            
            # Update the record with the new unique port value
            update_query = "UPDATE whatsapp_dms SET port_value = %s WHERE users_phone_number = %s"
            mycursor.execute(update_query, (new_port_value, users_phone_number))
            mydb.commit()
            print("Newport has been cretaed, and committe to database.\n Now fetching all scheduled messages.")

    query2 = "SELECT wd.users_phone_number,  wc.phone_number, wd.message, wd.port_value, wd.id FROM whatsapp_dms wd JOIN whatsapp_contacts wc ON wd.recipients_id = wc.id WHERE wd.status = 'Scheduled'"
    mycursor.execute(query2)
    results2 = mycursor.fetchall()

    return results2

def generate_new_port():
    while True:
        # Generate a new port value
        new_port = random.randint(100, 10000)
        # Check if this port is unique
        mycursor.execute("SELECT COUNT(*) FROM whatsapp_dms WHERE port_value = %s", (new_port,))
        if mycursor.fetchone()[0] == 0:
            # Port is unique, return it
            return new_port


def find(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1

def check_if_registered(driver):
    try: 
        website_title= WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'xjpr12u') and contains(@class, 'x1lkfr7t') and contains(@class, 'xdbd6k5') and contains(@class, 'x1fcty0u') and contains(@class, ' xw2npq5')]"
    )))

        if website_title.text == "Download WhatsApp for Windows" or website_title.text == "Preuzmite WhatsApp za Windows":
            print("User needs to register phone number by scanning QR Code.")
            return False

    except TimeoutException:
        print("User account is already setup.Therefore only messages will be sent.")
        return True
    
def register_with_phone(driver, users_phone_number):
    sleep(60) #wait one minute for user to scan and connect
    try: 
        website_title = WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, '//h1[contains(@class, "x1qlqyl8") and contains(@class, "x1pd3egz") and contains(@class, "xcgk4ki")]')))
        if website_title.text == "Razgovori" or website_title.text == "Chats":
            print("User has successfully registered.")
    except TimeoutError:
        print("User has not registered.")

#     link_with_phone_number = WebDriverWait(driver, 10).until(
#                                 EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'x1n68mz9')]"
#         )))

#     link_with_phone_number.click()

    
#     choose_country = WebDriverWait(driver, 10).until(
#                         EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'xurb0ha')]"
# )))
    
#     current_selected_country =  WebDriverWait(driver, 10).until(
#                         EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'x78zum5') and contains(@class, 'x6s0dn4') and contains(@class, 'x3pnbk8') and contains(@class, 'xfex06f') and contains(@class, 'x1f6kntn')]"
# )))
    
#     if current_selected_country.text == "Bosnia & Herzegovina":

#         enter_phone_number = WebDriverWait(driver, 10).until(
#                 EC.presence_of_element_located((By.XPATH, "//input[contains(@class, 'x1n2onr6') and contains(@class, 'xy9n6vp') and contains(@class, 'x1n327nk') and contains(@class, 'xh8yej3') and contains(@class, 'x972fbf')]"
#         )))

#         enter_phone_number.send_keys(users_phone_number)

#         correct_button_clicked_flag = False

#         for _ in range(10): 

#             try: 

#                 next_button = WebDriverWait(driver, 10).until(
#                         EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div[2]/div[3]/div[1]/div/div[3]/div[2]/button/div/div")))

#                 print(next_button.text)
#                 if next_button.text == "Next":
#                     next_button.click()
#                     correct_button_clicked_flag = True
                    
#                 else:
#                     print("Next button is not found.")

#             except TimeoutException:
#                 print("Timeout exception reached.")


def send_bulk_dms(sender):
    service = Service(executable_path="C:\\Users\\DT User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=' + sender["port"]) 
    options.add_argument('--user-data-dir=C:\selenum\ChromeProfile' + sender["port"]) 
    options.add_argument('disable-popup-blocking')
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    
    driver.get("https://web.whatsapp.com/")

    sleep(15)

    if check_if_registered(driver) == False:
        register_with_phone(driver, sender["sender"])

    sleep(15)

    for message in sender["messages"]:

        sleep(3)

        send_dm(driver, message[0], message[1], message[2])

    driver.quit()

def send_dm(driver, recipient_phone_number, message, message_id):

    search_phone_number = WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, "//p[contains(@class, 'selectable-text') and contains(@class, 'copyable-text') and contains(@class, 'x15bjb6t') and contains(@class, 'x1n2onr6')]"
    )))

    search_phone_number.send_keys(recipient_phone_number)
    search_phone_number.send_keys(Keys.ENTER)

    try:
        check_phone_number_existence = WebDriverWait(driver, 10).until(
                                    EC.presence_of_element_located((By.XPATH, "//div[contains(@role, 'listitem')]"
        )))

    except:
        print("Number does not exist.")
        #dodati funkciju da napise da je broj invalid u bazu
        exit()

    choose_number = WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, "//p[contains(@class, 'selectable-text') and contains(@class, 'copyable-text') and contains(@class, 'x15bjb6t') and contains(@class, 'x1n2onr6')]"
    )))

    print(choose_number.text)

    message_fields = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//div[contains(@class, 'x1n2onr6') and contains(@class, 'xh8yej3') and contains(@class, 'lexical-rich-text-input')]")
            )
        )

    for message_field in message_fields:

        print(message_field.text)
        
        if (message_field.text == "Upišite poruku" or message_field.text == "Type a message"):
            p_element = message_field.find_element(By.TAG_NAME, "p")
            p_element.send_keys(message)
            p_element.send_keys(Keys.ENTER)   
            sleep(10)  

            sent_messages_id_list.append(message_id)

def change_message_status_to_sent(sent_messages_id_list):
    if sent_messages_id_list:
        # Convert the list of IDs into a comma-separated string
        id_list_str = ','.join(map(str, sent_messages_id_list))
        # Form the query string with the IDs directly
        query = f"UPDATE whatsapp_dms SET status = 'Sent' WHERE id IN ({id_list_str})"
        mycursor.execute(query)
        mydb.commit()
        print("Updated status of messages with IDs: ", sent_messages_id_list)
    else:
        print("No messages were sent, skipping status update.")

def main():
    
    messages = get_scheduled_messages()
    messages = tuple(messages)

    print(messages)

    dms_to_send = []

    for message in messages:
        if not any(d['sender'] == message[0] for d in dms_to_send):
            dms_to_send.append({
                "sender" : message[0],
                "port" : message[3],
                "messages" : [(message[1], message[2], message[4])]
            })
        else:
            index = find(dms_to_send, "sender", message[0])
            dms_to_send[index]["messages"].append((message[1], message[2], message[4]))

    threads = []
    counter = 0

    for sender in dms_to_send:
        threads.append(threading.Thread(target=send_bulk_dms, args=(sender,)))
        threads[counter].start()
        counter += 1

    for thread in threads:
        thread.join()

    change_message_status_to_sent(sent_messages_id_list)

    print("Sending of all messages is completely done.")

if __name__ == "__main__":

    main()


 