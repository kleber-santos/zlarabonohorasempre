var _fragments = [];
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	], function (Controller) {
		"use strict";

		return Controller.extend("whr.com.br.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

		openFragment: function(sName, model, updateModelAlways, callback, data) {
			if (sName.indexOf(".") > 0) {
				var aViewName = sName.split(".");
				sName = sName.substr(sName.lastIndexOf(".") + 1);
			} else { //current folder
				aViewName = this.getView().getViewName().split("."); // view.login.Login
			}
			aViewName.pop();
			var sViewPath = aViewName.join("."); // view.login
			if (sViewPath.toLowerCase().indexOf("fragments") > 0) {
				sViewPath += ".";
			} else {
				sViewPath += ".fragments.";
			}
			var id = this.getView().getId() + "-" + sName;
			if (!_fragments[id]) {
				//create controller
				var sControllerPath = sViewPath.replace("view", "controller");
				try {
					var controller = sap.ui.controller(sControllerPath + sName);
				} catch (ex) {
					controller = this;
				}
				_fragments[id] = {
					fragment: sap.ui.xmlfragment(
						id,
						sViewPath + sName,
						controller
					),
					controller: controller
				};
				if (model && !updateModelAlways) {
					_fragments[id].fragment.setModel(model);
				}
				// version >= 1.20.x
				this.getView().addDependent(_fragments[id].fragment);
			}
			var fragment = _fragments[id].fragment;
			if (model && updateModelAlways) {
				fragment.setModel(model);
			}
			if (_fragments[id].controller && _fragments[id].controller !== this) {
				_fragments[id].controller.onBeforeShow(this, fragment, callback, data);
			}

			setTimeout(function() {
				fragment.open();
			}, 100);
		},



			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			}

		});

	}
);