sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function(UIComponent, JSONModel, Device) {
  "use strict";
  return UIComponent.extend("feature.planning.board.Component", {
    metadata: {
      manifest: "json"
    },
    init: function() {
      UIComponent.prototype.init.apply(this, arguments);

      var that = this;
      sap.ui.core.BusyIndicator.show(0);
      var sData = window.localStorage.getItem("planningData");
      var oData = null;
      if (sData) {
        try {
          oData = JSON.parse(sData);
        } catch (e) {
          console.error("Failed to parse planning data", e);
        }
      }

      function finalize(data) {
        var oModel = new JSONModel(data || {});
        that.setModel(oModel);
        that.getRouter().initialize();
        sap.ui.core.BusyIndicator.hide();
      }

      if (!oData) {
        jQuery.getJSON("model/planningData.json").done(function(data){
          oData = data;
          window.localStorage.setItem("planningData", JSON.stringify(oData));
          finalize(oData);
        }).fail(function(err){
          console.error("Failed to load planningData.json", err);
          finalize({});
        });
      } else {
        finalize(oData);
      }
    }
  });
});
