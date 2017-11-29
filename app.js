var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
// Some sections have been omitted



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
//server.get(/.*/, restify.serveStatic({ 'directory': '.', 'default': 'index.html' }));


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "1d565c53-e668-45f3-b80a-73b80a4f8be3",
    appPassword: "euoDDVC9919!?_blwcFTO6)"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {

    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

bot.set('persistConversationData', true);


// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);

