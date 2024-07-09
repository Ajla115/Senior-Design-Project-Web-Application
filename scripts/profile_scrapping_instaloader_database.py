import instaloader
import time
import mysql.connector
from datetime import date

# Creating an instance of the Instaloader class
bot = instaloader.Instaloader()

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="a1b2c3d4e5",
    database="sdp_project"
)

def checkExistence(username):
    sql_query1 = "SELECT * FROM instagram_accounts WHERE username = %s"
    values = (username,)
    mycursor = mydb.cursor()
    mycursor.execute(sql_query1, values)
    result = mycursor.fetchone()
    return result is not None

def updateUser(username, stats):
    if not checkExistence(username):
        sql_query2 = "INSERT INTO instagram_accounts (username, stats, activity) VALUES (%s, %s, 'active')"
        values = (username, stats)
        message = f"Added new user: {username}"
    else:
        sql_query2 = "UPDATE instagram_accounts SET stats = %s WHERE username = %s"
        values = (stats, username)
        message = f"Updated user: {username}"
    print(message)
    mycursor = mydb.cursor()
    mycursor.execute(sql_query2, values)
    mydb.commit()

def scrapeData(username):
        current_date = date.today()
        try:
            profile = instaloader.Profile.from_username(bot.context, username)
            posts = profile.mediacount
            followers = profile.followers
            followings = profile.followees
            updateExistingUser(posts, followers, followings, username, current_date)
        except:
            setInvalidUser(username, current_date)
            print(f"Invalid username: {username}")
            #in case the profile does not exist any more, or username has changed
            #set the profile to be invalid

def setInvalidUser(username, current_date):
    sql_query3 = "UPDATE instagram_accounts SET post_number = 0, followers_number = 0, followings_number = 0, date_and_time = %s, stats = 1, activity = %s WHERE username = %s"
    values = ( current_date,"invalid username", username)
    mycursor = mydb.cursor()
    mycursor.execute(sql_query3, values)
    mydb.commit()    
    print(f"Invalid username: {username}")


def updateExistingUser(posts, followers, following, username, current_date):
    sql_query3 = "UPDATE instagram_accounts SET post_number = %s, followers_number = %s, followings_number = %s, date_and_time = %s, stats = 1 WHERE username = %s"
    values = (posts, followers, following, current_date, username)
    mycursor = mydb.cursor()
    mycursor.execute(sql_query3, values)
    mydb.commit()
    print(f"Updated user: {username}")

def fetchUsernameDataFromDB():
    sql_query = "SELECT username, activity, stats FROM instagram_accounts"
    mycursor = mydb.cursor()
    mycursor.execute(sql_query)
    return mycursor.fetchall()

def main():
    usernames_stats = fetchUsernameDataFromDB()
    #this count variable will be used create sleeps that mimic human behavior
    count = 0
  
    for username, activity, stats in usernames_stats:
        #this way it only checks for usernames whose activity status is not deleted
        if activity != 'deleted':
            #These are random sleeps, to mimic human behavior
            if count > 0:
                if count % 35 == 0:  
                    time.sleep(9)  
                elif count % 5 == 0:
                    time.sleep(5)
                elif count % 7 == 0:
                    time.sleep(7)


            if stats == 1:
                # Update the user stats
                updateUser(username, stats)
            elif stats == 0:
                # Scrape data for the new user
                scrapeData(username)
            
            time.sleep(3)
            #wait three seconds before moving on to the next username
            count += 1

    print("All records have been succesfully updated.")

if __name__ == '__main__':
    main()

