# yeet-bot

*This is still under construction.*

Troll bot for my discord server

1. Create a `sounds` folder and put your sounds inside the folder.
2. Use `npm install` to install the dependencies.
3. Check `client.on('message')` for permissions.
4. Generate your discord bot token and type it inside a new `botToken.txt` file.
5. Run with `npm start`.

The default prefix is `.` which you can change in the `prefix` variable.

# Commands

To create a new sound command, you should put your sound file inside the `sounds` folder.
Your command will be named after the file name without its extension.

For example:

1. You put a file named `test.mp3` inside `sounds`.
2. Your new command is going to be `.test` and when sent, Yeet Bot is gonna play your file's audio.

# Usage

* Join a voice channel and use `.join` to let Yeet Bot connect too.
* Use `.dc` to disconnect Yeet Bot from the voice channel.
* Use `.stop` to stop playing whatever sound is currently playing.

# Issues

* When you disconnect from the voice channel, that you made Yeet Bot join, and use `.dc`, it's kinda gonna break but you can still use `.join` to connect the bot to the same or another channel.
