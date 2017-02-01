const app = require('express')();
const bodyParser = require('body-parser');
const request = require('request');
const PORT = 4567;
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Wit = require('./examples/quickstart.js');
// const WIT_TOKEN = process.env.WIT_TOKEN;

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
        console.log('Send msg to Wit: ' + msg);

        // Call Wit Ai code
        const sessionId = 'test-session';
        const context0 = {};
        Wit.client.runActions(sessionId, msg, context0)
            .then((context1) => {
                console.log('1 The session state is now: ' + JSON.stringify(context1));
                if (context1.timetable) {
                    socket.emit('chat response', context1.timetable);
                } else if (context1.speaker) {
                    socket.emit('chat response', context1.speaker);
                } else if (context1.ticket) {
                    socket.emit('chat response', context1.ticket);
                } else {
                  // do nothing
                }
            })
            .catch((e) => {
                console.log('Oops! Got an error: ' + e);
                console.log(e)
                socket.emit('chat response', "I'm sorry, don't understand what you're saying :(");
            });
    });
});


// the views are going to be stored in a directory called "views"
app.set('views', './views');

// use embedded javascript (ejs) as the templating engine
app.set('view engine', 'ejs');

app.get('/chat', function(request, response) {
    response.render('chat', {
        message: 'Ask our bot!'
    });
});

http.listen(PORT, function() {
});
