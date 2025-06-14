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

      var sData = window.localStorage.getItem("planningData");
      var oData;
      if (sData) {
        oData = JSON.parse(sData);
      } else {
        var oResult = jQuery.sap.syncGetJSON("model/planningData.json");
        oData = oResult.data;
        window.localStorage.setItem("planningData", JSON.stringify(oData));
      }
      var oModel = new JSONModel(oData);
      this.setModel(oModel);

      this.getRouter().initialize();
    }
  });
});
