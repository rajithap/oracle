angular.module('yapp', ['ui.router', 'ngAnimate'])
  .run(['$state', function ($state) {
        $state.transitionTo('home');
    }])
  .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider          
          .state('home', {
            templateUrl: 'views/base.html',
            controller: 'baseController'
          })
  });



