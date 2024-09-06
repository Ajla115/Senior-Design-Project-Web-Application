from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from  multiprocessing import Process
from selenium.webdriver.chrome.service import Service
from time import sleep
#import time

def run(urls):
#    print ("run", urls)
    service = Service(executable_path="C:\\Users\\User\\Downloads\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(service=service, options=options)

    for url in urls:
#        time.sleep(5)
        driver.get(url)
        sleep(50)
#        print driver.title

    #driver.quit()

def main():
    allurls = [
            ['https://stackoverflow.com/questions/49109450/how-to-run-multiple-webdriver-python-programs-at-the-same-time'],
            ['https://www.youtube.com/?gl=BA&hl=hr'],
            ]

    processes = []
    for urls in allurls:
        p = Process(target=run, args=(urls,))
        processes.append(p)
        p.start()

    for p in processes:
        p.join()

if __name__ == "__main__":
    main()