import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateHtmlFromArticle() {
    try {
        const articleContent = await fs.readFile('tresc_artykulu.txt', 'utf8');

        const prompt = `
        Przekształć poniższy tekst artykułu w strukturalny kod HTML, lecz bez znaczników <html>, <head>, <body>, stosując odpowiednie tagi do sekcji, paragrafów i nagłówków.
        Wskaż miejsca, gdzie warto wstawić obrazki, za pomocą tagów <img src="image_placeholder.jpg" alt="krótki opis obrazu potrzebny do wygenerowania grafiki">.
        
        Tekst:
        ${articleContent}
        `;

        const chatCompletion = await openAIClient.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ]
        });

        const htmlContent = chatCompletion.choices[0].message.content;

        await fs.writeFile('artykul.html', htmlContent.trim(), 'utf8');
        console.log('Plik artykul.html został utworzony.');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

generateHtmlFromArticle();