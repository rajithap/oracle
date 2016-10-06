angular.module('yapp')
    .factory('actionService', function ($http, $q) {
        var executeIntent = function (intentResult,entities) {

            var actionResult = new Object();
            console.log(intentResult);
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
                    actionResult.displayText = "Hi, I'm still learning to add!";
                    actionResult.spokenText = "I'm still learning to add!";
                    break;
                 case 'greetings':
                    actionResult.displayText = "Well hello there";
                    actionResult.spokenText = "Hi!";
                    break;
                case 'tellname':
                    actionResult.displayText = "My Name is Sahya Charan Robot";
                    actionResult.spokenText = "My Name is Sahya Charan Robot";
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
                    actionResult.displayText = "Sorry I am not yet capable of handling "+intentResult;
                    actionResult.spokenText = actionResult.displayText
            }   
            return actionResult;
        }

        return {
            ExecuteIntent: function (intent) {
                return executeIntent(intent);
            }
        };
});
