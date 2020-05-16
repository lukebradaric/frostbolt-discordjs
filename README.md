# Frostbolt Discord Bot (WIP)
https://tinyurl.com/yaebv87f

- Basic text commands ✓
- Join voice channels ✓
- Play audio ✓
- Custom commands ✓
- Custom token JSON ✓
- [Command] [ResponseType] [File/Message] ✗


# 1 Create a token.json file and include this:
```
{
"token": "ENTER YOUR DISCORD BOT TOKEN HERE"
}
```

# 2 Create a commands.json file and format commands like this: 
```
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
```

# 3 Create a folder called "sounds" and include all sound files there
