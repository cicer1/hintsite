/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "handlebars",
  "views/HintListItemView",
  "collections/HintCollection",
  "models/Hint",
  "text!templates/hint-list.html"
],
    function ($, _, Backbone, Parse, Handlebars, HintListItemView, HintCollection, Hint, template) {

    var HintListView = Parse.View.extend({
        tagName: "ul",
        
        id: "list",
        template: Handlebars.compile(template),
        
        initialize: function () {
          var query = new Parse.Query(Hint);
          query.equalTo("matchId", this.model.id);
          // Questo comando imposta la query per cercare solo gli Hint di una determinata partita
          // l'id viene passato quando viene instanziata HintListView in MatchView, passando come model il Match
          // BISOGNA CAPIRE SE E' CORRETTO.
          var self = this;
          query.find({

            success: function (results) {
              self.collection = results;
              //self.model.bind("reset", self.render, this);
              self.render();
            },
            error: function (error) {
              console.log(error);
            }
          });

        },

        render: function (eventName) {
          $(this.el).empty();
          _.each(this.collection, function (hint) {
            $(this.el).append(new HintListItemView({
              model: hint
            }).render().el);
          }, this);
          return this;
        }
      });

    return HintListView;

  });