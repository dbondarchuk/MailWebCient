window.messages = [];
window.loaded = 0;

/*function loadMessagesList(skip, take, clearList) {
    var mailbox = $('#mailbox-list li.active').data('value');
    $.ajax({
        url: '/Home/GetMessageList',
        data: {
            mailbox: mailbox,
            skip: skip,
            take: take
        },
        beforeSend: function () {
            window.mask.show($('#list'));
        },
        success: function(data) {
            var template = '<a href="#" onclick="loadMessage({{scope.uid}}); return false;" data-uid="{{scope.uid}}">' +
                '<div class="email-item email-item-selected pure-g">' +
                '<div class="pure-u">' +
                '<img class="email-avatar" alt="{{scope.name}}" height="64" width="64" src="/Images/avatar.png">' +
                '</div>' +
                '<div class="pure-u-3-4">' +
                '<h5 class="email-name">{{scope.name}}</h5>' +
                '<h4 class="email-subject">{{scope.subject}}</h4>' +
                '<p class="email-desc">' +
                '{{scope.shortDescription}}' +
                '</p>' +
                '</div>' +
                '</div>' +
                '</a>';

            if (clearList) {
                $('#list .list').html('');
                window.loaded = 0;
            }

            for (var i in data) {
                var message = data[i],
                    description = message.Body.toString().substring(0, 100),
                    scope = {
                        uid: message.Uid,
                        name: message.From.DisplayName || message.From.Address,
                        subject: message.Subject,
                        shortDescription: description ? description + '...' : message.Body.toString()
                    },
                    insertion = Handlebars.compile(template)({ scope: scope });

                window.messages[message.Uid] = message;

                $('#list .list').append(insertion);
            }

            window.loaded += data.length;
        },
        complete: function() {
            window.mask.hide($('#list'));
        }
    });
}*/

function loadMessage(uid) {
    window.mask.show($('#main'));

    try {
        var template = '<div class="email-content">' +
        '<div class="email-content-header pure-g">' +
        '<div class="pure-u-1-2">' +
        '<h1 class="email-content-title">{{scope.subject}}</h1>' +
        '<p class="email-content-subtitle">' +
        'From <a>{{scope.name}}</a> at <span>{{scope.date}}</span>' +
        '</p>' +
        '{{#if scope.to}}<p class="email-content-subtitle">' +
        'TO: {{#each scope.to}}<span>{{#if this.DisplayName}}{{this.DisplayName}}{{else}}{{this.Address}}{{/if}}<span>; {{/each}}' +
        '</p>{{/if}}' +
        '{{#if scope.cc}}<p class="email-content-subtitle">' +
        'CC: {{#each scope.cc}}<span>{{#if this.DisplayName}}{{this.DisplayName}}{{else}}{{this.Address}}{{/if}}<span>; {{/each}}' +
        '</p>{{/if}}' +
        '{{#if scope.bcc}}<p class="email-content-subtitle">' +
        'BCC: {{#each scope.bcc}}<span>{{#if this.DisplayName}}{{this.DisplayName}}{{else}}{{this.Address}}{{/if}}<span>{{/each}}' +
        '</p>{{/if}}' +
        '{{#if scope.attachments}}<p class="email-content-subtitle">' +
        'Attachments: {{#each scope.attachments}}<a href="/Home/GetAttachment?uid={{../scope.uid}}&mailbox={{../scope.mailbox}}&attachmentId={{@index}}">{{this.Filename}}</a>; {{/each}}' +
        '</p>{{/if}}' +
        '</div>' +
        '<div class="email-content-controls pure-u-1-2">' +
        '<button class="secondary-button pure-button" onclick="reply({{scope.uid}}, false); return false;">Reply</button>' +
        '<button class="secondary-button pure-button" onclick="reply({{scope.uid}}, true); return false;">Reply all</button>' +
        '<button class="secondary-button pure-button" onclick="forward({{scope.uid}}); return false;">Forward</button>' +
        '<button class="secondary-button pure-button" onclick="deleteMessage({{scope.uid}}); return false;">Delete</button>' +
        /*'<button class="secondary-button pure-button" onclick="reply({{scope.uid}}; return false;">Move to</button>' +*/
        '</div>' +
        '</div>' +
        '<div class="email-content-body">' +
        '{{scope.body}}' +
        '</div>' +
        '</div>';

        var message = window.messages[uid],
            scope = {
                uid: message.Uid,
                name: message.From.DisplayName || message.From.Address,
                subject: message.Subject,
                cc: message.Cc,
                to: message.To,
                bcc: message.Bcc,
                attachments: message.Attachments,
                mailbox: $('#mailbox-list li.active').data('value'),
                body: Handlebars.compile('<p>' + message.Body.replace(/\n/g, '</p><p>') + '</p>')({}),
                date: formatDate(message.Date)
            },
            $insertion = $(Handlebars.compile(template)({ scope: scope }));

        $insertion.find('.email-content-body').html($insertion.find('.email-content-body').text());
        $('#main').html($insertion);
    } finally {
        window.mask.hide($('#main'));
    } 
}

