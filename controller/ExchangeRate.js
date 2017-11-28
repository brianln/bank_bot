var rest = require('../API/RestClient');
var builder = require('botbuilder');

//Calls 'getYelpData' in RestClient.js with 'displayRestaurantCards' as callback to get list of restaurant information
exports.displayExchangeRateCards = function getRestExchangeRateData(currency, session){
    var url = "http://apilayer.net/api/live?access_key=2920b9967c834bae312aec9c19b8151e&currencies="+currency+"&format=1";
    session.send(currency);
    rest.getRestExchangeRateData(url, session, currency, displayExchangeRateCards);
}

function displayExchangeRateCards(message, session, currency){
    //Parses JSON
    var exchangeJson = JSON.parse(message);
    var name = ("USD"+currency).toUpperCase();
    exRate = exchangeJson.quotes[name];

    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "$" + currency,
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Exchange Rate"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": exRate
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));

}