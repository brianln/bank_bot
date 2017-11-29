var builder = require('botbuilder');
var customVision = require("./CustomVision");
var exchangeRate = require("./ExchangeRate");
var feedBack = require("./Feedback");
var qna = require("./QnAMaker");

// Some sections have been omitted
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        //call custom vision
        session.sendTyping();                            
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
        function (session, args, next) {
            session.sendTyping();                    
            if (!isAttachment(session)) {
                session.dialogData.args = args || {};                        
                session.send('Welcome to Contoso Bank.');
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter your full name to setup your account.");                
                } else {
                    next(); // Skip if we already have this info.
                }          
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (session.conversationData["username"] == undefined){
                    session.conversationData["username"] = results.response;                   
                }
                //session.conversationData["username"] = results.response;                   
                session.send("Welcome %s, if you need help, type \'help\'.", session.conversationData["username"]);
                
            }
        }
    
    
        ]).triggerAction({
            matches: 'Welcome'
        });





    bot.dialog('GetExchangeRate', 
    function (session, args) {
        session.sendTyping();
        if (!isAttachment(session)) {
            exchangeRate.displayExchangeRateCards(session);
            
        }
    }).triggerAction({
        matches: 'GetExchangeRate'
    });

    /*
    bot.dialog('GetExchangeRate', 
    function (session, args) {
        session.sendTyping();
        if (!isAttachment(session)) {
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'money');
            console.log(currencyEntity);
            //session.dialogData.args.intent.entities or
            if (currencyEntity){
                session.send('Finding exchange rates %s...', currencyEntity.entity);
                                
                exchangeRate.displayExchangeRateCards(currencyEntity.entity, session);
            }else{
                session.send("Error, please try again");
            }
        }
    }).triggerAction({
        matches: 'GetExchangeRate'
    });*/





    bot.dialog('GiveFeedback', [
        function (session, args, next) {
            session.sendTyping();                    
            if (!isAttachment(session)) {
                session.dialogData.args = args || {};                        
                session.send('Please leave a feedback of your experience.');
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Please confirm your full name.");                
                } else {
                    next(); // Skip if we already have this info.
                }          
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if(results.response){
                    session.conversationData["username"] = results.response;
                }
                //session.conversationData["username"] = results.response;                   
                //session.send("What was your overall experience %s?", session.conversationData["username"]);
                builder.Prompts.text(session, "What was your overall experience "+ session.conversationData["username"] +"?");
                next();
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                session.conversationData["experience"] = results.response;                   
                //session.send("What was your overall experience %s?", session.conversationData["username"]);
                builder.Prompts.text(session, "What was the reason of a "+ session.conversationData["experience"] +" experience?");
                next();
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                session.conversationData["reason"] = results.response;                   
                //session.send("What was your overall experience %s?", session.conversationData["username"]);
                session.sendTyping();                                            
                feedBack.sendFeedback(session, session.conversationData["username"], session.conversationData["experience"],
                session.conversationData["reason"]);
                session.send("Thank you for the feedback.");
            }
        }
    ]).triggerAction({
        matches: 'GiveFeedback'
    });




    bot.dialog('GetFeedback', [
        function (session, args, next) {
            if (!isAttachment(session)) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Please confirm your full name.");                
                } else {
                    next(); // Skip if we already have this info.
                }
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your feedback");
                feedBack.displayFeedback(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
        }
    ]).triggerAction({
        matches: 'GetFeedback'
    });




    bot.dialog('DeleteFeedback', [
        function (session, args, next) {
            if (!isAttachment(session)) {
                session.dialogData.args = args || {};
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Please confirm your full name.");
                } else {
                    next(); // Skip if we already have this info.
                }
            }
        },
        function (session, results,next) {
            if (!isAttachment(session)) {
                //Add this code in otherwise your username will not work.
                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the food entity from the session if it exists
                var Entity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'experience');
                console.log(Entity);
                // Checks if the for entity was found
                if (Entity) {
                    session.send('Deleting \'%s\'...', Entity.entity);
                    feedBack.deleteFeedback(session, session.conversationData["username"], Entity.entity); //<--- CALLL WE WANT
                } else {
                    session.send("No experience identified! Please try again");
                }
            }
    }]).triggerAction({
        matches: 'DeleteFeedback'
    });




    bot.dialog('Help', [
    function (session, args, next) {
        if (!isAttachment(session)) {
            session.dialogData.args = args || {};
            session.conversationData["username"] = null;
            session.conversationData["experience"] = null;
            session.conversationData["reason"] = null;
            builder.Prompts.text(session, "Lets start again! Do you have any general questions about our bank? Perhaps ask about our contact details or opening hours!");
        }
    },
    function (session, results, next) {
            qna.talkToQnA(session, results.response);
    }
    ]).triggerAction({
        matches: 'Help'
    });
    
    







}
