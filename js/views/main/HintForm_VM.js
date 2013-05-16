/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "handlebars",
  "models/Hint",
  "text!templates/main/hint-form.html",
  "views/sub/Header_VS"
],
  function (
    $,
    _,
    Backbone,
    Parse,
    Handlebars,
    Hint,
    template,
    Header_VS
  ) {
    var HintForm_VM = Parse.View.extend({
        template: Handlebars.compile(template),
        model: new Hint(),
        initialize: function () {
          this.model.id = this.options.hintIdToGet;
          this.model.on('HintForm_VM_HINTSYNC', this.render, this);
          this.model.fetchFromP();
        },
        events: {
          "touchend #mappa": "navigateToSetHintPosition"
        },
        navigateToSetHintPosition : function () {
          Parse.history.navigate('sethintposition', { trigger : true });
        },

        render: function (eventName) {
          
          var header = new Header_VS();
          var hint = this.model.toJSON();
          var title = "Hint #"+ this.model.attributes.number;
          $(this.el)
            .html(header.render({'title': title}).el)
            .append(this.template(hint));
          return this;
        }

      });
    return HintForm_VM;
  });