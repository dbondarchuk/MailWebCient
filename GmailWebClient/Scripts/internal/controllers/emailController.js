app.controller('emailController', ['$scope', '$compile', 'messageService', function ($scope, $compile, messageService) {
    function showAlert(type, message) {
        var alert = angular.element(document.createElement('alert')),
            alertScope = $scope.$new(true);

        alertScope.type = type;
        alertScope.message = message;
        
        angular.element(document.body).append($compile(alert)(alertScope));
    }

    function getOriginalMessageBody(message) {
        var body = '\n\nOriginal message:\n\n';

        function getAddresses(array) {
            var addresses = [];

            for (var i in array) {
                addresses.push(array[i].address);
            }
            
            return addresses.join('; ');
        }

        body += 'FROM: ' + message.from.address + '\n' +
            'To:' + getAddresses(message.to) + '\n';

        if (message.cc.length > 0) {
            body += 'CC: ' + getAddresses(message.cc) + '\n';
        }

        body += 'Subject: ' + message.subject + '\n\n' + message.body;

        return body;
    }
    
    $scope.values = {
        userAddress: window.user.address,
        mailbox: 0,
        messages: [],
        message: undefined,
        take: 15
    }

    $scope.compose = {}

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

    $scope.delete = function () {
        var result = confirm("Are you sure, that you want to delete message?");
        if (!result) {
            return;
        }

        window.mask.show('body');
        var uid = $scope.values.message.uid;

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

    $scope.reply = function(toAll) {
        function getCc(message) {
            if (!toAll) {
                return '';
            }

            var cc = [];
            for (var i in message.cc) {
                cc.push(message.cc[i].address);
            }

            for (var i in message.to) {
                if (message.to[i].address != window.user.address) {
                    cc.push(message.To[i].address);
                }
            }
            
            return cc.join(';');
        }

        $scope.compose.subject = 'RE: ' + $scope.values.message.subject;
        $scope.compose.to = $scope.values.message.from.address;
        $scope.compose.cc = getCc($scope.values.message);
        $scope.compose.body = getOriginalMessageBody($scope.values.message);

        $scope.showComposeMessageModal();
    }

    $scope.forward = function() {
        $scope.compose.subject = 'FW: ' + $scope.values.message.subject;
        $scope.compose.body = getOriginalMessageBody($scope.values.message);

        $scope.showComposeMessageModal();
    }

    $scope.send = function() {
        if ($scope.composeForm.$invalid) {
            return;
        }

        window.mask.show('body');

        var message = $scope.compose;
        messageService.sendMessage(message.subject, message.to, message.cc, message.bcc, message.body).then(function (response) {
            //angular.element('#composeMessageModal').modal('hide');
            $scope.hideComposeMessageModal();
            showAlert('success', 'Message was successfully sent!');

            window.mask.hide('body');
        }, function (error) {
            showAlert('error', 'Some error was occured during sending the message');

            window.mask.hide('body');
        });
    }

    angular.element(document).ready(function() {
        $scope.loadMessagesList();
    });
}]);