/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "handlebars",
  "text!templates/sub/launch-footer-TS.html"
],
    function ($,
      _,
      Backbone,
      Parse,
      Handlebars,
      template
    ) {

    var LaunchFooter_VS = Parse.View.extend({
        tagName: "div",
        id: "launch-footer",
        template: Handlebars.compile(template),
        initialize: function () {
        },
        render: function () {
          $(this.el).empty();
          $(this.el).html(this.template());
          return this;
        }
      });

    return LaunchFooter_VS;

  });