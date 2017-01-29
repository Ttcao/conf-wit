const app = require('express')();
const bodyParser = require('body-parser');
const request = require('request');
const PORT = 3000;
// const WIT_TOKEN = process.env.WIT_TOKEN;

const Wit = require('./examples/quickstart.js');
// const {interactive} = require('./examples/quickstart.js');
// interactive(client);

// the views are going to be stored in a directory called "views"
app.set('views', './views');

// use embedded javascript (ejs) as the templating engine
app.set('view engine', 'ejs');

// creates a route
app.get('/chat/:msg', function(request, response) {
  response.send('Hello World from Express!');
  // console.log(Wit.client)
  Wit.client.runActions('test-session', request.params.msg, {})
    .then(function(data) {
      console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
    })
    .catch(console.error);
  });

// app.get('/chat', function(request, response) {
//   response.render('chat', { message: 'Welcome to the chat page!' });
// });

app.listen(PORT, function() {
  console.log('Example app listening on port ' + PORT);
});
