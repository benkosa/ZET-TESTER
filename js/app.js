var app = angular
    .module("Module", [])    
    .controller("mainController", function ($scope, $http) {
        $http.get("data/fullData.json").then(function(response) {                       
            var data = response.data;
            console.log(data);            
            $scope.Data = data;

            /**
             * generuje random int od @param min do @param max 
             */
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            /**
             * pomiesa odpovede metodou ze zoberie nahodne dve odpovede
             * a prehodi ich medzi sebou
             * @param {treba si pozriet strukturu dat vo fullData.json} question 
             */
            function shuffleAnswers(question){
                id1 = getRandomInt(0,3);
                id2 = getRandomInt(0,3);
                tmp = question.answers[id1];

                question.answers[id1] = question.answers[id2];
                question.answers[id2] = tmp;
            }

            /**
             * volam pri stalceni na odpoved
             * @param {treba si pozriet strukturu dat vo fullData.json}
             */
            $scope.isRight = function(answer, test, question) {
                if(answer.right == true){
                    //ak uz nebola zodpovedana pripocitam body
                    if(question.answered == null){
                        test.points++;
                    }    
                    answer.color = {'background-color': 'green'};
                }else{
                    answer.color = {'background-color': 'red'};
                }
                //nastavim ze uz otazka bola zodpovedana
                //ochrana aby body pripocitavalo len ked trafim
                //odpoved na prvy krat
                question.answered = true;
            };

            /**
             * vynuluje body a odpovede pre dany test a premiesa odpovede
             * @param {treba si pozriet strukturu dat vo fullData.json} test 
             */
            $scope.clearTest = function(test){
                test.points = 0;
                test.questions.forEach(function (question) {
                    question.answered = null;
                    question.answers.forEach(function (answer) {
                        answer.color = {'background-color': null};
                    });

                    //pre vacsiu  nahodnost premiesavam tri krat
                    for(var i = 0; i < 3; i++)
                        shuffleAnswers(question);
                });
            }
        });
    })

    /**
            data.forEach(function (test) {
                test.points = 0;
                test.questions.forEach(function (question) {
                    question.answered = false;
                    question.answers.forEach(function (answer) {
                        answer.color = {'background-color': 'white'};
                    });
                });
            });
     */