app.directive('message', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/Message.html',
        scope: false
    }

});