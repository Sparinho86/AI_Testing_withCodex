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
      sap.ui.core.BusyIndicator.show(0);
      window.localStorage.setItem("planningData", JSON.stringify(oContext.getModel().getData()));
      sap.ui.core.BusyIndicator.hide();
    },

    onRowMenuPress: function(oEvent){
      var oButton = oEvent.getSource();
      var oContext = oButton.getBindingContext();
      var sType = oContext.getProperty("type");
      var aItems = [
        new sap.m.MenuItem({
          text: "Add Feature",
          visible: sType === "Component",
          press: this._addItem.bind(this, oContext, "Feature")
        }),
        new sap.m.MenuItem({
          text: "Add Work Item",
          visible: sType === "Feature",
          press: this._addItem.bind(this, oContext, "Work Item")
        }),
        new sap.m.MenuItem({
          text: "Delete",
          press: this._deleteItem.bind(this, oContext)
        })
      ];
      var oMenu = new sap.m.Menu({items: aItems});
      oMenu.openBy(oButton);
    },

    _addItem: function(oContext, sType){
      sap.ui.core.BusyIndicator.show(0);
      var oModel = oContext.getModel();
      var oParent = oContext.getObject();
      if(!oParent.children){
        oModel.setProperty(oContext.getPath()+"/children", []);
        oParent.children = [];
      }
      oParent.children.push({
        id: Date.now().toString(),
        title: "New " + sType,
        type: "Approved",
        effort: 0,
        value: 0,
        sprintAssignment: null,
        dependencies: "",
        owner: "",
        children: []
      });
      oModel.refresh();
      window.localStorage.setItem("planningData", JSON.stringify(oModel.getData()));
      sap.ui.core.BusyIndicator.hide();
    },

    _deleteItem: function(oContext){
      sap.ui.core.BusyIndicator.show(0);
      var oModel = oContext.getModel();
      var sPath = oContext.getPath();
      var aParts = sPath.split("/").slice(2); // remove leading /hierarchy
      this._remove(aParts, oModel.getProperty("/hierarchy"));
      oModel.refresh();
      window.localStorage.setItem("planningData", JSON.stringify(oModel.getData()));
      sap.ui.core.BusyIndicator.hide();
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
