var rest = require('../API/RestClient');
var builder = require('botbuilder');

//Calls 'getYelpData' in RestClient.js with 'displayRestaurantCards' as callback to get list of restaurant information
exports.displayExchangeRateCards = function getRestExchangeRateData( session){
    var url = "http://apilayer.net/api/live?access_key=2920b9967c834bae312aec9c19b8151e&currencies=NZD,AUD,GBP,CNY,JPY&format=1";
    rest.getRestExchangeRateData(url, session, displayExchangeRateCards);
}

function displayExchangeRateCards(message, session){
    //Parses JSON
    var exchangeJson = JSON.parse(message);

    items = [];
    for(var i in exchangeJson.quotes){
        var dict = {}
        dict.title = i;
        dict.value = String(exchangeJson.quotes[i]);
        items.push(dict);

        //console.log(exchangeJson.quotes[i]);
        //ll
    }

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
                            "text": "Exchange Rate" ,
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": ""
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
                                            "facts": items
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