const Discord = require('discord.js');
const client = new Discord.Client();
const Token = 'TOKENHERE';
const channelName = 'frostbolt';
const initMessage = 'Frostbolt initialized.';
const sendInitMessage = false;
let connectedChannels = [];

//Array of all registered commands
let regCommands = [];

client.login(Token);

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("hentai", { type: "WATCHING" })

    //For each server, log that it has connected
    client.guilds.cache.forEach((guild) => {

        console.log("Connected to " + guild.name);

        //For each server with the designated channel name, add it to the connectedChannels array
        guild.channels.cache.forEach((channel) => {
            if (channel.name == channelName) {
                let botChannel = client.channels.cache.get(channel.id);
                connectedChannels.push(botChannel);
                console.log("Connected to " + channelName + " in " + guild.name);
            }
        })

    })

    //Load all commands from json file
    loadCommands();

    //If the bot is using Initlization messages, send it
    if (sendInitMessage) {
        connectedChannels.forEach(channel => channel.send(initMessage));
    }
})

client.on('message', message => {

    //If message is bot or not designated channel, return
    if (message.author == client.user || message.channel.name != channelName) {
        return;
    }

    //Check each command for a match
    regCommands.forEach(cmd => {
        if (message.content.includes(cmd.command)) {
            const vc = message.member.voice.channel;

            if (vc == null) {
                return;
            }

            //If multiple files, pick a random one
            let fileToPlay;
            if (isArray(cmd.file)) {
                let randomNum = Math.floor(Math.random() * cmd.file.length);
                fileToPlay = cmd.file[randomNum];
            } else {
                fileToPlay = cmd.file;
            }

            //Join channel then play file
            vc.join().then(connection => {
                const dispatcher = connection.play(stringToSound(fileToPlay));
                console.log("Sending command: " + cmd.command + ", requested by " + message.member.user.tag);
                dispatcher.on('finish', finish => {
                    vc.leave();
                })
            });
        }
    })

    if (message.content == "commands") {
        cmds = getCommandList();
        let channelId = message.channel.id;
        client.channels.cache.get(channelId).send(cmds);
    }
})

//Load all commands from json file
function loadCommands() {
    regCommands = [];

    //Load json file
    const data = require('./commands.json');

    //Add all json objects to commands array
    for (i = 0; i < data.length; i++) {
        regCommands.push(data[i]);
    }

    //Notify for each command registered
    regCommands.forEach(cmd => {
        console.log("Registered command: " + cmd.command);
    })
}

//Returns a list of all available commands
function getCommandList() {
    let commandList = "commands: ";
    regCommands.forEach(cmd => {
        commandList += cmd.command + ", ";
    })
    return commandList;
}

//Return if the object is an array
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

//Return a string with path to the sound folder
function stringToSound(str) {
    return 'sounds/' + str;
}

//Return a string with the path to the image folder
function stringToImage(str) {
    return 'images/' + str;
}

//Return a string with path and file name supplied (kinda pointless?)
function stringToFile(strPath, str) {
    return strPath + '/' + str;
}

//Return a string with every other letter uppercase
function stringToAlt(str) {
    let newStr = [];
    for (i = 0; i < str.length; i++) {
        if (i % 2 == 0) {
            newStr.push(str.charAt(i).toUpperCase());
        } else {
            newStr.push(str.charAt(i).toLowerCase());
        }
    }
    return newStr.join('');
}