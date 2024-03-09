import instaloader
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
        sql_query2 = "INSERT INTO instagram_accounts (username, stats) VALUES (%s, %s)"
        values = (username, stats)
    else:
        sql_query2 = "UPDATE instagram_accounts SET stats = %s WHERE username = %s"
        values = (stats, username)
    
    mycursor = mydb.cursor()
    mycursor.execute(sql_query2, values)
    mydb.commit()

def scrapeData(username):
    profile = instaloader.Profile.from_username(bot.context, username)
    posts = profile.mediacount
    followers = profile.followers
    followings = profile.followees
    current_date = date.today()

    updateExistingUser(posts, followers, followings, username, current_date)

def updateExistingUser(posts, followers, following, username, current_date):
    sql_query3 = "UPDATE instagram_accounts SET post_number = %s, followers_number = %s, followings_number = %s, date_and_time = %s, stats = 1 WHERE username = %s"
    values = (posts, followers, following, current_date, username)
    mycursor = mydb.cursor()
    mycursor.execute(sql_query3, values)
    mydb.commit()

def fetchUsernamesStatsFromDB():
    sql_query = "SELECT username, stats FROM instagram_accounts"
    mycursor = mydb.cursor()
    mycursor.execute(sql_query)
    return mycursor.fetchall()

def main():
    usernames_stats = fetchUsernamesStatsFromDB()
    
    for username, stats in usernames_stats:
        if stats == 1:
            # Update the user stats
            updateUser(username, stats)
        elif stats == 0:
            # Scrape data for the new user
            scrapeData(username)

if __name__ == '__main__':
    main()

