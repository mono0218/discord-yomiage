import {Configuration,OpenAIApi} from "openai";
import azure_yomiage from "./yomiage.js";

export default async function gpt(content){
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    (async () => {
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: content }],
        });
        azure_yomiage(completion.data.choices[0].message);
      })();
    return
}