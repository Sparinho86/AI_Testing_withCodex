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
    init: async function() {
      UIComponent.prototype.init.apply(this, arguments);

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

      if (!oData) {
        try {
          oData = await new Promise(function(resolve, reject){
            jQuery.getJSON("model/planningData.json").done(resolve).fail(reject);
          });
          window.localStorage.setItem("planningData", JSON.stringify(oData));
        } catch (err) {
          oData = {};
        }
      }
      var oModel = new JSONModel(oData);
      this.setModel(oModel);

      this.getRouter().initialize();
      sap.ui.core.BusyIndicator.hide();
    }
  });
});