function reply(uid, toAll) {
    var message = messages[uid];

    function getCc() {
        if (!toAll) {
            return '';
        }

        var cc = '';
        for (var i in message.Cc) {
            cc += message.Cc[i].Address + '; ';
        }
        
        for (var i in message.To) {
            if (message.To[i].Address != window.user.address) {
                cc += message.To[i].Address + '; ';
            }
        }
        
        if (cc.substring(cc.length - 2, cc.length - 1) == '; ') {
            cc = cc.substring(0, cc.length - 2);
        }

        return cc;
    }
    
    $('#To').val(message.From.Address);
    $('#Subject').val('RE: ' + message.Subject);
    $('#Cc').val(getCc());

    $('#Body').val(getOriginalMessageBody(message));

    $('#composeMessageModal').modal('show');
}

function forward(uid) {
    var message = messages[uid];

    $('#Subject').val('FW: ' + message.Subject);

    $('#Body').val(getOriginalMessageBody(message));

    $('#composeMessageModal').modal('show');
}

function getOriginalMessageBody(message) {
    var body = '\n\nOriginal message:\n\n';

    function getAddresses(array) {
        var addresses = '';

        for (var i in array) {
            addresses += array[i].Address + '; ';
        }

        if (addresses.substring(addresses.length - 2, addresses.length - 1) == '; ') {
            addresses = addresses.substring(0, addresses.length - 2);
        }

        return addresses;
    }

    body += 'FROM: ' + message.From.Address + '\n' +
        'To:' + getAddresses(message.To) + '\n';

    if (message.Cc.length > 0) {
        body += 'CC: ' + getAddresses(message.Cc) + '\n';
    }

    body += 'Subject: ' + message.Subject + '\n\n' + message.Body;

    return body;
}

function deleteMessage(uid) {
    $.ajax({
        url: '/Home/DeleteMessage',
        data: {
            uid: uid
        },
        beforeSend: function() {
            var r = confirm("Are you sure, that you want to delete message?");
            if (!r) {
                return false;
            }

            window.mask.show($('body'));
        },
        success: function() {
            window.loaded--;
            window.messages.splice(window.messages.indexOf(window.messages[uid]), 1);
            $('#main').html('');
            $('#list [data-uid=' + uid + ']').remove();

            var $alert = $('<div class="alert-fixed-top">' +
                '<div style="padding: 5px;">' +
                '<div id="inner-message" class="alert alert-success alert-dismissible">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                'Message successfully deleted' +
                '</div>' +
                '</div>' +
                '</div>');

            $alert.find('.close').click(function() {
                $alert.fadeOut(500, function() {
                    $alert.remove();
                });
            });

            $('body').append($alert);
            setTimeout(function() {
                $alert.find('.close').click();
            }, 10000);
        },
        complete: function() {
            window.mask.hide($('body'));
        }
    });
}

function beforeMessageSend() {
    window.mask.show($('body'));
}

function onSuccessSentMessage() {
    var $alert = $('<div class="alert-fixed-top">' +
                '<div style="padding: 5px;">' +
                '<div id="inner-message" class="alert alert-success alert-dismissible">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                'Message was successfully sent' +
                '</div>' +
                '</div>' +
                '</div>');

    $alert.find('.close').click(function () {
        $alert.fadeOut(500, function () {
            $alert.remove();
        });
    });

    $('body').append($alert);
    setTimeout(function () {
        $alert.find('.close').click();
    }, 10000);

    $('#composeMessageModal').modal('hide');
}

function onFailedSentMessage() {
    var $alert = $('<div class="alert-fixed-top">' +
                '<div style="padding: 5px;">' +
                '<div id="inner-message" class="alert alert-error alert-dismissible">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                'Message was failed to sent. Please try on more time' +
                '</div>' +
                '</div>' +
                '</div>');

    $alert.find('.close').click(function () {
        $alert.fadeOut(500, function () {
            $alert.remove();
        });
    });

    $('body').append($alert);
    setTimeout(function () {
        $alert.find('.close').click();
    }, 10000);
}

function onCompleteMessageSent() {
    window.mask.hide($('body'));
}

function changeMailbox(mailbox) {
    $('#mailbox-list li[data-value!=' + mailbox + ']').removeClass('active');
    $('#mailbox-list li[data-value=' + mailbox + ']').addClass('active');

    loadMessagesList(0, 20, true);
}

function formatDate(dateJson) {
    var date = new Date(parseInt(dateJson.replace(/\/Date\((-?\d+)\)\//, '$1')));
    return date.toLocaleString();
}

function mask() {
    var $maskElement = $('<div class="mask">' +
        '<img class="center-block" src="Images/loader.gif" />' +
        '</div>');

    function show($element, callback) {
        if (typeof $element === "string") {
            $element = $($element);
        }

        $maskElement.hide();
        $element.append($maskElement);
        $maskElement.css('height', $element[0].scrollHeight);
        $maskElement.fadeIn(500, callback);
    }

    function hide($element, callback) {
        if (typeof $element === "string") {
            $element = $($element);
        }

        var $mask = $element.children('.mask');
        $mask.fadeOut(500, function () {
            $mask.remove();
            if (callback) {
                callback();
            }
        });
    }

    return {
        show: show,
        hide: hide
    };
}

window.mask = mask();

$(document).ready(function() {
    /*loadMessagesList(0, 20, false);*/

    $('#composeMessageModal').on('hidden.bs.modal', function(e) {
        $('#composeMessageModal form')[0].reset();
    });

    var $loadMoreButton = $('#load-more');

    $loadMoreButton.viewportChecker({
        repeat: true,
        callbackFunction: function (element, action) {
            if (action === 'add') {
                $loadMoreButton.click();
            }
        }
    });

    /*var listScroll = new IScroll('#list', {
        mouseWheel: true,
        scrollbars: true
    });*/
});