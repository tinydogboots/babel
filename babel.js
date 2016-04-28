// This code executes on the client and on the server

// Declare a collection in the Mongo database
var Messages = new Mongo.Collection("messages");


// This code executes only on the client

if (Meteor.isClient) {
  
  Meteor.subscribe("Messages", {
    onReady: function () {
      scrollToBottom();
      autoScrollingIsActive = true;
    }
  });
  
  Template.message.onRendered(function () {
    if (autoScrollingIsActive) {
      scrollToBottom(250);
    } 
  });
  
  var autoScrollingIsActive = false;
  /* reactive var here */
  scrollToBottom = function scrollToBottom() {
  var messageWindow = $(".chat-mode0");
  var scrollHeight = messageWindow.prop("scrollHeight");
  messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
  };
  
  // The mode session variable will be a random number 0 or 1.
  // 0 is linear mode, 1 is crazy mode
  Session.setDefault('mode', parseInt(Math.random() * 2));

  Template.body.helpers({
     
    // Return all the messages that have mode 0
    linear_messages: function() {
        return Messages.find({mode: 0}, {sort: {created: 1}}); 
    },

    // Return all the messages that have mode 1
    crazy_messages: function() {
        return Messages.find({mode: 1}, {sort: {created: 1}}); 
    },
    
    // Return the mode, 0 or 1
    mode: function() {
      return Session.get('mode');
    }
     
  });
  
  Template.new.events({
    
    // This function is called whenever there is a submit
    // event in the "new" template
    "submit form": function(event) {
      
      // Tell the browser not to do its default behavior 
      // (which would reload the page)
      event.preventDefault();
      
      // Get the <form> HTML element (which by definition is
      // the target of the submit event)
      var form = event.target;
      
      // Insert a message into the database collection
      Messages.insert({
        message: form.message.value,
        mode: Session.get('mode'),
        top: parseInt(Math.random() * 700),
        left: parseInt(Math.random() * 1000),
        created: new Date()
      });

      // Clear and re-focus the text field
      form.message.value = '';
      form.message.focus();
    
    }
  
  });
  
}
