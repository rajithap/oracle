angular.module('yapp')
    .factory('actionService', function ($http, $q) {
        var explanations = function (intentResult, entities, prevIntent, prevEntities){

            explanations.ask = function(intentResult, entities){
                console.log("asking for explanations")
                console.log(prevIntent);
                if (!asked && (intentResult == 'add' || intentResult == 'subtract' || intentResult == 'multiply' || intentResult=='divide')){
                    console.log("asking....");
                    actionResult.displayText = "Would you like to learn how to " + intentResult + " these numbers first?";
                    actionResult.spokenText = actionResult.displayText;
                    prevIntent = intentResult;
                    prevEntities = entities;
                    asked = true;
                    console.log("asked");
                    return actionResult;
                }
            }

        }

        var executeIntent = function (query, intentResult, entities, prevIntent, prevEntities, prevResponse) {
            // Computer Aided Learning and Virtual Intelligence Network?
            var actionResult = new Object();
            
            

            actionResult.round = function(number, precision) {
                factor = Math.pow(10, precision);
                tempNumber = number * factor;
                roundedTempNumber = Math.round(tempNumber);
                return roundedTempNumber / factor;
            };

            switch(intentResult)
            {
                case 'asktime':
                    var now = new Date(), ampm = 'am', h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
                    if (h >= 12) {
                        if (h > 12) h -= 12;
                        ampm = 'pm';
                    }
                    if (m < 10) m = '0' + m;
                    if (s < 10) s = '0' + s;
                    actionResult.displayText = "it's " + h + ":" + m + " " + ampm;
                    actionResult.spokenText = "the time is " + h + " " + m + " " + ampm;
                    break;
                case 'shakehand':
                    actionResult.displayText = "Well hello there";
                    actionResult.spokenText = "Well hello there how are you!";
                    break;
                case 'add':
                    sum = 0;
                    if (entities.length == 1 && entities[0].type == "builtin.number"){
                        sum = parseInt(entities[0].entity)*2;
                    }
                    else{
                        for (i=0; i < entities.length; i++){
                            if (entities[i].type == "builtin.number")
                                sum+= parseInt(entities[i].entity);
                        }
                    }

                    actionResult.displayText = "The sum is " + actionResult.round(sum, 4);
                    actionResult.spokenText = actionResult.displayText;
                    prevExplained = false;
                    break;
                case 'subtract':
                    for (i=0; i<entities.length; i++){
                        if (entities[0].type == "builtin.number")
                            diff = parseInt(entities[i].entity);
                            start = i
                            break;
                    }

                    if (entities.length == 1 && entities[0].type == "builtin.number"){
                        txt = entities[0].entity;
                        nums = txt.split(' - ');
                        diff = parseInt(nums[0]);
                        for (i = start; i< nums.length; i++){
                            diff -= parseInt(nums[i]);
                        }
                    }
                    else{
                        if (entities[0].type == "builtin.number") diff = parseInt(entities[0].entity);
                        for (i=1; i < entities.length; i++){
                            if (entities[i].type == "builtin.number")
                                diff-= parseInt(entities[i].entity);
                        }
                    }

                    actionResult.displayText = "The difference is " + actionResult.round(diff,4);
                    actionResult.spokenText = actionResult.displayText;
                    prevExplained = false;
                    break;
                case 'multiply':
                    product = 1;
                    for (i=1; i<entities.length; i++){
                        if (entities[i].type == "builtin.number")
                                product*= parseInt(entities[i].entity);
                    }

                    actionResult.displayText = "The product is " + actionResult.round(product, 4);
                    actionResult.spokenText = actionResult.displayText;
                    prevExplained = false;
                    break;
                case 'divide':
                    for (i=0; i<entities.length; i++){
                        if (entities[0].type == "builtin.number")
                            quot = parseInt(entities[i].entity);
                            start = i
                            break;
                    }
                    
                    for (i=start+1; i<entities.length; i++){
                        if (entities[i].type == "builtin.number")
                                quot /= parseInt(entities[i].entity);
                    }

                    actionResult.displayText = "The quotient is " + actionResult.round(quot, 5);
                    actionResult.spokenText = actionResult.displayText;
                    prevExplained = false;
                    break;
                case 'greetings':
                    actionResult.displayText = "Hello! Nice to meet you!";
                    actionResult.spokenText = actionResult.displayText;
                    break;
                case 'tellname':
                    actionResult.displayText = "My Name is R";
                    actionResult.spokenText = "My Name is R";
                    break;
                case 'askweather':
                    var appurl = "https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='sammamish,wa')&format=json"
                    return $http.get(appurl).then(function (response) {
                        var conditions = response.data.query.results.channel.item.condition.text;
                        console.log(conditions);
                        actionResult.displayText = conditions;
                        actionResult.spokenText = conditions;
                        return actionResult;
                    });                    
                    break;
                case 'None':                    
                    queryString = splitString(query);

                    var appurl = 'https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q='+ queryString; 
                    actionResult.displayText = "Sorry, I am not yet capable of handling that. ";
                    actionResult.spokenText = "Sorry, I am not yet capable of handling that. Try this link: " + appurl;
                    break;
                default:
                    actionResult.displayText = "Sorry, I am not yet capable of handling that.";
                    actionResult.spokenText = actionResult.displayText;
            }   
            return actionResult;
        }

        return {
            ExecuteIntent: function (query, intent, entities, prevIntent, prevEntities, prevResponse) {
                if (prevResponse == "Would you like to learn how to " + prevIntent + " these numbers first?"){
                        if (intent == 'positiveresponse'){
                            return explanations.explain(prevIntent, prevEntities);
                        }
                        return executeIntent(query, prevIntent, prevEntities, "No prev intent", "No prev entities");
                }
                return executeIntent(query, intent, entities, prevIntent, prevEntities);
            }
        };
});
