var rest = require('../API/RestClient');

exports.displayFeedback = function getFeedback(session, username){
    var url = 'https://bankbotbrian.azurewebsites.net/tables/bankbot';
    session.sendTyping();                                                
    rest.getFeedback(url, session, username, handleFeedbackResponse)
};

function handleFeedbackResponse(message, session, username) {
    var feedbackResponse = JSON.parse(message);
    var experienceList = [];
    var reasonList = [];
    for (var index in feedbackResponse) {
        var usernameReceived = feedbackResponse[index].username;
        var experienceReceived = feedbackResponse[index].experience; 
        var reasonReceived = feedbackResponse[index].reason;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(feedbackResponse.length - 1) {
                experienceList.push(experienceReceived);
                reasonList.push(reasonReceived);
            }
            else {
                experienceList.push(experienceReceived + ', ');
                experienceList.push(reasonReceived + ', ');
            }
        }        
    }
    // Print all 
    session.send("%s, your previous experience with us is: \"%s.\". \nWith the reasons: \"%s.\"", username, experienceList, reasonList);                 
}




exports.sendFeedback= function postFeedback(session, username, experience, reason){
    var url = 'https://bankbotbrian.azurewebsites.net/tables/bankbot';
    rest.postFeedback(url, username, experience, reason);
};




exports.deleteFeedback = function deleteFeedback(session, username, experience){
    var url  = 'https://bankbotbrian.azurewebsites.net/tables/bankbot';

    rest.getFeedback(url,session, username,function(message,session, username){
     var feedbackResponse = JSON.parse(message);
        for(var i in feedbackResponse) {
            if (feedbackResponse[i].experience === experience && feedbackResponse[i].username === username) {
                rest.deleteFeedback(url, session, username, experience, feedbackResponse[i].id ,handleDeletedFeedbackResponse)
            }
        }
    });
};

function handleDeletedFeedbackResponse(body, session, username, favouritefood){
    //console.log('Done');
    session.send("Delete successful");
};