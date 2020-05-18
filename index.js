const Discord = require('discord.js');
const client = new Discord.Client();
const channelName = 'frostbolt';
const useSpecificChannel = true;
const initMessage = 'Frostbolt initialized.';
const sendInitMessage = false;
let regCommands = [];
let connectedChannels = [];

let request = require('request');
let fs = require('fs');

const tokenData = require('./token.json');
const token = tokenData.token;
client.login(token);

client.on('ready', () =>
{
    console.log('Connected as ' + client.user.tag);

    client.user.setActivity('hentai', { type: 'WATCHING' });

    //For each server, log that it has connected
    client.guilds.cache.forEach((guild) =>
    {
        console.log('Connected to ' + guild.name);

        //For each server with the designated channel name, add it to the connectedChannels array
        for (let channel of guild.channels.cache)
        {
            if (channel.name == channelName)
            {
                let botChannel = client.channels.cache.get(channel.id);
                connectedChannels.push(botChannel);
                console.log('Connected to ' + channelName + ' in ' + guild.name);
            }
        }
    });

    //Load all commands from json file
    loadCommands();

    //If the bot is using Initlization messages, send it
    if (sendInitMessage)
    {
        for (let channel of connectedChannels)
        {
            channel.send(initMessage);
        }
    }
});

client.on('message', (message) =>
{
    //If message is bot or not designated channel, return
    if (message.author == client.user || message.channel.name != channelName && useSpecificChannel)
    {
        return;
    }

    //If is add message, and has a command after add prefix
    if (message.content.substring(0, 3) == 'add' && message.content.length >= 5)
    {
        //If message has mp3 attachment, download it
        if (message.attachments.first())
        {
            newCmd = message.content.substring(4, message.content.length).trim();
            newCmd = removeSpecialChar(newCmd);

            //Check if command already exists
            for (let cmd of regCommands)
            {
                if (cmd.command == newCmd)
                {
                    console.log('Command ' + newCmd + ' already exists' + ' (' + message.member.user.tag + ')');
                    message.reply("Command already exists");
                    return;
                }
            }

            fn = message.attachments.first().name; //file name
            fType = fn.substring(fn.length - 3, fn.length); //file type
            if (fType == 'mp3')
            {
                console.log('Command: ' + newCmd + ', File: ' + newCmd + '.mp3');
                console.log('Downloading mp3, requested by, ' + message.member.user.tag);
                message.reply('Command added as: ' + "'" + newCmd + "'");
                downloadMp3(message.attachments.first().url, newCmd);
                addCommand(newCmd, newCmd + '.mp3');
                return;
            }
        }
    }

    //Check each command for a match
    for (let cmd of regCommands)
    {
        if (message.content.includes(cmd.command))
        {
            const vc = message.member.voice.channel;

            if (vc == null)
            {
                return;
            }

            //If multiple files, pick a random one
            let fileToPlay;
            if (isArray(cmd.file))
            {
                let randomNum = Math.floor(Math.random() * cmd.file.length);
                fileToPlay = cmd.file[randomNum];
            } else
            {
                fileToPlay = cmd.file;
            }

            //Join channel then play file
            vc.join().then((connection) =>
            {
                const dispatcher = connection.play(stringToSound(fileToPlay));
                console.log(
                    'Sending command: ' +
                    cmd.command +
                    ', requested by ' +
                    message.member.user.tag
                );
                dispatcher.on('finish', (finish) =>
                {
                    vc.leave();
                });
            });
        }
    }

    if (message.content == 'commands')
    {
        cmds = getCommandList();
        message.reply(getCommandList());
    }

});


//Remove all special characters
function removeSpecialChar(str)
{
    return str.replace(/[^a-zA-Z ]/g, '');
}

//Downloads and mp3 from a message
function downloadMp3(url, name)
{
    console.log("Downloading " + url);
    request.get(url).on('error', console.error).pipe(fs.createWriteStream('sounds/' + newCmd + '.mp3'));
}

//Load all commands from json file
function loadCommands()
{
    regCommands = [];

    //Load json file
    const data = require('./commands.json');

    //Add all json objects to commands array
    for (i = 0; i < data.length; i++)
    {
        regCommands.push(data[i]);
    }

    //Notify for each command registered
    for (let cmd of regCommands)
    {
        console.log('Registered command: ' + cmd.command);
    }
}

//Adds new command to regCommands array, and re-writes json commands
function addCommand(command, file)
{
    let newData = { "command": command, "file": file }

    console.log("Added " + command + " at " + file);
    regCommands.push(newData);

    let jsonObj = JSON.stringify(regCommands);
    fs.writeFile('./commands.json', jsonObj, 'utf8', function (err)
    {
        if (err)
        {
            console.log("Error occured writing to json file");
            return;
        }
    })

}

//Returns a list of all available commands
function getCommandList()
{
    let commandList = 'commands: ';
    for (let cmd of regCommands)
    {
        commandList += cmd.command + ', ';
    }
    return commandList;
}

//Return if the object is an array
function isArray(obj)
{
    return Object.prototype.toString.call(obj) === '[object Array]';
}

//Return a string with path to the sound folder
function stringToSound(str)
{
    return 'sounds/' + str;
}

//Return a string with the path to the image folder
function stringToImage(str)
{
    return 'images/' + str;
}

//Return a string with path and file name supplied (kinda pointless?)
function stringToFile(strPath, str)
{
    return strPath + '/' + str;
}

//Return a string with every other letter uppercase
function stringToAlt(str)
{
    let newStr = [];
    for (i = 0; i < str.length; i++)
    {
        if (i % 2 == 0)
        {
            newStr.push(str.charAt(i).toUpperCase());
        } else
        {
            newStr.push(str.charAt(i).toLowerCase());
        }
    }
    return newStr.join('');
}