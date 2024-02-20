#Import instaloader to scrape data from instagram
import instaloader

#Import needed to connect to the database
import mysql.connector

#get actual date
from datetime import date

#Creating an instance of the Instaloader class 
bot = instaloader.Instaloader()

#Connecting to the database
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="a1b2c3d4e5",
  database="sdp_project"
)

#Before INSERT function, first check if the username already exists in the database
#If it exists, skip the part with inserting and immediately go to the UPDATE part
def checkExistence(username):
    sql_query1 = "SELECT * FROM instagram_accounts WHERE username = %s "
    values = (username, )
    mycursor = mydb.cursor()
    mycursor.execute(sql_query1, values)
    result = mycursor.fetchone()  #since there is constraint in the database on unique username values, it will either return 1 row or none
    return result is not None     #if there is one row, it will return true, if there is no row, it will return false, meaning this user doesn't exist in the database


def insertUsername(username):
    if not checkExistence(username): #if this function is false, this if part will get executed
        sql_query2 = "INSERT INTO instagram_accounts (username, stats) VALUES (%s, 0)"
        values = (username, )
        mycursor = mydb.cursor()
        mycursor.execute(sql_query2, values)
        mydb.commit()
        print("Username has been inserted successfully.")
    else :
        print("Username already exists in the database, so just perform updating.")


def updateExistingUser(posts, followers, following, username):
    current_date = date.today()
    sql_query3 = "UPDATE instagram_accounts SET post_number = %s, followers_number = %s, followings_number = %s, date_and_time = %s, stats = 1 WHERE username = %s"
    values = (posts, followers, following, current_date, username)
    mycursor = mydb.cursor()
    mycursor.execute(sql_query3, values)
    mydb.commit()


def getBasicInfo():
    profileUsername = input("Enter username of the searched profile:\n")

    #Then, wait for a while until profile gets loaded from Instagram handle
    profile = instaloader.Profile.from_username(bot.context, profileUsername)
    # print("Username: ", profile.username)
    # print("User ID: ", profile.userid)

    insertUsername(profileUsername)

    #then, fetch additional data
    # print("Number of Posts: ", profile.mediacount)
    # print("Number of Followers: ", profile.followers)
    # print("Number of Following: ", profile.followees)
    posts =  profile.mediacount
    followers =  profile.followers
    followings =  profile.followees

    updateExistingUser(posts, followers, followings, profileUsername)


if __name__ == '__main__' :
    getBasicInfo()