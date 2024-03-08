link_to_username = " https://www.instagram.com/team_falchetta_/ "
#the first 25 characters are the ig url, and I will slice that so I will use just the actual name

actual_username = link_to_username.split('/')

print(actual_username[3])