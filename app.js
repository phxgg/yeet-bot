const Discord       = require('discord.js');
const ffmpegPath    = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg        = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const client = new Discord.Client();

const token = ''; // YourToken
const prefix = '.';

client.on('ready', () => {
    console.log(`[Yeet Bot] Logged in as ${client.user.tag}!`);
});

let voiceChannel = null;
let connection = null;
let dispatcher = null;

let isPlaying = false;
let inVoice = false;

const availableCommands = {
    join       : null,
    dc         : null,
    knock      : 'knock.mp3',
    fbi        : 'fbi.mp3',
    mlgsad     : 'mlgsad.mp3',
    cena       : 'cena.mp3',
    stop       : null,
};

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
        /*case 'clear':
            if (!msg.member.hasPermission('ADMINISTRATOR')) return;

            try {
                const channelId = msg.channel;
                
                for (var i = 0; i < 10; i++) {
                    const messages = await channelId.messages.fetch({ limit: 100 }); // Fetch last 100 messages (max 100)
                    //.then(msgs => msgs.first(msgs.size - 3)); // Remove the last 3 messages out of the collection to delete

                    channelId.bulkDelete(messages, true);
                }
            } catch (err) {
                console.error(`[yeet bot] clear(): ${err}`);
            }
            break;*/
        case 'join':
            try {
                /*connection = await voiceChannel.join().then(con => {
                    isJoined = true;
                });*/

                connection = await voiceChannel.join();
                if (connection !== null)
                    inVoice = true;
            } catch (err) {
                if(voiceChannel)
                    voiceChannel.leave().catch(console.error);
                isPlaying = false;
                inVoice = false;
                console.error(`[yeet bot] join(): Something went wrong: ${err}`);
            }
            break;
        case 'dc':
            if (!inVoice || !voiceChannel)
                return;

            try {
                if (dispatcher)
                    dispatcher.end();

                if(voiceChannel)
                    voiceChannel.leave().catch(console.error);
            } catch (err) {
                console.error(`[yeet bot] dc(): Something went wrong: ${err}`);
            }

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
            } catch (err) {
                isPlaying = false;
                console.error(`[yeet bot] MAIN FUNCTION: Something went wrong: ${err}`);
            }
        }
    }
});

client.login(token);