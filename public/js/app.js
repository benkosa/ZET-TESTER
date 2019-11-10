var app = angular
    .module("Module", ['ngCookies'])    
    .controller("mainController", function ($scope, $http, $cookies, $window) {
        $http.get("data/fullData.json").then(function(response) {
            
            /**
             * prida do cookies ze bola zodpovedana otazka
             */
            $scope.setCookies = function(testIndex, questionIndex, answerId){
                //pocitanie expiracnej doby pre cookies
                var now = new $window.Date(),
                expireDate = new $window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());

                var strCookies = $cookies.get(testIndex);
                //deklaruje objekt pre cookkies
                cookies = {};
                cookies.a = [];
                
                //ak uz nejake cookies exzistuju tak ich vitiahneme
                if(strCookies != undefined){
                    //cookies su string takze ich treba parsovat do json
                    cookies = JSON.parse(strCookies);
                }
                
                cookies.a[questionIndex] = {'q': questionIndex, 'a':answerId};
                $cookies.put(testIndex, JSON.stringify(cookies), {'expires': expireDate});            
            }

            /**
             * volam pri stalceni na odpoved
             * @param {treba si pozriet strukturu dat vo fullData.json}
             */
            $scope.isRight = function(answer, test, question, testIndex, questionIndex) {
                //pridam do cookies len pri prvom stlaceni na odpoved
                if(question.answered == null)
                    $scope.setCookies(testIndex, questionIndex, answer.id);
                
                if(answer.right == true){
                    //ak uz nebola zodpovedana pripocitam body
                    if(question.answered == null)
                        test.points++;  
                    answer.color = {'background-color': 'rgb(31, 71, 12)'};                    
                }else{
                    answer.color = {'background-color': 'rgb(136, 59, 59)'};
                }
                //nastavim ze uz otazka bola zodpovedana
                //ochrana aby body pripocitavalo len ked trafim
                //odpoved na prvy krat
                question.answered = true;
            };    

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
             * vynuluje body a odpovede pre dany test a premiesa odpovede
             * @param {treba si pozriet strukturu dat vo fullData.json} test 
             */
            $scope.clearTest = function(test, testId){
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
                $cookies.remove(testId);
            }

            /////////////////////////MAIN//////////////////////////

            var data = response.data;
            //prehladavame vsetky cookies
            for(var i = 0; i < data.length; i++){
                strCookie = $cookies.get(i);
                //ak nasiel cookie
                if(strCookie != undefined){
                    cookie = JSON.parse(strCookie);
                    //testujeme vsetky odpovede z cookies
                    cookie.a.forEach(function(answer){    
                        if(answer != null){
                            answers = data[i].questions[answer.q].answers[answer.a];
                            questions = data[i].questions[answer.q];
                            $scope.isRight(answers, data[i], questions);
                        }    
                    });
                }                
            }

            $scope.Data = data;

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