# Senior-Design-Project-Web-Application
This is a repository for my Senior Design Project, web application, as a summary of the three-year Bachelor study in the field of software engineering.

- The backend of this application is done using Flight PHP. In the backend, different security protocols were implemented to ensure data integrity. Some of them are checking, if the user's password has been breached previously, then necessary email verification, two chances to reset password in ten minutes, and etc.

- To view all functionalities implemented, together with a detailed documentation, please check out the file found on this link: https://docs.google.com/document/d/1V3uA2Ka7ZpSyQa8uNcd9nnMM7BTuaUj0520erunMj8c/edit?usp=sharing

- Frontend was done using ReactJS, and to connect frontend and backend, axios was used. However the axios paths are hardcoded to my file paths, so you will need to change these to match your file paths, to see the project work.

- You will also need to connect to a database. To create a database, use file SDP_Project_New.sql located at the root level.

- Use the config_example.php file to setup your configuration varaibles, and add more if necessary. You MUST change the name of the file to config.php, and put it into the .gitignore file.

- For the profile data script, Python library Instaloader was used. The other two had to be implemented from the scratch. 

- You have to create .env file on the root level, and add two variable values for variables.
    IGUSERNAME = "example"
    PASSWORD = "example"
Make sure this IG username exists, and password is correct, since it will be needed to log in for the hashtag scrapping and automatic DMs script.


https://github.com/user-attachments/assets/ead80ca4-898b-4ba2-8cf8-d5826f7c333f


- You will also need to find a command to install composer on your device.

- Also since the second two scripts can fail, here are video examples for them.

https://github.com/user-attachments/assets/c1dc647c-7ed1-4e1e-925e-46306807f9e7

https://github.com/user-attachments/assets/f6219101-07af-43e9-94aa-249e83ca524e


