app.factory('messageService', [
    '$http', function ($http) {
        var loadMore = function(mailbox, skip, take) {
            var promise = $http.get('/Home/GetMessageList', {
                params: {
                    mailbox: mailbox,
                    skip: skip,
                    take: take
                }
            });

            return promise;
        };

        var getMessage = function (mailbox, uid) {
            var promise = $http.get('/Home/GetMessage', {
                params: {
                    mailbox: mailbox,
                    uid: uid
                }
            });

            return promise;
        };

        var deleteMessage = function(mailbox, uid) {
            var promise = $http.get('/Home/DeleteMessage', {
                params: {
                    mailbox: mailbox,
                    uid: uid
                }
            });

            return promise;
        }

        return {
            loadMore: loadMore,
            getMessage: getMessage,
            deleteMessage: deleteMessage
        }
    }
]);