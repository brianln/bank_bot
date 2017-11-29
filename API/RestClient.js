var request = require('request');

exports.getRestExchangeRateData = function getData(url, session, callback){

    request.get(url, function processGetRequest(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session);
        }
    });
};


exports.getFeedback = function getData(url, session, username, callback){
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};


exports.postFeedback = function SendData(url, username, experience, reason){
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "experience" : experience,
            "reason" : reason
        }
      };      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};



exports.deleteFeedback = function deleteData(url, session, username, experience, id, callback){
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };
    request(options, function(err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body, session, username, experience);
        }else {
            console.log(err);
            console.log(res);
        }
    })

};