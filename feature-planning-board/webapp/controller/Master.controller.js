sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/table/Column",
  "sap/m/Label",
  "sap/m/CheckBox",
  "sap/m/ObjectStatus",
  "sap/m/Avatar"
], function(Controller, Filter, FilterOperator, MessageToast, Column, Label, CheckBox, ObjectStatus, Avatar) {
  "use strict";
  return Controller.extend("feature.planning.board.controller.Master", {
    onInit: function() {
      this.getView().setModel(this.getOwnerComponent().getModel());
      this._oTable = this.byId("treeTable");
      this._generateTimelineColumns(this.getOwnerComponent().getModel().getProperty("/timeline"));
    },

    _generateTimelineColumns: function(oTimeline) {
      var that = this;
      oTimeline.releases.forEach(function(oRel) {
        oRel.waves.forEach(function(oWave) {
          oWave.sprints.forEach(function(sSprint) {
            var oCol = new Column({
              multiLabels: [
                new Label({text: sSprint}),
                new Label({text: oWave.title}),
                new Label({text: oRel.title})
              ],
              template: new CheckBox({
                selected: {
                  path: "sprintAssignment",
                  formatter: function(v) { return v === sSprint; }
                },
                select: function(oEvent){
                  that.onSprintAssignmentChange(oEvent, sSprint);
                }
              })
            });
            that._oTable.addColumn(oCol);
          });
        });
      });
    },

    typeColorFormatter: function(sType){
      var m = {
        "Approved": "purple",
        "In Progress": "orange",
        "Tested Successfully": "green"
      };
      return m[sType] || "gray";
    },
    stateFormatter: function(sType){
      var m = {
        "Approved": "Information",
        "In Progress": "Warning",
        "Tested Successfully": "Success"
      };
      return m[sType] || "None";
    },
    ownerInitials: function(sOwner){
      return sOwner ? sOwner.slice(0,2).toUpperCase() : "";
    },

    onItemPress: function(oEvent) {
      var sPath = oEvent.getParameter("rowContext").getPath().substr(1); // remove leading /
      this.getOwnerComponent().getRouter().navTo("detail", {path: btoa(sPath)});
    },

    onSprintAssignmentChange: function(oEvent, sSprint){
      var oContext = oEvent.getSource().getBindingContext();
      oContext.getModel().setProperty(oContext.getPath() + "/sprintAssignment", sSprint);
      window.localStorage.setItem("planningData", JSON.stringify(oContext.getModel().getData()));
    },

    onSearch: function(oEvent){
      var sVal = oEvent.getSource().getValue();
      var oBinding = this._oTable.getBinding("rows");
      if (sVal) {
        oBinding.filter(new Filter("title", FilterOperator.Contains, sVal));
      } else {
        oBinding.filter(null);
      }
    },

    onFilterPress: function(){
      MessageToast.show("Filter not implemented");
    }
  });
});
