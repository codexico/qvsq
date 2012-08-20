Quotes = new Meteor.Collection("quotes");

if (Meteor.is_client) {
  Template.leaderboard.quotes = function () {
    return Quotes.find({});
  };

  Template.lastquote.quote = function () {
    var last = Quotes.find({}).count() -1;
    var quotes = Quotes.find({}).fetch();
    if (quotes[last] !== undefined) {
      return [quotes[last]]
    }
  };

  Template.leaderboard.events = {
    'click input.inc': function () {
      Quotes.update(Session.get("selected_quote"), {$inc: {score: 5}});
    },
    'submit #addqvsq' : function (e) {
      e.preventDefault();
      var q1 = document.getElementById('q1');
      var q2 = document.getElementById('q2');
      if( q1.value && q2.value) {
        Quotes.insert( {quote: {q1: q1.value, q2:q2.value} } );
      }
    }
  };
}

// On server startup, create some quotes if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Quotes.find().count() === 0) {
      var qs = [
        {quote: { q1: "There is no such thing as a free lunch", q2: "The Best Things in Life Are Free"} }
      ];

      for (var i = 0; i < qs.length; i++) {
        Quotes.insert(qs[i]);
      }
    }
  });
}
