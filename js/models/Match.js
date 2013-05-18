/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "Parse"
],
  function ($, Parse) {
    var Match = Parse.Object.extend("Match", {
      states: {'DRAFT': 0, 'RUNNING': 1, 'ENDED': 2},
      saveDraftToP: function () {
        var self = this;
        this.save({
          user: Parse.User.current(),
          ACL: new Parse.ACL(Parse.User.current()),
          state: self.states.DRAFT
        }, {
          success: function (result) {
            self.trigger('NuovaPartita_VM_MATCHCREATED');
          },
          error: function (e) {

          }
        });
      },
      salvaNomePartita: function (n) {
        var self = this;
        this.save({
          name: n,
        }, {
          success: function (result) {
            self.trigger('NuovaPartita_VM_MATCHNAMEUPDATED');
          },
          error: function (e) {

          }
        });
      },
      launchPartita: function () {
        var self = this;
        this.save({
          state: self.states.RUNNING,
        }, {
          success: function (result) {
            self.trigger('NuovaPartita_VM_MATCHLAUNCHED');
          },
          error: function (e) {

          }
        });
      },
      fetchFromP: function (vm){
        self = this;
        this.fetch({ 
          success: function() {
            self.trigger(vm+'_MATCHSYNC');
          },
          error: function () {
          }
        });
      },
      salvaTimePartita: function (t,vm) {
        this.save({
          launchTime: t,
        }, {
          success: function (result) {
            self.trigger(vm+'_MATCHTIMEUPDATED');
          },
          error: function (e) {

          }
        });
      }

    });

    return Match;

  });