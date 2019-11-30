var app = angular
    .module("Module", ['ngCookies'])    
    .controller("mainController", function ($scope, $http, $cookies, $window) {
        $http.get("data/fullData.json").then(function(response) {
            
            /**
             * ulozi do cookies info o odpovedanej otazke
             * @param {int - index test-u z pola objektov Test[]} testIndex 
             * @param {int - index otazky-u z pola objektov Test[].questions[]} questionIndex 
             * @param {int - index odpovede-u z pola objektov Test[].questions.[].answers[]} answerId              * 
             */
            function setCookies(testIndex, questionIndex, answerId){
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
             * @param {object Test - vid. fullData.json} test 
             * @param {object Test[].questions - vid. fullData.json} question 
             * @param {object Test[].questions[].answers - vid. fullData.json} answer
             * @param {int - index test-u z pola objektov Test} testIndex 
             * @param {int - index test-u z pola objektov Test[].questions[]} questionIndex 
             */
            $scope.isRight = function(answer, test, question, testIndex, questionIndex) {
                //pridam do cookies len pri prvom stlaceni na odpoved
                if(question.answered == null)
                    setCookies(testIndex, questionIndex, answer.id);
                
                if(answer.right == true){
                    //ak uz nebola zodpovedana pripocitam body
                    if(question.answered == null){
                        if (test.points == null)
                            test.points = 0;
                        test.points+=1;
                    }
                    answer.color = "right";                    
                }else{
                    if (test.points == null)
                        test.points = 0;
                    answer.color = "wrong";

                    if($scope.showAnswers == true)
                        question.answers.forEach(function (trueAnswer) {
                            if(trueAnswer.right == true)
                                trueAnswer.color = "right";
                        });
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
             * pomiesa odpovede metodou - zoberie nahodne dve odpovede
             * a prehodi ich medzi sebou
             * @param {object Test[].questions - vid. fullData.json} question 
             */
            function shuffleAnswers(question){
                if($scope.canShuffle == true){
                    id1 = getRandomInt(0,3);
                    id2 = getRandomInt(0,3);
                    tmp = question.answers[id1];

                    question.answers[id1] = question.answers[id2];
                    question.answers[id2] = tmp;
                }
            }

            /**
             * vynuluje body a odpovede pre dany test a premiesa 
             * odpovede, vymaze z cookies
             * @param {object Test - vid. fullData.json} test 
             * @param {int testId - index test-u z pola objektov Test} test 
             */
            $scope.clearTest = function(test, testId){
                test.points = undefined;
                test.questions.forEach(function (question) {
                    question.answered = null;
                    question.answers.forEach(function (answer) {
                        answer.color = null;
                    });

                    //pre vacsiu  nahodnost premiesavam tri krat
                    for(var i = 0; i < 3; i++)
                        shuffleAnswers(question);
                });

                //zmaze cookie
                $cookies.remove(testId);
            }

            /**
             * animacia zmeny spiky v menu vyberu testu
             * @param {object Test - vid. fullData.json} test 
             */
            $scope.changeArrow = function(test){
                test.arrow == "up" ? test.arrow = "down" : test.arrow = "up";

                if (test.arrow == "down"){
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                }
            }

            $scope.changeClassSHBtn = function(test){
                if (test.points < test.questions.length)
                    return "SHBtn_red"                
                if (test.points == test.questions.length)
                    return "SHBtn_gre"
                    
                return "SHBtn_def"
            }

            /////////////////////////MAIN//////////////////////////

            var data = response.data;
            //po nacitani stranky nacitame cookies ak sú
            for(var i = 0; i < data.length; i++){
                //pridanie sipky
                data[i].arrow = "down";
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

            $scope.showAnswers = true;
            $scope.canShuffle = true;
            $scope.Data = data;

        });
    })
