import instaloader

def get_usernames_under_hashtag(hashtag):
    # Create an instance of Instaloader
    L = instaloader.Instaloader()

    # Get all posts under the given hashtag
    posts = L.get_hashtag_posts(hashtag)


    # Set to store unique usernames
    usernames = set()

    # Iterate over the posts
    for post in posts:
        # Fetch the post metadata
        post_owner = post.owner_username
        # Add the username to the set
        usernames.add(post_owner)

    return usernames

# Example usage
hashtag = 'nature'
usernames = get_usernames_under_hashtag(hashtag)
print("Usernames under the hashtag", hashtag, ":", usernames)
