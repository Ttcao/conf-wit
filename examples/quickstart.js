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
  { "time" : 9, "event" : "At 9am Gavin Richards from General Assembly will be kicking the event off in Classroom 1; George Winters from REA in Classroom 5; Georgina Splintlay from ZenDesk in Classroom 4." },
  { "time" : 10, "event": "There will be a short break between talks and workshops running throughtout the day in Classrooms 2 and 3. Make sure you stop by and get your hands dirty!"},
  { "time" : 11, "event" : "At 11am you can find Delores Carter from Bacefook in Classroom 1; Winston Devcoulter from Twitter in Classroom 5; Fred Hammings from Envato is in Classroom 4" },
  { "time" : 12, "event" : "Lunch Time! Food and drinks will be catered in the kitchen." },
  { "time" : 13, "event" : "Lunch Time! Food and drinks will be catered in the kitchen." },
  { "time" : 14, "event" : "At 2pm Mary Smith from Facebook is in Classroom 1; Stewart Wisham from Github in Classroom 5; Gavin Richards from General Assembly will be in Classroom 4." },
  { "time" : 15, "event" : "At 3.30pm Susie Waterdown from Disney will be in Classroom 1; Delores Carter from Bacefook in Classroom 4; Natasha Frack from Github will be in Classroom 5." },
  { "time" : 16, "event" : "There will be a short break between talks and workshops running throughtout the day in Classrooms 2 and 3. Make sure you stop by and get your hands dirty!" }
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
  { "speaker" : "Mary", "about" : "Mary Smith from Facebook will be speaking about UX in a changing environment." },
  { "speaker" : "Susie", "about": "Susie Waterdown from Disney is talking Candy sushi making bots get a question." },
  { "speaker" : "Gavin", "about" : "Gavin Richards is one of our finest from General Assembly and is all over the that Case for B-Trees. He will also be speakin about Concurrent, Cooperative Technology." },
  { "speaker" : "Deloris", "about" : "The genius behind BaseFook! Deloris Carter talks about using default scopes in ActiveRecord. She will also be sharing her UX journey with Visualization of Agents." },
  { "speaker" : "George", "about" : "George Winters from one of the biggest Tech companies in Australia. At REA he participates in the sport of Extreme Programming." },
  { "speaker" : "Winston", "about" : "Winston Devcoulter from Twitter talks about the meaning of notifications." },
  { "speaker" : "Stewart", "about" : "Stewart Wisham from Github is sharing his knowledge of board games." },
  { "speaker" : "Natasha", "about" : "Natasha Frack is a Git Lord and she will be Emulating the partition table with SPARER. Get excited!" },
  { "speaker" : "Georgina", "about" : "Georgina Splintlay from ZenDesk will be Deconstructing Scatter/Gather and putting it into practice." },
  { "speaker" : "Fred", "about" : "Fred Hammings is an Envato developer and will be explaining the why's and how's of the development of scheme." }
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
