var Questions;
var Answers;
var Key;

var app = angular
    .module("Module", [])    
    .controller("mainController", function ($scope, $http) {
        $http.get("data/fullData.json").then(function(response) {                       
            var data = response.data;

            console.log(data);

            data.forEach(function (test) {
                test.questions.forEach(function (question) {
                    question.answers.forEach(function (answer) {
                        answer.color = {'background-color': 'white'};
                    });
                });
            });
            
            $scope.Data = data;

            $scope.isRight = function(answer) {
                console.log(answer.right);
                ahoj = answer.right;
                console.log(ahoj);
                if(answer.right == true){
                    console.log("bol som aj tu");
                    answer.color = {'background-color': 'green'};
                }if(answer.right == false){
                    console.log("bol som tu");
                    answer.color = {'background-color': 'red'};
                }
                console.log(answer.right);
              };



        });
    })