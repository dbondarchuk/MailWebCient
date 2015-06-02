app.filter('messageBody', ['$sce', function ($sce) {
    return function (input) {
        return input ? $sce.trustAsHtml('<p>' + input.replace(/\n/g, '</p><p>') + '</p>') : input;
    };
}]);