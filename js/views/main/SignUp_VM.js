/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "handlebars",
  "text!templates/main/sign-up.html"
],
    function ($, _, Backbone, Parse, Handlebars, template) {

    var SignUp_VM = Parse.View.extend({

        events: {
          "click #sign": "signUp"
        },

        signUp : function () {

              var username = this.$("#username").val();
              var password = this.$("#password").val();
              var user = new Parse.User();
              user.set("username", username);
              user.set("password", password);
              user.set("points", 5000 ); 

              var userACL = new Parse.ACL(Parse.User.current());
              userACL.setPublicReadAccess(true);
              user.setACL(userACL);

              user.signUp(null, {
                success: function(user) {
                  Parse.history.navigate("mainMatchList", {trigger: true});
                },
                error: function(user, error) {
                  alert("Error: " + error.code + " " + error.message);
                }
              });
        },

        template: Handlebars.compile(template),

        render: function (eventName) {
          $(this.el).html(this.template());
          return this;
        }
      });

    return SignUp_VM;

  });