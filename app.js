var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');
// Some sections have been omitted



// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "866fdd15-d369-425e-8180-79a2ebeb5bbd",
    appPassword: "laEWPMOWU45(]ggdhk826:]"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {

    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

bot.set('persistConversationData', true);
//server.get(/.*/, restify.serveStatic({ 'directory': '.', 'default': 'index.html' }));


// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);

