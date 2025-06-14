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
    onSave: function(){
      var oModel = this.getView().getModel();
      window.localStorage.setItem("planningData", JSON.stringify(oModel.getData()));
      MessageToast.show("Saved");
    },
    onDelete: function(){
      var oContext = this.getView().getBindingContext();
      if (!oContext) { return; }
      var oModel = oContext.getModel();
      var sPath = oContext.getPath();
      var aParts = sPath.split("/").slice(2); // remove leading / and 'hierarchy'
      this._remove(aParts, oModel.getProperty("/hierarchy"));
      oModel.refresh();
      window.localStorage.setItem("planningData", JSON.stringify(oModel.getData()));
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
