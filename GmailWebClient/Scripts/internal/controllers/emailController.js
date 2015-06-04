app.controller('emailController', ['$scope', '$compile', 'messageService', function ($scope, $compile, messageService) {
    function showAlert(type, message) {
        var alert = angular.element(document.createElement('alert')),
            alertScope = $scope.$new(true);

        alertScope.type = type;
        alertScope.message = message;
        
        angular.element(document.body).append($compile(alert)(alertScope));
    }

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

    $scope.delete = function (uid) {
        var result = confirm("Are you sure, that you want to delete message?");
        if (!result) {
            return false;
        }

        window.mask.show('body');
        messageService.deleteMessage($scope.values.mailbox, uid).then(function (response) {
            $scope.values.message = null;
            for (var id in $scope.values.messages) {
                var message = $scope.values.messages[id];
                if (message.uid == uid) {
                    $scope.values.messages.splice(id, 1);
                    break;
                }
            }

            showAlert('success', 'Message was successfully deleted!');

            window.mask.hide('body');
        }, function (error) {
            showAlert('error', 'Some error was occured during deleting the message');

            window.mask.hide('body');
        });
    }

    

    angular.element(document).ready(function() {
        $scope.loadMessagesList();
    });
}]);