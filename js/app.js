var app = angular
    .module("Module", [])    
    .controller("mainController", function ($scope, $http) {
        $http.get("data/questions.json").then(function(response) {                       
            $scope.questions = response.data;
        })
        $http.get("data/answers.json").then(function(response) {                       
            $scope.answers = response.data;
        })
        $http.get("data/key.json").then(function(response) {                       
            $scope.key = response.data;
        })       
    })