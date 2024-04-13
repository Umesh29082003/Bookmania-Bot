// Import necessary modules
const express = require('express');
const path = require('path');
const dialogflow = require('@google-cloud/dialogflow');
const {searchBooksByGenre,searchBooksByAuthor,giveBookDescription, findAuthor, findGenre, findmoreBooksInThisGenre}=require('./request-Handler');
//const db=require('./chat')

// Create an Express app
const app = express();
const port = 3000; // Change the port as needed

app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(`${__dirname}/public`));

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index..html'));
});

// Configure Dialogflow client
const projectId = 'bibliobot-osvk'; // Replace with your Dialogflow project ID
const sessionId = '123456'; // Any arbitrary session ID
const languageCode = 'en'; // Language code

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: 'bibliobot-osvk-fd09253c9d99.json'
});
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// Function to send message to Dialogflow and get response
async function sendMessageToDialogflow(message) {
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const Intent = responses[0].queryResult.intent.displayName;
        const parameters = responses[0].queryResult.parameters
        //console.log(parameters)

        console.log(Intent)
        if (Intent == 'BooksbyGenre') {
            const givenGenre=parameters.fields.GenreName.stringValue
            const bookjson = await searchBooksByGenre(givenGenre);
            console.log(bookjson)
            if (bookjson.found) {
                return responses[0].queryResult.fulfillmentText + "<br> &nbsp &nbsp" + bookjson.books;
            }
            else {
                return bookjson.regret.replace('<GenreName>',givenGenre);
            }
        }

        else if (Intent == 'BooksbyAuthor') {
            const givenAuthor=parameters.fields.person.stringValue
            const result = await searchBooksByAuthor(givenAuthor);
            if (result.found) {
                const dailogflowResponse = responses[0].queryResult.fulfillmentText
                const modifiedResopnse = dailogflowResponse.replace(givenAuthor, result.authorname);
                return modifiedResopnse+"<br> &nbsp &nbsp"+result.books;
            }
            else {
                return result.regret.replace('<AuthorName>',givenAuthor)
            }
        }
            
        else if (Intent == 'BookbyDescription') {
            const givenBook=parameters.fields.BookName.stringValue
            const result = await giveBookDescription(givenBook);
            if (result.found) {
                const dailogflowResponse = responses[0].queryResult.fulfillmentText
                const modifiedResopnse = dailogflowResponse.replace(parameters.fields.BookName.stringValue, result.bookname);
                return modifiedResopnse + "<br> &nbsp &nbsp<p><i>" + result.description + "</i></p";
            }
            else {
                return result.regret.replace('<BookName>',givenBook)
            }
        }
        
        else if (Intent == 'Who is its author') {
            const result = await findAuthor();
            const dailogflowResponse = responses[0].queryResult.fulfillmentText
            let modifiedResopnse = dailogflowResponse.replace("<BookName>", "<i>"+result.bookname+"</i>");
            modifiedResopnse = modifiedResopnse.replace("<AuthorName>", "<i>"+result.authorname+"</i>");
            return modifiedResopnse;

        }
            
        else if (Intent == 'Which genre does it belong') {
            const result = await findGenre();
            const dailogflowResponse = responses[0].queryResult.fulfillmentText
            let modifiedResopnse = dailogflowResponse.replace("<BookName>", "<i>"+result.bookname+"</i>");
            modifiedResopnse = modifiedResopnse.replace("<GenreName>", "<i>"+result.genre+"</i>");
            return modifiedResopnse;
            
        }
            
        else if (Intent == 'BooksbyRatings') {
            console.log(parameters)
            //const result = await giveBookRating(parameters.fields.Title.stringValue);
            return responses[0].queryResult.fulfillmentText/*+"\n"+result;*/
        }

        else if (Intent == 'Other books of same genre') {
            const genre = await findmoreBooksInThisGenre();
            const result = await searchBooksByGenre(genre)
            return responses[0].queryResult.fulfillmentText+"<br> &nbsp &nbsp"+result.books;
        }
        else {
            return responses[0].queryResult.fulfillmentText // Get the response from Dialogflow
        }


        
    } catch (err) {
        console.error('Error sending message to Dialogflow:', err);
        return 'Sorry, I couldn\'t process your request at the moment.';
    }
}

// Express route for handling incoming messages
app.post('/processMessage', async (req, res) => {
    const message = req.body.message || 'Show some books by Harper Lee'; // Default message is 'Show some books by Harper Lee'
    const response = await sendMessageToDialogflow(message);
    res.send({ response }); // Send response as JSON object
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



/*
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to interact like a chatbot
async function chat() {
    rl.question('You: ', async (input) => {
        if (input.toLowerCase() === 'shut down') {
            console.log('Bot: Shutting down...');
            rl.close();
            process.exit(0);
        }
        const response = await sendMessageToDialogflow(input);
        console.log('Bot:', response);
        chat(); // Recursive call to continue the conversation
    });
}

// Start the chat
chat();
*/

