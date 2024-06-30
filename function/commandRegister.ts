/**
 * slashコマンド一覧入手
 * @returns commands
 */
export function commands(){
    const ping = {
        name: "ping",
        description: "pongと返信します。",
    }
    const join = {
        name:"join",
        description: "ボイスチャットに接続します",
    }

    const bye = {
        name:"bye",
        description:"ボイスチャットから切断します",
    }

    const voice = {
        name:"voice",
        description:"感情を持つbotちゃん",
        options: [
            {
                type: 3,
                name: "content",
                description: "会話を始めよう",
                required: true,
            }
        ]
    };

    const chat = {
        name:"chat",
        description:"感情を持つbotちゃん",
        options: [
            {
                type: 3,
                name: "content",
                description: "会話を始めよう",
                required: true,
            },
            {
                type: 7,
                name: "channel",
                description: "チャンネル",
                required: true,
            }
        ]
    };


    const skip ={
        name:"skip",
        description:"スキップします"
    }

    return [ping, join, bye, voice, skip, chat]
}
