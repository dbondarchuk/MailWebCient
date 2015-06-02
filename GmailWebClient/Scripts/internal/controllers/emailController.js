app.controller('emailController', ['$scope', 'messageService', function ($scope, messageService) {
    $scope.values = {
        userAddress: window.user.address,
        mailbox: 0,
        messages: [],
        message: undefined,
        take: 15
    }

    $scope.loadMessagesList = function() {
        window.mask.show('#list');
        messageService.loadMore($scope.values.mailbox, $scope.values.messages.length, $scope.values.take).then(function (response) {
            var data = response.data;

            for (var i in data) {
                $scope.values.messages.push(data[i]);
            }

            window.mask.hide('#list');
        });
    }

    $scope.loadMessage = function(uid) {
        window.mask.show('body');
        messageService.getMessage($scope.values.mailbox, uid).then(function (response) {
            $scope.values.message = response.data;
            for (var i in $scope.values.messages) {
                var message = $scope.values.messages[i];
                if (message.uid == $scope.values.message.uid) {
                    message.rawFlags.push('\\Seen');
                    break;
                }
            }

            window.mask.hide('body');
        });
    }

    $scope.changeMailbox = function(mailbox) {
        $scope.values.mailbox = mailbox;
        $scope.values.messages = [];

        $scope.loadMessagesList();
    }

    angular.element(document).ready(function() {
        $scope.loadMessagesList();
    });
}]);