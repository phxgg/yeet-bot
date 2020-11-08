const Discord       = require('discord.js');
const ffmpegPath    = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg        = require('fluent-ffmpeg');
const fs            = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Discord.Client();

const prefix = '.';

client.on('ready', () => {
    console.log(`[Yeet Bot] Logged in as ${client.user.tag}!`);
});

let voiceChannel = null;
let connection = null;
let dispatcher = null;

let isPlaying = false;
let inVoice = false;

var availableCommands = {
    join       : null,
    dc         : null,
    stop       : null,
};

console.log('[INFO] Loading...');

// Get sound files and convert to "sound" => "sound.mp3" commands.
fs.readdir('./sounds/', (err, list) => {
    if (err) {
        console.error(`[ERROR] Could not load commands: ${err}`);
        return;
    }

    list.forEach(f => {
        var split = f.split('.');
        var key = split.slice(0, split.length - 1).join("."); // remove the extension from the key
        availableCommands[key] = f;
    });
    console.log('[INFO] Commands loaded!');
    console.log(availableCommands);
});

function disconnect() {
    try {
        if (dispatcher)
            dispatcher.end();

        if (voiceChannel)
            voiceChannel.leave();
    } catch (err) {
        dispatcher = null;
        voiceChannel = null;
        console.error(`[yeet bot] disconnect(): ${err}`);
    }
}

client.on('message', async msg => {
    // Voice only works in guilds, if the message does not come from a guild, we ignore it
    if (!msg.guild) return;

    // Only users with specific role & admins
    if (!msg.member.roles.cache.some(role => role.name === ':}')
        && !msg.member.hasPermission('ADMINISTRATOR')) return;
    
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    //let arg1 = args[0];

    try {
        voiceChannel = msg.member.voice.channel;
    } catch (err) {
        voiceChannel = null;
        console.error(`[yeet bot] voiceChannel: could not set instance: ${err}`);
    }

    switch (command)
    {
        case 'join':
            try {
                connection = await voiceChannel.join();
                if (connection !== null)
                    inVoice = true;
            } catch (err) {
                disconnect();
                isPlaying = false;
                inVoice = false;
                console.error(`[yeet bot] join(): Something went wrong: ${err}`);
            }
            break;
        case 'dc':
            if (!inVoice || !voiceChannel)
                return;

            disconnect();

            isPlaying = false;
            inVoice = false;
            break;
        case 'stop':
            if(!isPlaying || !inVoice || !voiceChannel)
                return;

            try {
                if (dispatcher)
                    dispatcher.end();

                isPlaying = false;
            } catch (err) {
                isPlaying = false;
                console.error(`[yeet bot] stop(): Something went wrong: ${err}`);
            }
            break;
    }

    if (connection !== null) {
        if (availableCommands[command] !== null && availableCommands[command] !== undefined) {
            try {
                if(isPlaying)
                    return console.log(`Already playing something! Use ${prefix}stop to stop playing.`);
    
                if (!inVoice || !voiceChannel) {
                    return console.log('Please be in a voice channel first!');
                }

                var soundPath = `./sounds/${availableCommands[command]}`;

                // check if sound path exists
                fs.access(soundPath, fs.F_OK, (err) => {
                    if (err) {
                        console.error(`[yeet bot] fs.access: ${err}`);
                        return;
                    }

                    dispatcher = connection.play(soundPath);
                    isPlaying = true;
        
                    dispatcher
                        .on('end', () => {
                            isPlaying = false;
                        })
                        .on('finish', () => {
                            isPlaying = false;
                        })
                        .on('error', (error) => {
                            isPlaying = false;
                            console.error(`[yeet bot] dispatcher error: ${error}`);
                        });
                });
            } catch (err) {
                isPlaying = false;
                console.error(`[yeet bot] MAIN FUNCTION: Something went wrong: ${err}`);
            }
        }
    }
});

fs.readFile('./botToken.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(`[yeet bot] ERROR reading botToken.txt: ${err}`);
        return;
    }

    client.login(data);
});