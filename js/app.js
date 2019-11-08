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

            //console.log(Answers["1a"])

            
            Tests.forEach(function (test) {
                //console.log(test.name);
                test.questions = []
                for(var i = test.from; i <= test.to; i++){
                    //console.log(i);
                    question = {};
                    question.question = Questions[i.toString()]; 

                    question.answers = [];
                    
                    right = Key[i.toString()];
                    
                    switch(right){
                        case "a":
                                question.answers.push({"answer":Answers[i + "a"], "right":"true"});
                                question.answers.push({"answer":Answers[i + "b"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "c"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "d"], "right":"false"});
                        break;
                        case "b":
                                question.answers.push({"answer":Answers[i + "a"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "b"], "right":"true"});
                                question.answers.push({"answer":Answers[i + "c"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "d"], "right":"false"});
                        break;
                        case "c":
                                question.answers.push({"answer":Answers[i + "a"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "b"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "c"], "right":"true"});
                                question.answers.push({"answer":Answers[i + "d"], "right":"false"});
                        break;
                        case "d":
                                question.answers.push({"answer":Answers[i + "a"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "b"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "c"], "right":"false"});
                                question.answers.push({"answer":Answers[i + "d"], "right":"true"});
                        break;

                    }
                    test.questions.push(question);

                }
            });
            console.log(Tests);

            $scope.Data = Tests;
        });
    })