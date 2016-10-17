﻿angular.module('yapp')
    .factory('actionService', function ($http, $q) {
        var executeIntent = function (intentResult, entities) {
            // Computer Aided Learning and Virtual Intelligence Network
            var actionResult = new Object();
            console.log(intentResult);
            console.log(entities);
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

                    actionResult.displayText = "it's " + h + " " + m + " " + ampm;
                    actionResult.spokenText = "now the time is " + h + " " + m + " " + ampm;
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

                    actionResult.displayText = "The sum is " + sum;
                    actionResult.spokenText = actionResult.displayText;
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

                    actionResult.displayText = "The difference is " + diff;
                    actionResult.spokenText = actionResult.displayText;
                    break;
                case 'multiply':
                    product = 1;
                    for (i=1; i<entities.length; i++){
                        if (entities[i].type == "builtin.number")
                                product*= parseInt(entities[i].entity);
                    }

                    actionResult.displayText = "The product is " + product;
                    actionResult.spokenText = actionResult.displayText;
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

                    actionResult.displayText = "The quotient is " + quot;
                    actionResult.spokenText = actionResult.displayText;
                    break;
                case 'greetings':
                    actionResult.displayText = "Hi! Nice to meet you!";
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
                default:
                    actionResult.displayText = "Sorry I am not yet capable of handling that.";
                    actionResult.spokenText = actionResult.displayText
            }   
            return actionResult;
        }

        return {
            ExecuteIntent: function (intent, entities) {
                return executeIntent(intent, entities);
            }
        };
});
