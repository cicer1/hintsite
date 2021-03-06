/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "Parse",
  "models/WallMessage"
],
  function ($, Parse, WallMessage) {
    var Pms = Parse.Object.extend("Pms", {
      userStates: {'MASTER': 0, 'LISTED': 1, 'INVITED': 2, 'INGAME': 3},
      matchStates: {'DRAFT': 0, 'RUNNING': 1, 'ENDED': 2},
      saveMaster: function (matchId) {
        var self = this;
        this.save({
          userId: Parse.User.current().id,
          matchId: matchId,
          userState: self.userStates.MASTER,
          matchState: self.matchStates.DRAFT,
          myHint: 4
        }, {
          success: function (result) {
            self.trigger('NuovaPartita_VM_PMSMASTERCREATED');
          },
          error: function (e) {

          }
        });
      },

      fetchFromP: function (){
        var self = this;
        this.fetch({ 
          success: function() {
            self.trigger("gettedMyPmsForMatch");
            self.trigger("gettedMyPms");
          },
          error: function () {
          }
        });
      },
      
      savePms: function (userId, matchId) {
        var self = this;
        var query = new Parse.Query(Pms);
        query.equalTo("matchId", matchId);
        query.equalTo("userId", userId);
        query.find({
          success: function (results) {
            console.log('dwreljglirauehgilauerhgfiulareghlriuaehgiluahgil');
            if (results.length === 0) {
              self.save({
                userId: userId,
                matchId: matchId,
                userState: self.userStates.LISTED,
                matchState: self.matchStates.DRAFT,
                myHint: 1
              }, {
                success: function (result) {
                  self.trigger('AddFromSearch_VM_PMSLISTED');
                  $("#overlay-loading").fadeOut();
                },
                error: function (e) {

                }
              });
            } else {
              console.log('already added');
            }
          },
          error: function (error) {
            console.error(error);
          }
        });
      },

      getMyPmsForMatch : function (matchId) {
        var self = this;
        var query = new Parse.Query(Pms);
        query.equalTo("matchId", matchId);
        query.equalTo("userId", Parse.User.current().id);
        query.find({
          success: function (results) {
            self.id = results[0].id;
            self.fetchFromP();
          },
          error: function (error) {
            console.error(error);
          }
        });
      },

      saveUsedHelpDistance: function() {
        var self = this;
        this.save({
          UsedHelpDistance: 1
        }, {
          success: function (result) {
            self.trigger('HintMap_VS_UsedHelpDistance');
          },
          error: function (e) {

          }
        });
      },

      saveUsedHelpDirection: function() {
        var self = this;
        this.save({
          UsedHelpDirection: 1
        }, {
          success: function (result) {
            self.trigger('HintMap_VS_UsedHelpDirection');
          },
          error: function (e) {

          }
        });
      },


      editMatchStateEnded: function(idPms) {

      var self = this;
        self.id = idPms;
        self.fetch({
          success: function (results) {
            self.increment("matchState",1);
            self.save(
              {}, 
              {
                success: function (result) {
                  self.trigger("MATCHENDED");
                },
                error: function (e) {
                }
              }
            );
          },
          error: function (error) {
            console.error(error);
          }
        });



      },

      setOrdineArrivo: function (matchId) {
        self=this;
        var query = new Parse.Query(Pms);
        query.exists("ordine");
        query.equalTo("matchId", matchId);
        query.equalTo("userState", 3);        
        query.count({
          success: function(count) {
          // The count request succeeded. Show the count
            self.save(
              {
                ordine: (count+1)
              },
              {
                success: function (result) {
                  self.trigger("ORDINESETTATO");
                  console.log("trigger ORDINESETTATO");
                },
                error: function (e) {
                }
              }
            );
          },
          error: function(error) {
    // The request failed
          }
        });
      },

      //Questo lo ha scritto quel genio di Federico Cicerone
      plusPlusMyHint: function (userId, matchId) {
        var self = this;

        var query = new Parse.Query(Pms);
        query.equalTo("matchId", matchId);
        query.equalTo("userId", userId);
        query.find({
          success: function (results) {
              results[0].increment("myHint");
              results[0].save({
                success: function (result) {
                  // post results on the Wall
                  var wallMsg = new WallMessage();
                  wallMsg.saveToP(wallMsg.messageTypes.HINT_FOUND, results[0].attributes.matchId, (results[0].attributes.myHint - 1)); 
                  self.trigger('hintPlusplussed');
                },
                error: function (e) {
                  console.log("non salva");
                }
              });  
          },
          error: function (e) {
            console.log("error");
          }
        });
      },

    });

    return Pms;
  });
