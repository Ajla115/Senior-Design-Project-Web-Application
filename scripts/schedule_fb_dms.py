import mysql.connector
from dotenv import load_dotenv


# This will load env variables
load_dotenv() 

# Connecting to the database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="sdp_project"
)

mydb.autocommit = True

mycursor = mydb.cursor()

def schedule_facebook_messages():
    query = "SET SQL_SAFE_UPDATES = 0; "
    mycursor.execute(query)

    query = "UPDATE facebook_dms SET status =  'Scheduled'"
    mycursor.execute(query)

    query = "SELECT * FROM facebook_dms"
    mycursor.execute(query)
    result = mycursor.fetchall()
    return result


    
def main():

    print(schedule_facebook_messages())
    print("Facebook DMs status successfully set to Scheduled.")

if __name__ == "__main__":

    main()
