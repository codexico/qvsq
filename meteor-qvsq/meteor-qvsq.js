Quotes = new Meteor.Collection("quotes");
Versus = new Meteor.Collection("versus");

if (Meteor.is_client) {

  var getVersusQuotes = function (versus) {
      var q1id = versus.q1;
      var q2id = versus.q2;
      var q1 = Quotes.find({_id: q1id}).fetch();
      var q2 = Quotes.find({_id: q2id}).fetch();
      var q1vsq2 = { q1: q1[0].quote, q2: q2[0].quote } ;

      return q1vsq2;
  }

  Template.listversus.versus = function () {
    var allversus = Versus.find().fetch();
    var quotes = [];

    for (var i=0; i < allversus.length; i++) {
      quotes[i] = getVersusQuotes(allversus[i]);
    };

    return quotes;
  };

  Template.lastversus.versus = function () {
    var last = Versus.find({}).count() -1;
    var versus = Versus.find({}).fetch();
    if (versus[last] !== undefined) {
      var q1id = versus[last].q1;
      var q2id = versus[last].q2;
      var q1 = Quotes.find({_id: q1id}).fetch();
      var q2 = Quotes.find({_id: q2id}).fetch();
      var q1vsq2 = { q1: q1[0].quote, q2: q2[0].quote } ;

      return [ getVersusQuotes(versus[last]) ];
    }
  };

  Template.newquote.events = {
    'submit #addqvsq' : function (e) {
      e.preventDefault();
      var q1 = document.getElementById('q1');
      var q2 = document.getElementById('q2');
      if (q1.value) {
        var q1id = Quotes.insert( {quote: q1.value} );
      }
      if (q2.value) {
        var q2id = Quotes.insert( {quote: q2.value} );
      }
      if( q1.value && q2.value) {
        Versus.insert( {q1: q1id, q2: q2id} );
      }
    }
  };
}

// On server startup, create some quotes if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Quotes.find().count() === 0) {
      var qs = [
        { quote: "There is no such thing as a free lunch"},
        { quote: "The Best Things in Life Are Free"}
      ];

      var q1id =  Quotes.insert({quote: qs[0].quote});
      var q2id =  Quotes.insert({quote: qs[1].quote});

      Versus.insert( {q1: q1id, q2: q2id} );
    }
  });
}
