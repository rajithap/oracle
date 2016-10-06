'use strict';
angular.module('yapp').controller('baseController', function ($scope, $state, $http, actionService) {
    if (!('webkitSpeechRecognition' in window))
    {
        alert('this browser does not support ');
        return;
    }

    $scope.element = {
        "x": 350,
        "y": 150
    };
    $scope.fontSize = 32;
    $scope.text = "Foo Bar!";
    
    $scope.displayText = "";
    $scope.$state = $state;
    $scope.recognition = new webkitSpeechRecognition();
    $scope.recognition.continuous = false;
    $scope.recognition.interimResults = true;    
    $scope.recognition.lang = 'en-US';
    
    $scope.recognizing = false;
    $scope.ignore_onend = false;
    $scope.start_timestamp;
    $scope.start_img = 'mic.gif'
    
    $scope.interim_transcript = '';

    $scope.recognition.onstart = function () {
        $scope.recognizing = true;
        $scope.final_transcript = '';
        $scope.interim_transcript = '';
        $scope.start_img = 'mic-animate.gif';
    };

    $scope.recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            $scope.start_img = 'mic.gif';                    
            $scope.ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            $scope.start_img.src = 'mic.gif';                    
            $scope.ignore_onend = true;
        }
        if (event.error == 'not-allowed') {                    
            $scope.ignore_onend = true;
        }
    };

    $scope.recognition.onend = function () {
        $scope.recognizing = false;

        if ($scope.ignore_onend) {
            return;
        }
        $scope.start_img = 'mic.gif';
        if (!$scope.final_transcript) {
            return;
        }
        $scope.ttsstring = "i heard " + $scope.final_transcript;

        var apppurl = 'https://api.projectoxford.ai/luis/v1/application?id=4d92f786-a859-420c-93f3-695d0f17baed&subscription-key=bf8bd31bf4344e7ab98c26c7c0b4855e&q=' +  $scope.final_transcript + '\'';
        $http.get(apppurl).then(function (response) {
            $scope.appresponse = response;
            console.log(response);
           if ($scope.appresponse.status == '200') {
                var intents = $scope.appresponse.data.intents;
                var entities = $scope.appresponse.data.entities;
                console.log(entities);  
                console.log(entities.length);
                var topintentscore = parseFloat(intents[0].score);;
                var topintent = 0;
                for ( var t = 0; t < intents.length; t++)
                {
                    var itscore = parseFloat(intents[t].score);
                    if (itscore > topintentscore)
                    {
                        topintent = t; 
                    }                    
                }
                console.log(intents[topintent].intent);
                console.log(entities)
                var intentResult = actionService.ExecuteIntent(intents[topintent].intent, entities);
                $scope.ttsstring = intentResult.spokenText;
                $scope.displayText = intentResult.displayText;
                $scope.playtts();                
            }            
        });
    };

    $scope.playtts = function () {
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[10]; // Note: some voices don't support altering params
        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1
        msg.rate = 0.8; // 0.1 to 10
        msg.pitch = 0; //0 to 2
        msg.text = $scope.ttsstring
        msg.lang = 'en-US';        
        speechSynthesis.speak(msg);
        console.log($scope.ttsstring);
    }

    $scope.recognition.onresult = function (event) {
        $scope.interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                $scope.final_transcript += event.results[i][0].transcript;
                console.log($scope.final_transcript);
            } else {
                $scope.interim_transcript += event.results[i][0].transcript;
                console.log($scope.interim_transcript);
            }
        }
        $scope.$apply();
    };

    $scope.startdialog = function () {
        if ($scope.recognizing)
        {
            $scope.recognition.stop();
            return;
        }
        $scope.recognition.start();
        $scope.ignore_onend = false;
        $scope.start_img = 'mic-slash.gif';        
        $scope.start_timestamp = event.timeStamp;
    }
});









