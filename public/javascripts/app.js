var $loginForm;
var $testDiv;
var $registerForm;
var $user;
var $error;
var $content;
var $logout;
var $events;
var $eventForm;
var $addEvent;
var $eventContainer;
var $eventList;
var $remember;

$(document).ready(function () {

    $loginForm = $('#login');
    $testDiv = $('#test');
    $registerForm = $('#register');
    $error = $('#error');
    $content = $('#content');
    $logout = $('#logout');
    $user = $('#user');
    $events = $('#networking');
    $eventForm = $('#eventForm');
    $addEvent = $('#addEvent');
    $eventContainer = $("#eventContainer");
    $eventList = $("#eventList");
    $remember = $("#remember");

    $eventForm.hide();
    $eventContainer.hide();

    setupAjax();

    bindEvents();

    showUser();
});

function displayEvents( data ){
    $eventList.empty();
    console.log(data);
    $eventContainer.show();
    data.events.forEach(function( item, index){
        $li = $('<li>');
        $p1 = $('<p>');
        $p2 = $('<p>');
        $eventList.append($li);
        $li.append($p1, $p2);
            $p1.text(item.title + ", " + item.location + ", " + item.date + ", " + item.time);
            $p2.text('Description: ' + item.description);

    })
}

function showUser() {
    if (localStorage.getItem('userProfile')) {
        var user = JSON.parse(localStorage.getItem('userProfile'));
        $loginForm.hide();
        $eventForm.show();
        $user.text('You are currently logged in as ' + user.username);
        $content.text('');
    }
    if (sessionStorage.getItem('userProfile')) {
        var user = JSON.parse(sessionStorage.getItem('userProfile'));
        $loginForm.hide();
        $eventForm.show();
        $user.text('You are currently logged in as ' + user.username);
        $content.text('');
    }
}

function hideUser() {
    if (localStorage.getItem('userToken')) {
        localStorage.removeItem('userToken');
    }

    if (localStorage.getItem('userProfile')) {
        localStorage.removeItem('userProfile');
    }
    if (sessionStorage.getItem('userToken')) {
        sessionStorage.removeItem('userToken');
    }

    if (sessionStorage.getItem('userProfile')) {
        sessionStorage.removeItem('userProfile');
    }
    $loginForm.show();
    $user.text('');
    $content.text('');
    $eventForm.hide();
    $eventList.empty();
    $eventContainer.hide();
}

function setupAjax() {
    $.ajaxSetup({
        'beforeSend': function (xhr) {
            if (localStorage.getItem('userToken')) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + localStorage.getItem('userToken'));
            }
            if (sessionStorage.getItem('userToken')) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + sessionStorage.getItem('userToken'));
            }
        }
    });
}

function bindEvents() {

    // add networking events
    $addEvent.on('click', function (e) {
        e.preventDefault();
        var data = $eventForm.serializeArray();

        $.ajax('/api/networking', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            // on a success, put the secret into content area
            displayEvents( data );
            $content.text("U posted to the data thingy");

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // on a failure, put that in the content area
            $content.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    // get networking events
    $events.on('click', function (e) {
        $.ajax('/api/networking', {
            method: 'get'
        }).done(function (data, textStatus, jqXHR) {

            // on a success, put the secret into content area

            displayEvents( data );

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // on a failure, put that in the content area
            $content.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    // set up the API test
    $testDiv.on('click', function (e) {
        $.ajax('/api/test', {
            method: 'get'
        }).done(function (data, textStatus, jqXHR) {

            // on a success, put the secret into content area
            $content.text(data);

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // on a failure, put that in the content area
            $content.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    // set up login
    $loginForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/authenticate', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            //remember user
            if($remember.prop('checked') == true) {
                // Save the JWT token
                localStorage.setItem('userToken', data.token);
                // Set the user
                localStorage.setItem('userProfile', JSON.stringify(data.user));
            } else if ($remember.prop('checked') == false) {

                console.log("in else if");
                // Save the JWT token
                sessionStorage.setItem('userToken', data.token);
                // Set the user
                sessionStorage.setItem('userProfile', JSON.stringify(data.user));
            }
            // clear form
            $loginForm[0].reset();

            showUser();
            setupAjax();

        }).fail(function (jqXHR, textStatus, errorThrown) {
            $error.text(jqXHR.responseText);
        }).always(function () {
            console.log("complete");
        });
    });

    // set up register
    $registerForm.on('submit', function (e) {
        // stop the form from submitting, since we're using ajax
        e.preventDefault();

        // get the data from the inputs
        var data = $(this).serializeArray();

        // go authenticate
        $.ajax('/register', {
            method: 'post',
            data: data
        }).done(function (data, textStatus, jqXHR) {

            //redirect back home, so that they can log in
            window.location.replace('/');

        }).fail(function (jqXHR, textStatus, errorThrown) {

            // show the user the error
            $error.text(jqXHR.responseText);

        }).always(function () {
            console.log("complete");
        });
    });

    $logout.on('click', function () {
        hideUser();
    })
}