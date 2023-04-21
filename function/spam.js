import { client } from "../index.js"

const func = async msg => {
    if (msg.author.id==="1006528775237926986") {
        if(msg.guildId=== "1092773631207149619" && msg.channelId=== "1092778530347171934"){
            client.channels.cache.get('1092778530347171934').send('<@1006528775237926986>静かにしてください！')
        }
    } else if (msg.author.id==="987698734966116362") {
        if(msg.guildId=== "1092773631207149619" && msg.channelId=== "1092778530347171934"){
            client.channels.cache.get('1092778530347171934').send('<@987698734966116362>静かにしてください！')
        }
    }else{
        return
    }
}

export function spam(){
    client.on('messageCreate', func)
}

export function spam_stop(){
    client.off('messageCreate', func)
}