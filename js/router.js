
/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "collections/HintCollection",
  "collections/MatchCollection",
  "models/Hint",
  "models/Match",
  "views/main/HintFull_VM",
  "views/main/PartitaPlayer_VM",
  "views/main/PartitaMaster_VM",
  "views/main/NuovaPartita_VM",
  "views/main/EditPartita_VM",  
  "views/sub/list/HintPreview_VSL",
  "views/main/ElencoPartite_VM",
  "views/sub/list/Match_VSL",
  "views/main/LogIn_VM",
  "views/main/SetLaunchTime_VM",
  "views/main/SelezioneGiocatori_VM",
  "views/main/HintForm_VM",
  "views/main/SetHintPosition_VM",
  "views/main/Opzioni_VM",
  "views/main/Profilo_VM",
  "views/main/WallFull_VM",
  "views/main/SignUp_VM",
  "views/main/HintFound_VM",
  "views/main/MatchEnd_VM",
  "views/NoNetworkConnectionView"
],
    function ($,
      _,
      Backbone,
      Parse,
      HintCollection,
      MatchCollection,
      Hint,
      Match,
      HintFull_VM,
      PartitaPlayer_VM,
      PartitaMaster_VM,
      NuovaPartita_VM,
      EditPartita_VM,
      HintPreview_VSL,
      ElencoPartite_VM,
      Match_VSL,
      LogIn_VM,
      SetLaunchTime_VM,
      SelezioneGiocatori_VM,
      HintForm_VM,
      SetHintPosition_VM,
      Opzioni_VM,
      Profilo_VM,
      WallFull_VM,
      SignUp_VM,
      HintFound_VM,
      MatchEnd_VM,
      NoNetworkConnectionView
    ) {

    var AppRouter = Parse.Router.extend({

      routes: {
        "": "checkForNetwork",
        "mainMatchList": "mainMatchList",
        "matches/:id": "matchDetails",
        "matchesMaster/:id": "matchDetailsMaster",
        "matches/:id/:extra" : "matchDetailsAccept",
        "hints/:id": "hintDetails",
        "newMatch": "newMatch",
        "editMatch/:id": "editMatchDraft",
        "setLaunchTime/:id": "setLTime",
        "selezioneGiocatori/:id": "selGiocatori",
        "hintsedit/:id": "hintForm",
        "sethintposition/:id": "setHintP",
        "back/:view/:param": "backToPrevious",
        "opzioni": "opzioni",
        "profilo": "profilo",
        "wallFull/:id": "wallFull",
        "signup": "signup",
        "hintFound/:id": "hintFound",
        "matchEnd/:id": "matchend"
      },

      checkForNetwork: function () {
        var state = navigator.connection.type;
        if (state == Connection.UNKNOWN || state == Connection.NONE)
          this.changePage(new NoNetworkConnectionView({}));
        else
          this.userControl();
      },

      userControl: function () {
        if (Parse.User.current()) {
          this.mainMatchList();
        } else {
          this.log();
        }
      },

      opzioni: function () {
        var page = new Opzioni_VM({
        });
        this.changePage(page);      
      },

      profilo: function () {
        var page = new Profilo_VM({
        });
        this.changePage(page);      
      },

      signup: function () {
        var page = new SignUp_VM({
        });
        this.changePage(page);      
      },

      wallFull: function (matchId) {
        var page = new WallFull_VM({
          matchId: matchId
        });
        this.changePage(page);      
      },

      hintFound: function (matchId) {
        var page = new HintFound_VM({
          matchId: matchId
        });
        this.changePage(page);      
      },

      matchend: function (matchId) {
        var page = new MatchEnd_VM({
          matchId: matchId
        });
        this.changePage(page); 
      },

      mainMatchList: function () {
        var page = new ElencoPartite_VM({
        });
        this.changePage(page);
      },

      log: function () {
        var page = new LogIn_VM({
        });
        this.changePage(page);
      },

      hintDetails: function (id) {
        var self = this;
        var query = new Parse.Query(Hint);
        query.get(id, {
          success: function (result) {
            self.changePage(new HintFull_VM({
              model: result
            }));
          },
          error: function (error) {
            console.error(error);
          }
        });
      },

      matchDetails: function (id) {
        
        var self = this;
        var query = new Parse.Query(Match);
        query.get(id, {
          success: function (result) {
            if(result.attributes.user.id == Parse.User.current().id)
            {     
              self.changePage(new PartitaMaster_VM({
                model: result
              }));
            }else{
              self.changePage(new PartitaPlayer_VM({
                model: result
              }));
            }     
          },
          error: function (error) {
            console.error(error);
          }
        });
      },

      matchDetailsMaster: function (id) {
        
        var self = this;
        var query = new Parse.Query(Match);
        query.get(id, {
          success: function (result) {
            self.changePage(new PartitaMaster_VM({
              model: result
            }));    
          },
          error: function (error) {
            console.error(error);
          }
        });
      },

      matchDetailsAccept: function (id, extra) {
        
        var self = this;
        var query = new Parse.Query(Match);
        query.get(id, {
          success: function (result) {
            self.changePage(new PartitaPlayer_VM({
              model: result,
              extra: extra
            }));     
          },
          error: function (error) {
            console.error(error);
          }
        });
      },

      newMatch: function () {
        this.changePage(new NuovaPartita_VM());
      },

      editMatchDraft: function (id) {
        this.changePage(new EditPartita_VM(
          {'matchIdToGet': id})
        );
      },

      setLTime: function (id) {
        this.changePage(
          new SetLaunchTime_VM({'matchIdToGet':id})
        );
      },

      selGiocatori: function (id) {
        this.changePage(
          new SelezioneGiocatori_VM({'matchIdToGet':id})
        );
      },
      
      setHintP: function (id) {
        this.changePage(
          new SetHintPosition_VM({'hintIdToGet':id})
        );
      },

      hintForm: function (id) {
        this.changePage(
          new HintForm_VM({'hintIdToGet':id})
        );
      },

      changePage: function (page) {
        if(this.currentView) {
           this.currentView.remove();
         }
        this.currentView = page;
        page.render();
        $('body').append($(page.el));
      },

      mappaBack: {
        "SetLaunchTime_VM": "editMatch",      //  + /id
        "ElencoPartite_VM": "",
        "NuovaPartita_VM": "",
        "EditPartita_VM": "",        
        "PartitaPlayer_VM": "",
        "PartitaMaster_VM": "",
        "Opzioni_VM": "",      
        "Profilo_VM":"",  
        "HintForm_VM": "editMatch",           //  + /id
        "SetHintPosition_VM": "hintsedit",    //  + /id
        "HintFull_VM": "matches",             //  + /id
        "SelezioneGiocatori_VM": "editMatch", //  + /id
        "WallFull_VM": "matches"              //  + /id
      },

      backToPrevious: function (view, param) {
        // NOTE: param is a string containing a number
        if (this.currentView) {
          this.currentView.remove();
        }

        if (parseInt(param, 10) === 0) {
          Parse.history.navigate(this.mappaBack[view], {trigger: true, replace: true});          
        } else {
          Parse.history.navigate(this.mappaBack[view] + '/' + param, {trigger: true, replace: true});
        }
        return false;  
      }
    });

    return AppRouter;
  });
