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

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="sdp_project"
)
mycursor = mydb.cursor()   

def send_a_message(driver, recipient_phone_number, message):
    print("Uslo u ovu funkciju.")

    search_phone_number = WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, "//p[contains(@class, 'selectable-text') and contains(@class, 'copyable-text') and contains(@class, 'x15bjb6t') and contains(@class, 'x1n2onr6')]"
    )))

    print("Uslo u ovu funkciju1.")

    search_phone_number.send_keys(recipient_phone_number)
    search_phone_number.send_keys(Keys.ENTER)

    print("Uslo u ovu funkciju2.")

    try:
        check_phone_number_existence = WebDriverWait(driver, 10).until(
                                    EC.presence_of_element_located((By.XPATH, "//div[contains(@role, 'listitem')]"
        )))
    except:
        print("Number does not exist.")
        exit()


    print("Uslo u ovu funkciju4.")
    
    choose_number = WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, "//p[contains(@class, 'selectable-text') and contains(@class, 'copyable-text') and contains(@class, 'x15bjb6t') and contains(@class, 'x1n2onr6')]"
    )))

    print(choose_number.text)

    print("Demo")

    message_fields = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//div[contains(@class, 'x1n2onr6') and contains(@class, 'xh8yej3') and contains(@class, 'lexical-rich-text-input')]")
            )
        )

    for message_field in message_fields:

        print(message_field.text)
        
        if (message_field.text == "Upišite poruku" ):
            p_element = message_field.find_element(By.TAG_NAME, "p")
            p_element.send_keys("Automated message12")
            p_element.send_keys(Keys.ENTER)     

    












def register_with_phone(driver):
    link_with_phone_number = WebDriverWait(driver, 10).until(
                                EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'x1n68mz9')]"
        )))

    link_with_phone_number.click()

    
    choose_country = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//span[contains(@class, 'xurb0ha')]"
)))
    
    current_selected_country =  WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'x78zum5') and contains(@class, 'x6s0dn4') and contains(@class, 'x3pnbk8') and contains(@class, 'xfex06f') and contains(@class, 'x1f6kntn')]"
)))
    
    if current_selected_country.text == "Bosnia & Herzegovina":

        enter_phone_number = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//input[contains(@class, 'x1n2onr6') and contains(@class, 'xy9n6vp') and contains(@class, 'x1n327nk') and contains(@class, 'xh8yej3') and contains(@class, 'x972fbf')]"
        )))

        enter_phone_number.send_keys("+38766955978")

        correct_button_clicked_flag = False

        for _ in range(10): 

            try: 

                next_button = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div[2]/div[3]/div[1]/div/div[3]/div[2]/button/div/div")))

                print(next_button.text)
                if next_button.text == "Next":
                    next_button.click()
                    correct_button_clicked_flag = True
                    
                
                else:
                    print("Next button is not found.")

            except TimeoutException:
                print("Timeout exception reached.")

def check_if_registered(driver):
    try: 
        website_title= WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'xjpr12u') and contains(@class, 'x1lkfr7t') and contains(@class, 'xdbd6k5') and contains(@class, 'x1fcty0u') and contains(@class, ' xw2npq5')]"
    )))

        if website_title.text == "Download WhatsApp for Windows":

            register_with_phone()

    except TimeoutException:
        print("User account is already setup.Therefore only messages will be sent.")
        send_a_message(driver, 38761211933, "Automated message trial")
      
    



def main():
    service = Service(executable_path="C:\\Users\\DT User\\Downloads\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=2345') 
    options.add_argument('--user-data-dir=C:\selenum\ChromeProfile2345') 
    options.add_argument('disable-popup-blocking')
    driver = webdriver.Chrome(service=service, options=options)
    driver.maximize_window()

    
    driver.get("https://web.whatsapp.com/")

    sleep(15)

    check_if_registered(driver)

    sleep(10000)


if __name__ == "__main__":

    main()



