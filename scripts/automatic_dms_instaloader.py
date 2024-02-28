
from instabot import Bot

bot = Bot()
bot.login(username='suncanovic', password='#a1b2c3.D4')

# List of usernames to send direct messages to
usernames = "korman_ajla"
text = "Ovo je automatska poruka. Radim nesto za fakultet. Ne moras odgovarati."

bot.send_message(text, usernames)

bot.logout()
