import instaloader

loader = instaloader.Instaloader()
NUM_POSTS = 10

def get_hashtags_posts(query):
    posts = loader.get_hashtag_posts(query)
    users = {}
    count = 0
    for post in posts:
        profile = post.owner_profile
        if profile.username not in users:
            # summary = engagement.get_summary(profile)
            users[profile.username] = count
            count += 1
            print('{}: {}'.format(count, profile.username))
            if count == NUM_POSTS:
                break
    return users

if __name__ == "__main__":
    hashtag_query = "love"  # Replace "your_hashtag_here" with the hashtag you want to query
    users = get_hashtags_posts(hashtag_query)
    print(users)
