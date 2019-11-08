var Questions;
var Answers;
var Key;

var app = angular
    .module("Module", [])    
    .controller("mainController", function ($scope, $http) {
        $http.get("data/questions.json").then(function(response) {                       
            Questions = response.data;
        });
        $http.get("data/answers.json").then(function(response) {                       
            Answers = response.data;
        });
        $http.get("data/key.json").then(function(response) {                       
            Key = response.data;
        });
        $http.get("data/tests.json").then(function(response) {                       
            Tests = response.data;
            
            /*
            Tests.forEach(function (test) {
                console.log(test);
            });*/
            for (let label in Key){
                var intLabel = parseInt(label);
                console.log(intLabel);
                console.log(Key[intLabel]);
            }
            //console.log(Key);
            /*
            Key.forEach(function (test) {
                console.log(test);
            });*/

            $scope.Data = Tests;
        });
    })