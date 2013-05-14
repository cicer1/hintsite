/*jslint undef: true*/
/*global define*/

define([
    "jquery",
    "underscore",
    "backbone",
    "Parse",
    "handlebars",
    "models/Match",
    "collections/HintCollection",
    "text!templates/new-match.html",
    "views/sub/vsHeader",
    "views/sub/vsLaunchFooter"
],
    function (
        $,
        _,
        Backbone,
        Parse,
        Handlebars,
        Match,
        HintCollection,
        template,
        vsHeader,
        vsLaunchFooter
    ) {

        var vmNuovaPartita = Parse.View.extend({
                template: Handlebars.compile(template),
                model: new Match(),
                collection: new HintCollection(),
                initialize: function () {
                    this.model.bind("vmNuovaPartitaMATCHCREATED", this.cfh , this);
                    this.model.bind("vmNuovaPartitaMATCHLAUNCHED", this.navigateToElencoPartite , this);
                    this.collection.bind("vmNuovaPartitaCOLLECTIONCOMPLETED", this.render, this);
                    this.model.saveDraftToP();
                },
                events: {
                    "blur #matchname": "snp",
                    "touchend #launch": "lp",
                    "touchend #launchtime": "navigateToSetLaunchTime"
                    
                },

                navigateToElencoPartite : function() {
                    Parse.history.navigate('', { trigger : true, replace : true });
                },

                navigateToSetLaunchTime : function() {
                    Parse.history.navigate('setLaunchTime', { trigger : true, replace : true });
                },

                lp : function() {
                    this.model.launchPartita();
                },

                cfh : function() {
                    //console.log(this.model.id);
                    this.collection.createFourHints(this.model.id);
                },

                snp : function() {
                    this.model.salvaNomePartita( $("#matchname").val() );
                },

                render: function (eventName) {

                    var header = new vsHeader();
                    var launchfooter = new vsLaunchFooter();                    
                    var match = this.model.toJSON();
                    $(this.el).html( 
                        header.render(
                            {title:header.titles.vmNuovaPartita}
                        ).el ).append(this.template(match)).append( launchfooter.render().el );
                    return this;
                }

            });

        return vmNuovaPartita;

    });