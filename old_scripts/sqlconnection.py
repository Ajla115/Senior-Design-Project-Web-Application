import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="a1b2c3d4e5",
  database="sdp_project"
)

mycursor = mydb.cursor()

#This part works, but I put it into comments because I don't need it at the moment
# Insert new value
'''mycursor.execute("INSERT INTO instagram_accounts (username) VALUES ('millane')")

# Commit is needed, otherwise the change will not be tracked
mydb.commit()

# Printing the number of records inserted
print(mycursor.rowcount, "record inserted.")'''

#Select all records from table
mycursor.execute("SELECT * FROM instagram_accounts")
myresult = mycursor.fetchall()

# Printing results
for x in myresult:
  print(x)



