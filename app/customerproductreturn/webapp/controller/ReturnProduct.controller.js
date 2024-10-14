sap.ui.define([
    "sap/ui/core/mvc/Controller",
   "sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
],
function (Controller, MessageBox, MessageToast, UploadCollectionParameter, JSONModel, Device) {
    "use strict";

    return Controller.extend("cust.return.customerproductreturn.controller.ReturnProduct", {
        onInit: function () {
            // Create a JSON model to store uploaded files and notes
            var oModel = new JSONModel({
                files: []
            });
            this.getView().setModel(oModel, "fileModel");
        },

        // Handler for file upload
        onFileUpload: function (oEvent) {
			var that = this;
            var oFileUploader = this.byId("fileUploader");
            var aFiles = oFileUploader.oFileUpload.files; // Access files from the file uploader control
			var oModel = this.getView().getModel();
    if (aFiles && aFiles.length > 0) {
        var oFile = aFiles[0]; // Get the first file
        var sNotes = this.byId("noteInput").getValue();
        var reader = new FileReader();

        reader.onload = function (e) {
            var sFileContent = e.target.result;


				// Prepare data to be sent to the backend
				var oPayload = {
					FILENAME: oFile.name,
					FILECONTENT: sFileContent,
					COMMENT: sNotes
				};

				// Call the OData V4 service to create a new entity
				this._createEntity(oPayload);
				var oData = this.getView().getModel("fileModel").getData();
				oData.files.push({
					name: oFile.name,
					content: sFileContent,
					notes: sNotes
				});


				
				this.getView().getModel("fileModel").setData(oData);

				// Clear the file uploader and note input
				oFileUploader.clear();
				this.byId("noteInput").setValue("");
				MessageToast.show("File uploaded successfully.");
					}.bind(this);

				reader.readAsDataURL(oFile); // Convert file to base64
			} else {
				MessageToast.show("Please select a file to upload.");
			}
        },
		_createEntity: function (oPayload) {
			var oModel = this.getView().getModel(); // Assuming the default model is the OData V4 model
		
			// Create a new context for the entity to be added to the "Files" collection
			var oContextBinding = oModel.bindList("/Files");
		
			// Create a new entity in the "Files" collection
			var oNewEntityContext = oContextBinding.create(oPayload);
		
			// Submit the changes
			oModel.submitBatch("batchGroupId").then(function () {
				MessageToast.show("File uploaded to the server successfully.");
			}).catch(function (oError) {
				MessageToast.show("Error uploading file to the server.");
				console.error("Error uploading file:", oError);
			});
		}
    });
});