sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";
  return Controller.extend("feature.planning.board.controller.Detail", {
    onInit: function() {
      this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onMatched, this);
    },
    _onMatched: function(oEvent){
      var sPath = atob(oEvent.getParameter("arguments").path);
      this.getView().bindElement("/" + sPath);
    },
    onSave: async function(){
      var oModel = this.getView().getModel();
      var oTitleInput = this.byId("titleInput");
      if (!oTitleInput.getValue()) {
        oTitleInput.setValueState("Error");
        MessageToast.show("Title is required");
        return;
      }
      oTitleInput.setValueState("None");
      sap.ui.core.BusyIndicator.show(0);
      await Promise.resolve();
      window.localStorage.setItem("planningData", JSON.stringify(oModel.getData()));
      sap.ui.core.BusyIndicator.hide();
      MessageToast.show("Saved");
    },
    onDelete: async function(){
      var oContext = this.getView().getBindingContext();
      if (!oContext) { return; }
      var oModel = oContext.getModel();
      var sPath = oContext.getPath();
      var aParts = sPath.split("/").slice(2); // remove leading / and 'hierarchy'
      sap.ui.core.BusyIndicator.show(0);
      this._remove(aParts, oModel.getProperty("/hierarchy"));
      oModel.refresh();
      await Promise.resolve();
      window.localStorage.setItem("planningData", JSON.stringify(oModel.getData()));
      sap.ui.core.BusyIndicator.hide();
      this.getOwnerComponent().getRouter().navTo("master");
    },
    _remove: function(aParts, aNodes){
      var id = aParts.shift();
      for(var i=0;i<aNodes.length;i++){
        if(aNodes[i].id === id){
          if(aParts.length === 0){
            aNodes.splice(i,1); return true;
          }
          return this._remove(aParts, aNodes[i].children || []);
        }
      }
      return false;
    }
  });
});
