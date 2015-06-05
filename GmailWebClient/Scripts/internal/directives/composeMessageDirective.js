app.directive('compose', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/Templates/Compose.html',
        scope: false,
        link: function (scope, element, attr) {
            scope.emailRegex = '(([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)(\\s*;\\s*|\\s*$))*';
            element.find('input[data-type=email]').tagThis({
                autocompleteSource: '/Home/GetAddressList',
                noDuplicates: true,
                email: true,
                defaultText: '',
                createTagWith: [44, 59, 32], // coma, semi-colon, space
                callbacks: {
                    onChange: function (data) {
                        data.context.val(data.tags.map(function (val, i) {
                            return val.text;
                        }).join(';')).trigger('input'); // temporary fix
                    }
                }
            });

            element.on('hidden.bs.modal', function (e) {
                element.find('form')[0].reset();
                element.find('input[data-type=email]').each(function() {
                    $(this).clearAllTags();
                });

                scope.compose = {};
                scope.$apply();

                scope.composeForm.$setPristine();
                scope.composeForm.$dirty = false;
            });

            element.on('shown.bs.modal', function (e) {
                function setEmailTags(adresses, elementId) {
                    if (typeof adresses === "string") {
                        adresses = adresses.split(/,|;/g);
                    }

                    for (var i in adresses) {
                        angular.element('#' + elementId).addTag(adresses[i].trim());
                    }
                }

                if (scope.compose) {
                    if (!!scope.compose.to) {
                        setEmailTags(scope.compose.to, 'to');
                    }
                    if (!!scope.compose.cc) {
                        setEmailTags(scope.compose.cc, 'cc');
                    }
                    if (!!scope.compose.bcc) {
                        setEmailTags(scope.compose.bcc, 'bcc');
                    }
                }

                scope.composeForm.$rollbackViewValue();
                scope.composeForm.$dirty = false;
                angular.element('#subject').focus();
            });

            scope.showComposeMessageModal = function() {
                element.modal('show');
            }

            scope.hideComposeMessageModal = function() {
                element.modal('hide');
            }
        }
    }
});