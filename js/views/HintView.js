define(["jquery", "underscore", "backbone", "Parse", "handlebars", "text!../templates/hint-details.html"],
    function ($, _, Backbone, Parse, Handlebars, template) {

    var HintView = Parse.View.extend({

        events: {
          "touchend #back": "goBack"
        },

        goBack: function () {
          window.history.back();
        },

        template: Handlebars.compile(template),

        render: function (eventName) {
          $(this.el).html(this.template(this.model.toJSON()));
          return this;
        }
      });

    return HintView;

  });