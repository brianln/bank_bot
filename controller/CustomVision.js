var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/99204953-e0d3-4b25-a018-c37a3aa69c8e/url?iterationId=c4c24374-8064-43b6-bf63-b6775fd51f6e',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '5840d29d3a324ec8845a4d234a53a9a0'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}