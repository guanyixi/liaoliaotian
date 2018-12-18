//Socket setup on front-end
const socket = io.connect("http://localhost:4000");  //We have io object because it is linked in index.html

// Varialbes
var user = '';
var codeAnswer = 'flip';


function currentTime(){
    d = new Date();
    hour = d.getHours().toString();
    min = d.getMinutes().toString();
    if(min.length == 1){
        min = '0' + min;
    }
    return hour + ':' + min;
} 

// Query DOM
const start = document.getElementById('start'),
    name = document.getElementById('name'),
    code = document.getElementById('code'),
    error = document.getElementById('error'),
    message = document.getElementById('message'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    onlineUsers = document.getElementById('online-users'),
    loginWindow = document.getElementById('login-window'),
    chatWindow = document.getElementById('chat-window');
    
// Login
    
    // Check if has name, password is correct. Display error messages.
    function checkLogin(event){
        error.innerHTML = '';
        if(name.value != '' && code.value == codeAnswer){
            loginWindow.className = 'not-active';
            chatWindow.className = 'active';
            user = name.value;
            // Emit user to server
            socket.emit('user', user);
        }else{
            if(name.value == ''){
                error.innerHTML += '<span>You need to enter your name. </span>';
            }
            if(code.value == ''){
                error.innerHTML += '<span>You need to enter secret code. </span>';
            }
            if(code.value != '' && code.value != codeAnswer){
                error.innerHTML += '<span>Your code is wrong.</span>';
                code.value = '';
            }
        }
    }

    // Run checkLogin function when in code field and press enter key.
    code.addEventListener('keydown', function(){
        if (event.which == 13 || event.keyCode == 13) {
            checkLogin();
        }
    });
    // Run checkLogin function when in message field and press enter key.
    name.addEventListener('keydown', function(){
        if (event.which == 13 || event.keyCode == 13) {
            checkLogin();
        }
    });
    // Run checkLogin function when click start button.
    start.addEventListener('click', function(){
        checkLogin();
    });

// Send message
    function sendMessage(event){
        if (event.which == 13 || event.keyCode == 13) {

            //When Enter key is pressed, sending message and handle to server.
            if(message.value != ''){
                socket.emit('chat', {
                    message: message.value,
                    user: user
                });
            }

            //Clear textarea
            message.value = '';

            return false;
        }
        return true;
    }

// Listen to events 

    // When all users change, update online users box.
    socket.on('all users', function(data){
        var html = '';
        for(i =0; i< data.length; i++){
            html += '<li>' + data[i] + '</li>';
        }
        onlineUsers.innerHTML = html;
    });

    //When get chat data from server, output name, time and message
    socket.on('chat', function(data){
        feedback.innerHTML = '';
        var html = '<div class="message-item">';
        html += '<div class="message-title"><strong>' + data.user + '</strong>';
        html += '<span>' + currentTime() + '</span></div>';
        html += '<div class="message-content">' + data.message + '</div></div>';
        output.innerHTML += html;

        //Always scroll to bottom
        var outputHeight = output.scrollHeight;
        output.scrollTo(0, outputHeight);
    });

