var app = angular
    .module("Module", ['ngCookies', 'ngSanitize'])    
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
             * ulozi do cookies info o nastaveniach
             * @param {string - type of cookies} type 
             * @param {boolean } value 
             */
            $scope.setCookiesSettings = function(type, value){
                //pocitanie expiracnej doby pre cookies
                var now = new $window.Date(),
                expireDate = new $window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());

                var strCookies = $cookies.get("settings");
                //deklaruje objekt pre cookkies
                cookies = {};
                
                //ak uz nejake cookies exzistuju tak ich vitiahneme
                if(strCookies != undefined){
                    //cookies su string takze ich treba parsovat do json
                    cookies = JSON.parse(strCookies);
                }
                
                cookies[type] = value;
                console.log(cookies);
                $cookies.put("settings", JSON.stringify(cookies), {'expires': expireDate});            
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
            $scope.isCorrect = function(answer, test, question, testIndex, questionIndex) {
                //pridam do cookies len pri prvom stlaceni na odpoved
                if(question.answered == null)
                    setCookies(testIndex, questionIndex, answer.id);
                
                if(answer.isCorrect == true){
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
                            if(trueAnswer.isCorrect == true)
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
                if($scope.canShuffle == false)
                    return;

                max = question.answers.length - 1;
                repeatTo = question.answers.length/2;

                for(i = 0; i < repeatTo; i++){
                    id1 = getRandomInt(0,max);
                    id2 = getRandomInt(0,max);
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

                    shuffleAnswers(question);
                });

                //zmaze cookie
                $cookies.remove(testId);
            }

            /**
             * animacia zmeny spiky v menu vyberu testu
             * detekcia aktualne nascrolovania
             * @param {object Test - vid. fullData.json} test 
             */
            var lastScroll = 0;
            var mainSize = 0;
            $scope.changeArrow = function(test){
                test.arrow == "up" ? test.arrow = "down" : test.arrow = "up";

                if (test.arrow == "down"){
                    //ak sa nachadzame este vo velkosti stranky tak nescrolujeme na top
                    if(document.documentElement.scrollTop > mainSize )
                        document.documentElement.scrollTo(0,lastScroll);
                }else
                    //poznacime sa velkost stranky
                    if(mainSize == 0) mainSize = document.getElementById('main2').clientHeight;
                    //aktualnu poziciu scrolu si zmenim len ak nieje nic rozbalene
                    if(document.documentElement.scrollTop < mainSize )
                        lastScroll = document.documentElement.scrollTop;
                    
            }

            $scope.changeClassSHBtn = function(test){
                if (test.points < test.questions.length)
                    return "SHBtn_red"                
                if (test.points == test.questions.length)
                    return "SHBtn_gre"
                    
                return "SHBtn_def"
            }

            /////////////////////////MAIN//////////////////////////

            /**
             * cookies nastavenia
             */
            $scope.showAnswers = true;
            $scope.canShuffle = true;
            strCookie = $cookies.get("settings");
            if(strCookie){
                cookie = JSON.parse(strCookie);
                $scope.showAnswers = cookie.showAnswers;
                $scope.canShuffle = cookie.canShuffle;
            }

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
                            $scope.isCorrect(answers, data[i], questions);
                        }    
                    });
                }                
            }

            /**
             * schovavanie a zobrazovanie nazvu test pri scrolovani
             */
            var prevScrollpos = window.pageYOffset;
            window.onscroll = function() {                
                var currentScrollPos = window.pageYOffset;
                if (prevScrollpos > currentScrollPos) {
                    for(var i = 0; i < data.length; i++)
                        document.getElementById(i).style.top = "0";
                } else {
                    for(var i = 0; i < data.length; i++){
                        var divHeight = document.getElementById(i).clientHeight * -1 -1;
                        document.getElementById(i).style.top = divHeight+"px";
                    }
                }
                prevScrollpos = currentScrollPos;                
            }

            $scope.Data = data;

        });

    })
