/*jslint undef: true*/
/*global define*/

define([
  "jquery",
  "underscore",
  "backbone",
  "Parse",
  "handlebars",
  "models/Hint",
  "text!templates/main/profilo.html",
  "views/sub/Header_VS",
  "models/UserSearched"
],
  function (
    $,
    _,
    Backbone,
    Parse,
    Handlebars,
    Hint,
    template,
    Header_VS,
    UserSearched
  ) {
    var Profilo_VM = Parse.View.extend({
      id: 'container',
        
      template: Handlebars.compile(template),
      
      model: UserSearched,
      
      initialize: function () {
        this.model = new UserSearched();
        this.model.getMeFromParse();
        this.model.bind("USERPERPROFILO",this.render, this);
      },

      events: {
        "click #photoprofilo": "getPicture",
      },

      getPicture: function () {
          var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            mediaType: Camera.MediaType.PICTURE,
            //cameraDirection: Camera.Direction.BACK,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 400,
            targetHeight: 400,
            saveToPhotoAlbum: false
          };
          var self = this;
          var cameraSuccess = function (imageURI) {
            self.uploadPicture(imageURI);
            console.log(imageURI);
          };
          var cameraError = function (error) {
            console.log(error);
          };
          navigator.camera.getPicture(cameraSuccess, cameraError, options);
      },
      
      uploadPicture: function (imageURI) {
          var image_name = Parse.User.current() + new Date().getTime();
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
          options.mimeType = "image/jpeg";

          var params = new Object();
          params.image_name = image_name;
          options.params = params;
          options.chunkedMode = false;
          var self = this;
          var win = function win() {
            self.model.updateImageUrl('http://www.hintsiteapp.com/public_images/'+image_name+'.jpg');
          };

          var fail = function fail(error) {
            alert("An error has occurred: Code = " + error.code);
          };

          var ft = new FileTransfer();
          ft.upload(imageURI, encodeURI("http://www.hintsiteapp.com/s/s.php"), win, fail, options, true);
      },
      
      render: function (eventName) {
        var header = new Header_VS({owner: "Profilo_VM", backViewModelId:0 });
        $(this.el)
          .html(header.render().el)
          .append(this.template({
            name:this.model.attributes.username, 
            pt:this.model.attributes.points,
            image: this.model.attributes.image
          }));
        return this;
      }

      });
    return Profilo_VM;
  });