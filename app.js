const Discord       = require('discord.js');
const ffmpegPath    = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg        = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Discord.Client();

const token = 'YourBotToken';
const prefix = '.';

client.on('ready', () => {
    console.log(`[Yeet Bot] Logged in as ${client.user.tag}!`);
});

let dispatcher = null;
let isPlaying = false;
let isJoined = false;

const availableCommands = {
    join       : null,
    dc         : null,
    knock      : 'knock.mp3',
    creepy     : 'creepy.mp3',
    scary      : 'scary.mp3',
    fbi        : 'fbi.mp3',
    mlgsad     : 'mlgsad.mp3',
    cena       : 'cena.mp3',
    run        : 'run.mp3',
    gay        : 'gay.mp3',
    illuminati : 'illuminati.mp3',
    stop       : null,
};

client.on('message', async msg => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!msg.guild) return;

    // only admins
    if (!msg.member.hasPermission('ADMINISTRATOR')) return;

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    //let arg1 = args[0];

    const voiceChannel = msg.member.voice.channel;

    var connection = await msg.member.voice.channel.join();

    switch (command)
    {
        case 'join':
            try {
                connection = await voiceChannel.join().then(connection => {
                    // connection = con; // this doesn't seem to work
                    isJoined = true;
                });
            } catch (err) {
                voiceChannel.leave();
                isPlaying = false;
                isJoined = false;
                console.error(`[yeet bot] join(): Something went wrong: ${err}`);
            }
            break;
        case 'dc':
            try {
                if (!isJoined || !voiceChannel)
                    return;

                if (dispatcher)
                    dispatcher.end();

                voiceChannel.leave();
            } catch (err) {
                console.error(`[yeet bot] dc(): Something went wrong: ${err}`);
            }

            isPlaying = false;
            isJoined = false;
            break;
        case 'stop':
            if(!isPlaying)
                return;

            try {
                if(!isJoined || !voiceChannel)
                    return;
                
                if (dispatcher)
                    dispatcher.end();

                isPlaying = false;
            } catch (err) {
                isPlaying = false;
                console.error(`[yeet bot] stop(): Something went wrong: ${err}`);
            }
            break;
    }

    if (availableCommands[command] !== null && availableCommands[command] !== undefined) {
        try {
            if (isJoined) {
                if(isPlaying)
                    return console.log(`Already playing something! Use ${prefix}stop to stop playing.`);
    
                if (!isJoined || !voiceChannel) {
                    return console.log('Please be in a voice channel first!');
                }

                console.log('this has continued');

                isPlaying = true;
                dispatcher = connection.play(`sounds/${availableCommands[command]}`);
    
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
                //});
            }
        } catch (err) {
            isPlaying = false;
            console.error(`[yeet bot] MAIN FUNCTION: Something went wrong: ${err}`);
        }
    }
});

client.login(token);