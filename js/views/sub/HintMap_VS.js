/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "handlebars",
  "models/Hint",
  "models/Pms",
  "views/sub/Header_VS",
  "views/LoadingView",
  "views/main/Popup_VM",
  "views/main/Arrow_VM",
  "leaflet",
  "text!templates/sub/hint-map-TS.html"
],
  function (
    $,
    _,
    Backbone,
    Parse,
    Handlebars,
    Hint,
    Pms,
    Header_VS,
    LoadingView,
    Popup_VM,
    Arrow_VM,
    leaflet,
    template
  ) {


    var ks = {
      VIEWFINDER_EXT_RADIUS: 50,
      VIEWFINDER_INT_RADIUS: 4,
      PIN_WIDTH: 60,
      PIN_HEIGHT: 47
    };


    var HintMap_VS = Parse.View.extend({
      tagName: 'div',
      id: "map-container",
      model: Hint,
      pms: Pms,
      events: {
        "click #check-in-btn": "checkIn",
        "click #go-to-wall": "goToWall",
        "click #distance": "checkGetHintDistance",
        "click #direction": "checkGetHintDirection"
      },

      template: Handlebars.compile(template),

      initialize: function () {
        this.model = new Hint();
        this.loading = new LoadingView();
        this.model.on('HintMap_VS_HINTFORPLACE', this.unrenderLoading, this);
        this.matchId = this.options.matchId;
        this.pms = new Pms();
        this.pms.id = this.options.pms.id;
        if(this.pms.id)
          this.pms.fetchFromP();
        this.pms.on("hintPlusplussed", this.notify, this);
        this.pms.on("HintMap_VS_UsedHelpDistance", this.getHintDistance, this);
        this.pms.on("HintMap_VS_UsedHelpDirection", this.getHintDirection, this);
        if (this.options.pms.attributes.myHint){
          this.model.getWithPmsAndMatch(this.options.pms.attributes.myHint, this.matchId);
          this.loading.render();
        }  
      },

      //unrenderloading deve partire quando arrivano sia porcoiddio che HintMap_VS_HINTFORPLACE

      render: function (eventName) {
        $(this.el).html(this.template());
        this.renderMap();
        return this;
      },

      goToWall: function () {
        Parse.history.navigate("wallFull/"+this.matchId , {trigger: true});
      },

      renderMap: function () {
        var self = this;
        var t = setInterval(function () {
          var position = self.model.attributes.point;

          /* creates the map object */
          if (!self.map){
            self.map = L.map(self.$('#map')[0],{ zoomControl:false , dragging:false });
            L.tileLayer('http://{s}.tile.cloudmade.com/3baed80b0bcf4a42b46b25833591b090/997/256/{z}/{x}/{y}.png', {
              minZoom: 14,
              maxZoom: 14
            }).addTo(self.map);
          }
          var modelPoint = self.model.attributes.point;
          navigator.geolocation.getCurrentPosition(
            // success
            function (currPosition) {
              self.map.setView([currPosition.coords.latitude, currPosition.coords.longitude], 15);
            },
            // error
            null,
            // options
            {enableHighAccuracy: true, timeout: 20000}
          );
        }, 5000);
      },

      panToCurrentPosition: function () {
        var self = this;
        navigator.geolocation.getCurrentPosition(
          // success
          function (currPosition) {
            self.map.panTo([currPosition.coords.latitude, currPosition.coords.longitude]);
          },
          // error
          null,
          // options
          {enableHighAccuracy: true, timeout: 20000}
        );
      },

      checkIn: function () {
        var self = this;
        navigator.geolocation.getCurrentPosition(
          // success
          function (currPosition) {            
            var point = new Parse.GeoPoint(currPosition.coords.latitude, currPosition.coords.longitude);
            if (point.kilometersTo(self.model.attributes.point) <= 0.5){
              self.pms.plusPlusMyHint(Parse.User.current().id, this.matchId);
            }else{
              var message = "Wrong position for hint!";
              $('body').append( 
                new Popup_VM({
                  notificationText: message
                }).render().el
              );
            }
          },
          // error
          null,
          // options
          {enableHighAccuracy: true, timeout: 20000}
        );

      },

      checkGetHintDistance: function () {
        if (!(this.pms.attributes.UsedHelpDistance)) {
          this.pms.saveUsedHelpDistance();
        } else {
          var message = "You've already use this Help in this Match!";
          $('body').append( 
            new Popup_VM({
              notificationText: message
            }).render().el
          );
        }
      },

      getHintDistance: function () {
          var self = this;
          navigator.geolocation.getCurrentPosition(
            // success
            function (currPosition) {            
              var point = new Parse.GeoPoint(currPosition.coords.latitude, currPosition.coords.longitude);
              var distance = "You're " + point.kilometersTo(self.model.attributes.point).toFixed(3) + " Km far from Hint";
              $('body').append( 
                new Popup_VM({
                  notificationText: distance
                }).render().el
              );  
            },
            // error
            null,
            // options
            {enableHighAccuracy: true, timeout: 20000}
          );  
      },

      checkGetHintDirection: function () {
        if (!(this.pms.attributes.UsedHelpDirection)) {
          this.pms.saveUsedHelpDirection();
        } else {
          var message = "You've already use this Help in this Match!";
          $('body').append( 
            new Popup_VM({
              notificationText: message
            }).render().el
          );
        }
      },

      getHintDirection: function () {
        var self = this;
        navigator.geolocation.getCurrentPosition(
          // success
          function (currPosition) {            
            var point = new Parse.GeoPoint(currPosition.coords.latitude, currPosition.coords.longitude);
            var angle = Math.atan( ( currPosition.coords.longitude - self.model.attributes.point.longitude ) / ( currPosition.coords.latitude - self.model.attributes.point.latitude )) * (180 / Math.PI);
            var distance = angle.toFixed(0);
            $('body').append( 
              new Arrow_VM({
                angle: distance
              }).render().el
            );  
          },
          // error
          null,
          // options
          {enableHighAccuracy: true, timeout: 20000}
        );
      },

      notify: function () {
        Parse.history.navigate("hintFound/" + this.matchId, {trigger: true});
      },

      unrenderLoading: function () {
        this.loading.remove();
      }

    });
    return HintMap_VS;
  });