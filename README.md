# Frostbolt Discord Bot (WIP)
https://tinyurl.com/yaebv87f

- Basic text commands ✓
- Join voice channels ✓
- Play audio ✓
- Custom commands ✓
- Custom token JSON ✓
- [Command] [ResponseType] [File/Message] ✗


# Create a token.json file and include this:
{
"token": "ENTER YOUR DISCORD BOT TOKEN HERE"
}

# Create a commands.json file and format commands like this:
[
    {
        "command": "example",
        "file": "example_response.mp3"
    },
    {
        "command": "exampleRandom",
        "file": ["example_response_one.mp3", "example_response_two.mp3"]
    }
]
