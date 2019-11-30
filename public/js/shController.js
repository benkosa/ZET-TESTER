/// [reference path="app.js" /]
app
.controller('shController', function($scope, $anchorScroll, $location) {
    $scope.showing = {};
    
    $scope.isShowing = function(id) {
        if (!$scope.showing[id])
            $scope.showing[id] = false;
        
        return $scope.showing[id];
    };
    
    $scope.show = function(id) {
        $scope.showing[id] = true;
    };
    
    $scope.toggle = function(id) {
        $scope.showing[id] = !$scope.showing[id];
    };
})
.directive('alertMe', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<button ng-transclude></button>',
        link: function postLink(scope, element, attrs) {}
    };
});