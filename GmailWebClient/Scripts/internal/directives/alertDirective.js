app.directive('alert', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/Alert.html',
        scope: false,
        link: function(scope, element, attrs) {
            element.find('.close').click(function() {
                element.fadeOut(500, function() {
                    element.remove();
                });
            });

            if (!scope.notHide) {
                $timeout(function() {
                    element.find('.close').click();
                }, 10000);
            }
        }
    }
}]);