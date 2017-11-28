var builder = require('botbuilder');
var customVision = require("./CustomVision");
var exchangeRate = require("./ExchangeRate");

// Some sections have been omitted
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        //call custom vision
        customVision.retreiveMessage(session);
        return true;
    }
    else {
        return false;
    }
}
exports.startDialog = function (bot) {
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9af03262-bf99-44ab-9477-9111a6673a04?subscription-key=966100dac65747c3a9b9459220fabb28&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);




    bot.dialog('None', [
    function (session, args) {
        if (!isAttachment(session)) {
            //
        }
    }]).triggerAction({
        matches: 'None'
    });

    bot.dialog('Welcome', [
        function (session, args) {
            if (!isAttachment(session)) {
                session.send('Welcome to Contoso Bank. What is your name?');
                
            }
        }]).triggerAction({
            matches: 'Welcome'
        });





    bot.dialog('GetExchangeRate', 
    function (session, args) {
        if (!isAttachment(session)) {
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'currency');
            console.log(currencyEntity);
            //session.dialogData.args.intent.entities or
            if (true){
                session.send('Finding exchange rates %s...', "NZD");
                exchangeRate.displayExchangeRateCards("NZD", session);
            }else{
                session.send("Error, please try again");
            }
        }
    }).triggerAction({
        matches: 'GetExchangeRate'
    });




    bot.dialog('ConvertCurrency', [
    function (session, args) {
        if (!isAttachment(session)) {
            //
        }
    }

    ]).triggerAction({
        matches: 'ConvertCurrency'
    });
    
    







}
