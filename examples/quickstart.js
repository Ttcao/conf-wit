'use strict';

let Wit = null;
// let interactive = null;

try {
  // if running from repo
  Wit = require('../').Wit;
  // interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  // interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/quickstart.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const schedule = [
  { "time" : 9, "event" : "Registration" },
  { "time" : 10, "event": "James' speaking" },
  { "time" : 11, "event" : "Tya's speaking" },
  { "time" : 12, "event" : "Sergio's speaking" },
  { "time" : 13, "event" : "Lunch break" },
  { "time" : 14, "event" : "Tess' speaking" },
  { "time" : 15, "event" : "Jaime's speaking" },
  { "time" : 16, "event" : "Thomas' speaking" }
]

var getEventFromSchedule = function(schedule, time) {

  var slotsWithTime = schedule.filter(function(slot){
    return slot.time == time
  });
  if (slotsWithTime[0]) {
    return slotsWithTime[0].event;
  } else {
    return {};
  }
}

const theSpeakers = [
  { "speaker" : "Mary", "about" : "Mary Smith will be speaking about UX in a changing environment." },
  { "speaker" : "Susie", "about": "Susie Waterdown from Disney is talking Candy sushi making bots get a question." },
  { "speaker" : "Gavin", "about" : "Gavin Richards is one of our finests from General Assembly and is all over the that Case for B-Trees." },
  { "speaker" : "Deloris", "about" : "The genius behind BaseFook! Deloris Carter talks about using default scopes in ActiveRecord." },
  { "speaker" : "George", "about" : "George Winters from one of the biggest Tech companies in Australia. At REA he participates in the sport of Extreme Programming." },
  { "speaker" : "Winston", "about" : "Winston Devcoulter from Twitter talks about the meaning of notifications." },
  { "speaker" : "Stewart", "about" : "Stewart Wisham from Github is sharing his knowledge of the data analysis of board games." },
]

var aboutSpeaker = function(speaker) {

  var slotsWithSpeakers = theSpeakers.filter(function(slot){
    return slot.speaker == speaker
  });
  if (slotsWithSpeakers[0]) {
    return slotsWithSpeakers[0].about;
  } else {
    return {};
  }

}

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    // console.log('sending...', JSON.stringify(response));
  },
  getForecast({context, entities}) {
    var location = firstEntityValue(entities, 'location');
    if (location) {
      context.forecast = 'sunny in ' + location; // we should call a weather API here
    //   delete context.missingLocation;
    // } else {
    //   context.missingLocation = true;
    //   delete context.forecast;
    }
    return context;
  },
  getTimetable({context, entities}) {
    var entityTime = firstEntityValue(entities, 'datetime');
    if (entityTime) {
      // console.log("Get from schedule!");
      var time = new Date(Date.parse(entityTime)).getHours();
      context.timetable = getEventFromSchedule(schedule, time);
    //   delete context.missingTime;
    // } else {
    //   context.missingTime = true;
    //   delete context.timetable;
    }
    return context;
  },
  aboutSpeaker({context, entities}) {
    var speaker = firstEntityValue(entities, 'contact');
    if (speaker) {
      console.log(speaker)
      context.speaker = aboutSpeaker(speaker);
    }
    return context;
  },
};

// module.exports = {
// const client = new Wit({accessToken, actions});
// interactive(client);
// }

module.exports = {
  client: new Wit({accessToken, actions})
}
