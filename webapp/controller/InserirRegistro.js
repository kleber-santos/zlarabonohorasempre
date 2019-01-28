sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",

], function (ManagedObject, MessageBox, Utilities, History, JSONModel) {

	return ManagedObject.extend("whr.com.br.controller.InserirRegistro", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "whr.com.br.view.InserirRegistro", this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			return {};

		},
		_onButtonPress: function () {

			var lv_hora_entrada,
				lv_hora_saida,
				lv_motivo_entrada,
				lv_motivo_saida,
				lv_tipo_entrada,
				lv_tipo_saida,
				lv_data_ent,
				lv_data_sai;

			var globalModel = new sap.ui.model.json.JSONModel();

			lv_hora_entrada = this.getView().byId("picker01").getDateValue();
			lv_hora_saida = this.getView().byId("picker05").getValue();
			lv_motivo_entrada = this.getView().byId("Motivo00").getSelectedKey();
			lv_motivo_saida = this.getView().byId("Motivo01").getSelectedKey();
			lv_tipo_entrada = this.getView().byId("Tipo01").getSelectedKey();
			lv_tipo_saida = this.getView().byId("Tipo02").getSelectedKey();

			var horaInicio = this.timeFormatter.format(lv_hora_entrada);
			var horaFim = this.timeFormatter.format(lv_hora_saida);

			var requestBody = {};
			var child = [];

			var oTable = this.getView().byId("table");

			var itemsSelected = oTable.getSelectedItems();

			var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

			for (var i = 0; i < itemsSelected.length; i++) {

				var item = itemsSelected[i];

				var context = item.getBindingContext();

				if (horaInicio != undefined) {
					child.push({
						Pernr: context.getProperty("Pernr"),
						//Cname: context.getProperty("Cname"),
						Ldate: context.getProperty("ZlDtocor"),
						Ltime: horaInicio,
						Satza: 'P01',
						Dallf: '-',
						Abwgr: lv_motivo_entrada,
						//Terid: context.getProperty("TpOcor"),
						//PspPhtd: context.getProperty("PspPhtd"),
						//PspPhtdtx: context.getProperty("PspPhtdtx"),
						//Sobeg: context.getProperty("Sobeg"),
						//Pabeg: context.getProperty("Pabeg"),
						//Paend: context.getProperty("Paend"),
						//Soend: context.getProperty("Soend"),
						//DiaSemana: context.getProperty("Diasemana"),
						//Type: lv_tipo_entrada,
						//Message: context.getProperty("Message"),
					});
				}
				
				if (horaFim != undefined) {
					child.push({
						Pernr: context.getProperty("Pernr"),
						//Cname: context.getProperty("Cname"),
						Ldate: context.getProperty("ZlDtocor"),
						Ltime: horaFim,
						Satza: 'P01',
						Dallf: '-',
						Abwgr: lv_motivo_entrada,
						//Terid: context.getProperty("TpOcor"),
						//PspPhtd: context.getProperty("PspPhtd"),
						//PspPhtdtx: context.getProperty("PspPhtdtx"),
						//Sobeg: context.getProperty("Sobeg"),
						//Pabeg: context.getProperty("Pabeg"),
						//Paend: context.getProperty("Paend"),
						//Soend: context.getProperty("Soend"),
						//DiaSemana: context.getProperty("Diasemana"),
						//Type: lv_tipo_entrada,
						//Message: context.getProperty("Message"),
					});
					
				}

			}

			requestBody.Pernr = '00100072';

			requestBody.REGISTRO_SAVE2Set = child;

			//Issue Create

			//oModel.create('/<collection_name>', requestBody, null, function() { alert ('success')}, function() { alert('failed'} );
			oModel.create("/DADOS_REGISTRO_SAVESet", requestBody, {
				success: (function (oData, response) {
					sap.m.MessageBox.success("Gravado com sucesso!", {
						title: "Sucesso",
						initialFocus: null
					});
				}),
				error: function (Error) {

					var message = JSON.parse(Error.response.body);

					var msgText = message.error.message.value;

					//sap.m.MessageBox.show(msgText, sap.m.MessageBox.Icon.ERROR);
					sap.m.MessageBox.error(msgText, {
						title: "Erro",
						initialFocus: null
					});
				}
			});

			/*			var TimezoneOffset = new Date(0).getTimezoneOffset();
						var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
						var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss a"}); 
						
						//var timeStr = timeFormat.format(new Date(lv_hora_entrada + TZOffsetMs));  //11:00 AM 

						var horaEntrada = timeFormat.parse(lv_hora_entrada).getTime()  - TZOffsetMs; //39600000 
						var horaSaida = timeFormat.parse(lv_hora_saida).getTime()  - TZOffsetMs; //39600000 
			*/
			/*			globalModel.setData({
						    hora_entrada: horaEntrada,
						    hora_saida: horaSaida,
						    cdmot_entrada: lv_motivo_entrada,
						    cdmot_saida: lv_motivo_saida
						   
						});
						
						sap.ui.getCore().setModel(globalModel, 'global_inserir');*/
			this.getView().byId("table").getBinding("items").refresh();
			//VIES
			this.close();

			this.close();

		},

		formatTime: function (time) {
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "HH:mm"
			});
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));
			return timeStr;
		},
		_onButtonPress1: function () {

			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		},

		timeFormatter: sap.ui.core.format.DateFormat.getDateInstance({

			pattern: "PThh'H'mm'M'ss'S'"

		}),

		addRow: function (oArg) {
			var row = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: ""
					}),
					new sap.m.Text({
						text: ""
					}),
					new sap.m.Text({
						text: ""
					}),
					new sap.m.Text({
						text: ""
					}),
					new sap.m.Button({
						icon: "sap-icon://delete",
						press: function (oEvent) {

						}
					})
				]
			});

			this.byId("table1").addItem(row);
			this.byId("table1").getModel().refresh();

			this._data.Products.push({
				Name: '',
				size: ''
			});
			this.jModel.refresh(); //which will add the new record
		}

	});
}, /* bExport= */ true);