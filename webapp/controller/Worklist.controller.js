sap.ui.define([
	"whr/com/br/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"whr/com/br/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/Dialog",
	"./Justificativa",
	"./BtnJustificativa",
	"./utilities",
	"sap/ui/core/routing/History",
	"./InserirRegistro",
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox'

], function (BaseController, JSONModel, formatter, Filter, FilterOperator, fragment, Dialog, Justificativa, BtnJustificativa, Utilities,
	History,
	InserirRegistro, Controller, MessageBox) {
	"use strict";

	var begda, endda;

	return BaseController.extend("whr.com.br.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			var justificativaModel = new sap.ui.model.json.JSONModel(); // VIES
			sap.ui.getCore().setModel(justificativaModel, 'justificativaModel'); // VIES

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//	this.oRouter.getTarget("TimesheetEmpregado").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

			this.initCabecalho();

			this.carregarPeriodo();

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});

		},

		initCabecalho: function () {

			try {

				var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
				// create OData model instance with service URL and JSON format
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

				var that = this;
				that.getView().setBusy(true);

				oModel.read("/CABECALHO_PERFILSet('1')",
					undefined,
					undefined,
					false,
					function _OnSuccess(oData, response) {
						var jSONModel = new sap.ui.model.json.JSONModel();

						jSONModel.setData(oData);
						that.getView().setModel(jSONModel, "cabecalhoModel");
					},
					function _OnError(oError) {}
				);

			} catch (ex) {}
			that.getView().setBusy(false);
		},

		JustificativaDialog: null,

		carregarPeriodo: function () {

			try {

				var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
				// create OData model instance with service URL and JSON format
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

				var that = this;
				that.getView().setBusy(true);

				oModel.read("/PERIODOSet",
					undefined,
					undefined,
					false,
					function _OnSuccess(oData, response) {
						var jSONModel = new sap.ui.model.json.JSONModel();

						jSONModel.setData(oData);
						that.getView().setModel(jSONModel, "periodoModel");
					},
					function _OnError(oError) {}
				);

				var periodo = this.getView().getModel("periodoModel");
				var periodo2 = this.getView().getModel("periodoModel").getProperty("/");

				$.map(periodo2, function (obj, index) {

				});

				//oModel.read("/CABECALHO_PERFILSet('1')", { success : (oData, response) => { debugger; } });

			} catch (ex) {}
			that.getView().setBusy(false);
		},

		carregarMotivo: function () {

			try {

				var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
				// create OData model instance with service URL and JSON format
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

				var that = this;
				that.getView().setBusy(true);

				oModel.read("/MOTIVOSet",
					undefined,
					undefined,
					false,
					function _OnSuccess(oData, response) {
						var jSONModel = new sap.ui.model.json.JSONModel();

						jSONModel.setData(oData);
						that.getView().setModel(jSONModel, "motivoModel");
					},
					function _OnError(oError) {}
				);

				//oModel.read("/CABECALHO_PERFILSet('1')", { success : (oData, response) => { debugger; } });

			} catch (ex) {}
			that.getView().setBusy(false);
		},

		carregarStatus: function () {

			try {

				var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
				// create OData model instance with service URL and JSON format
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

				var that = this;
				that.getView().setBusy(true);

				oModel.read("/STATUSSet",
					undefined,
					undefined,
					false,
					function _OnSuccess(oData, response) {
						var jSONModel = new sap.ui.model.json.JSONModel();

						jSONModel.setData(oData);
						that.getView().setModel(jSONModel, "statusModel");
					},
					function _OnError(oError) {}
				);

				//oModel.read("/CABECALHO_PERFILSet('1')", { success : (oData, response) => { debugger; } });

			} catch (ex) {}
			that.getView().setBusy(false);
		},
		carregarAbonos: function () {

			try {

				var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
				// create OData model instance with service URL and JSON format
				var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

				var that = this;
				that.getView().setBusy(true);

				oModel.read("/ABONO_ITEMSSet/?$filter=(Begda eq datetime'2015-06-11T00:00:00' and Endda eq datetime'2015-07-10T00:00:00')",
					undefined,
					undefined,
					false,
					function _OnSuccess(oData, response) {
						var jSONModel = new sap.ui.model.json.JSONModel();

						jSONModel.setData(oData);
						that.getView().setModel(jSONModel, "worklistView");
					},
					function _OnError(oError) {}
				);

				//oModel.read("/CABECALHO_PERFILSet('1')", { success : (oData, response) => { debugger; } });

			} catch (ex) {}
			that.getView().setBusy(false);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);

			//VIES
			var oTable,
				lv_selected,
				globalMotivoModel,
				globalInserirModel;

			oTable = this.byId("table").getItems();
			globalMotivoModel = sap.ui.getCore().getModel("globalMotivoModel");
			globalInserirModel = sap.ui.getCore().getModel('global_inserir');
			var that = this;
			this._teste = [];

			//if (globalModel != undefined || globalInserirModel != undefined){
			for (var i = 0; i < iTotalItems; i++) {
				lv_selected = '';
				lv_selected = oTable[i].getSelected();
				oTable[i].getCells()[8].setText(i); // seta index da linha

				//this.byId("Time01").setText("Teste");
				if (lv_selected === true) {
					if (globalInserirModel != undefined) {
						//var x = this.getView().getModel().getProperty(oTable[i].getBindingContext().getPath());
						//x.ZlBeguz.ms = globalInserirModel.oData.hora_entrada;

						//this.getView().getModel().setProperty(oTable[i].getBindingContext().getPath(), x);
						//this.getView().getModel().refresh(true);

						var timeFormat = sap.ui.core.format.DateFormat.getTimeInstan10e({
							pattern: "KK:mm"
						});
						var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;

						var horaInicio = timeFormat.format(new Date(globalInserirModel.oData.hora_entrada + TZOffsetMs));
						var horaSaida = timeFormat.format(new Date(globalInserirModel.oData.hora_saida + TZOffsetMs));

						oTable[i].getCells()[3].getItems()[0].getItems()[0].setText(horaInicio);
						oTable[i].getCells()[3].getItems()[0].getItems()[4].setText(horaSaida);
						//oTable[i].getCells()[8].setText();

					}

					/*Se o usuário incluir um justificativa, retorna setando os valores da tabela.*/

					if (globalMotivoModel != undefined) {

						//oTable[i].getCells()[9].setText(globalMotivoModel.oData.motivo);
						oTable[i].getCells()[10].setText(globalMotivoModel.oData.justificativaEmp);

						/*var justificativaModel = sap.ui.getCore().getModel("justificativaModel");

						this._teste[i] = {
							index: i,
							Atext: globalModel.oData.motivo,
							Message: globalModel.oData.justificativaEmp

						};

						justificativaModel.setData(this._teste);*/
					}
				}
			}

			//}

			//VIES
		},

		onchangeComboPeriodo: function (oEvent) {
			var periodoID = oEvent.getParameter("selectedItem").getKey();

			var globalModel = new sap.ui.model.json.JSONModel();
			globalModel.setData({
				periodo: periodoID,
			});
			sap.ui.getCore().setModel(globalModel, 'global2');

		},

		onPesquisar: function (oEvent) {

			var globalModel = sap.ui.getCore().getModel("global2");
			var periodoModel = this.getView().getModel("periodoModel");
			var cabecalhoModel = this.getView().getModel("cabecalhoModel");

			var pernr = cabecalhoModel.oData.Pernr;
			var periodoID = globalModel.oData.periodo;
			

			for (var y = 0; y < periodoModel.oData.results.length; y++) {
				if (periodoID == periodoModel.oData.results[y].CodPer) {
					begda = periodoModel.oData.results[y].Begda;
					endda = periodoModel.oData.results[y].Endda;

				}
			}

			var that = this;
			that.getView().setBusy(true);

			var aFilters = [];

			aFilters.push(new Filter("Begda", FilterOperator.EQ, begda));
			aFilters.push(new Filter("Endda", FilterOperator.EQ, endda));
			aFilters.push(new Filter("PernrLog", FilterOperator.EQ, pernr));

			var oBinding = this.byId("table").getBinding("items");
			oBinding.filter(aFilters);
			that.getView().setBusy(false);

			/*try {

						var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
						// create OData model instance with service URL and JSON format
						var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

						var that = this;
				
						oModel.read("/ABONO_ITEMSSet", {
						filters: aFilters,
						error: function(err) {
							that.getView().setBusy(false);
							MessageBox.error(JSON.parse(err.responseText).error.message.value);
						},
						success: function(oData) {
							
							
							
						}
					});
						
						
						
						

					} catch (ex) {}
					that.getView().setBusy(false);
					
				*/
		},

		onJustificativaDialog: function (oEvent) {
			var sDialogName = "Justificativa";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (this.checkTableSelecionado() == false) {
				var bCompact = !!this.getView().$().closest("sapUISizeCompact").length;
				MessageBox.error('Selecione pelo menos 1 item na tabela!', {
						StyleClass: bCompact ? "sapUISizeCompact" : ""
					}

				);
			} else {
				var oTable = this.byId("table").getItems();

				if (!oDialog) {
					oDialog = new Justificativa(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				oDialog.open();
			}
		},

		onInserirRegistro: function () {

			var sDialogName = "InserirRegistro";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (this.checkTableSelecionado() == false) {
				var bCompact = !!this.getView().$().closest("sapUISizeCompact").length;
				MessageBox.error('Selecione pelo menos 1 item na tabela!', {
						StyleClass: bCompact ? "sapUISizeCompact" : ""
					}

				);
			} else {

				if (!oDialog) {
					oDialog = new InserirRegistro(this.getView());
					this.mDialogs[sDialogName] = oDialog;

					// For navigation.
					oDialog.setRouter(this.oRouter);
				}
				
				this.carregarMotivo();
				oDialog.open();
			}
		},

		onEnviarAprovacao2: function () {

			var pernr = this.byId("pernr").getText();
			//begda
			//endda
			var that;
			that = this;

			this.getView().setBusy(true);

			$.ajax({
				url: "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV/ABONO_ITEMSSet?$format=json&$filter=Begda eq datetime'2015-06-11T00:00:00' and Endda eq datetime'2015-07-10T00:00:00'",
				type: "GET",
				dataType: "json",
				cache: true,
				headers: {
					'Cache-Control': 'max-age=7200'
				},

				success: function (json) {
					var oTable,
						lv_selected,
						lv_length,
						lv_numero,
						lv_numero_formatado,
						dateFormat,
						lv_data_fomatada,
						lv_data_linha,
						lv_hora_inicio,
						lv_hora_fim,
						lv_data,
						timeFormat,
						lv_ZL_BEGUZ,
						lv_ZL_ENDUZ,
						lv_index;

					oTable = that.byId("table").getItems();
					lv_length = oTable.length;

					for (var i = 0; i < lv_length; i++) {

						// formata a data em objeto
						lv_numero = json.d.results[i].ZlDtocor.substring(6, 19);
						lv_numero_formatado = parseInt(lv_numero);
						var lv_data_retorno = new Date(lv_numero_formatado);

						// formata data DD/MM/AAAA
						var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
								pattern: "dd/MM/yyyy"
							}),
							lv_data_fomatada = dateFormat.format(lv_data_retorno);

						//Data da linha
						lv_data_linha = oTable[i].getCells()[0].getItems()[0].getItems()[0].getItems()[0].getText();

						//Hora início
						lv_hora_inicio = oTable[i].getCells()[3].getItems()[0].getItems()[0].getText();

						//formata para objeto data para depois formatar "PThh'H'mm'M'ss'S'"
						lv_data = new Date('2018/11/21 ' + lv_hora_inicio + '');
						timeFormat = sap.ui.core.format.DateFormat.getDateInstance({
							pattern: "PThh'H'mm'M'ss'S'"
						});

						lv_ZL_BEGUZ = timeFormat.format(lv_data);

						// Hora Fim
						lv_hora_fim = oTable[i].getCells()[3].getItems()[0].getItems()[4].getText();
						lv_data = '';
						lv_data = new Date('2018/11/21 ' + lv_hora_inicio + '');
						lv_ZL_ENDUZ = timeFormat.format(lv_data);

						lv_selected = '';
						lv_selected = oTable[i].getSelected();

						if (lv_selected === true && lv_data_fomatada === lv_data_linha) {

							var contactEntry1 = {
									Pernr: '321',
									Cname: 'teste'

								},

								contactEntry2 = {
									Pernr: '123',
									Cname: 'teste'

								};

							lv_index = oTable[i].getCells()[8].getText();

							that.buscaJustificativa(lv_index);

							var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
							var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

							var batchChanges = [];
							batchChanges.push(that.oModel.createBatchOperation("Contacts", "POST", contactEntry1));
							batchChanges.push(that.oModel.createBatchOperation("Contacts", "POST", contactEntry2));
							that.oModel.addBatchChangeOperations(batchChanges);
							//submit changes and refresh the table and display message
							that.oModel.submitBatch(function (data) {
								that.oModel.refresh();
								sap.ui.commons.MessageBox.show(data.__batchResponses[0].__changeResponses.length + " contacts created", sap.ui.commons.MessageBox
									.Icon.SUCCESS,
									"Batch Save", sap.ui.commons.MessageBox.Action.OK);
							}, function (err) {});

							oModel.create(
								"/ABONO_SAVESet", {
									Pernr: '123',
									Cname: 'teste'
								}, {
									sucess: $.proxy(function (oData, response) {

									}, this),
									error: $.proxy(function (oError) {

									}, this),

								});
						}
					}
				},

				error: function (xhr) {
					var error = 'Erro';
				}

			});

			this.getView().setBusy(false);

		},

		onEnviarAprovacao: function (oEvent) {

			var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

			//var oTable = oEvent.getSource();
			var lv_selected;
			var that = this;

			//oTable = this.byId("table").getItems();
			var oTable = this.getView().byId("table");
			var itemsSelected = oTable.getSelectedItems();

			var batchChanges = [];

			for (var i = 0; i < itemsSelected.length; i++) {
				/*				lv_selected = '';
								lv_selected = oTable[i].getSelected();

								if (lv_selected === true) {*/
				//var x = this.getView().getModel().getProperty(oTable[i].getBindingContext().getPath());

				var item = itemsSelected[i];

				var context = item.getBindingContext();

				var value = context.getProperty("Diasemana");

				var abonoEntry = {
					Pernr: '00100059',
					Cname: context.getProperty("Cname"),
					Persk: 'CC',
					ZlDtocor: context.getProperty("ZlDtocor"),
					Diasemana: 'DO',
					ZlBeguz: '1000',
					ZlEnduz: '1800',
					Vtken: '1',
					ZLgart: context.getProperty("ZLgart"),
					TpOcor: 'A',
					Awart: '0669',
					ZlLgart: '9FBN',
					Lgtxt: '',
					ZlAnzhl: '',
					Hrgmt: '',
					PspPhtd: '',
					PspPhtdtx: '',
					Sobeg: '',
					Pabeg: '',
					Paend: '',
					Soend: '',
					Newbegtm: '',
					Newendtm: '',
					Cdmot: '',
					Type: '',
					Message: ''

				};
				batchChanges.push(oModel.createBatchOperation("ABONO_SAVESet", "POST", abonoEntry));

				//}
			}

			oModel.addBatchChangeOperations(batchChanges);
			//submit changes and refresh the table and display message
			oModel.submitBatch(function (data) {
				oModel.refresh();
				sap.ui.commons.MessageBox.show(data.__batchResponses[0].__changeResponses.length + " contacts created", sap.ui.commons.MessageBox
					.Icon.SUCCESS,
					"Batch Save", sap.ui.commons.MessageBox.Action.OK);
			}, function (err) {

			});

		},

		onEnviarAprovacao3: function (oEvent) {
			var sServiceUrl = "/sap/opu/odata/SAP/ZLAR_TIMEWEB_SRV";
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			var pernr = this.byId("pernr").getText();

			var requestBody = {};

			/*
			requestBody.PurOrg = 'WW';
			*/
			//Child Body

			var child = [];

			var oTable = this.getView().byId("table");
			var itemsSelected = oTable.getSelectedItems();

			for (var i = 0; i < itemsSelected.length; i++) {
				/*				lv_selected = '';
								lv_selected = oTable[i].getSelected();

								if (lv_selected === true) {*/
				//var x = this.getView().getModel().getProperty(oTable[i].getBindingContext().getPath());

				var item = itemsSelected[i];

				var context = item.getBindingContext();

				//var value = context.getProperty("Diasemana");

				/*child.push({
					Pernr: '00100072',
					Cname: context.getProperty("Cname"),
					Persk: 'CC',
					ZlDtocor: context.getProperty("ZlDtocor"),
					Diasemana: 'DO',
					ZlBeguz: '1000',
					ZlEnduz: '1800',
					Vtken: '1',
					ZLgart: context.getProperty("ZLgart"),
					TpOcor: 'A',
					Awart: '0669',
					ZlLgart: '9FBN',
					/*	Lgtxt: '',
						ZlAnzhl: '10',
						Hrgmt: '1000',
						PspPhtd: '',
						PspPhtdtx: '',
						Sobeg: '',
						Pabeg: '',
						Paend: '',
						Soend: '',
						Newbegtm: '',
						Newendtm: '',
						Cdmot: '',
						Type: '',
					Message: ''
				});*/

				child.push({
					Pernr: context.getProperty("Pernr"),
					Cname: context.getProperty("Cname"),
					Persk: context.getProperty("Persk"),
					ZlDtocor: context.getProperty("ZlDtocor"),
					Diasemana: context.getProperty("Diasemana"),
					ZlBeguz: context.getProperty("ZlBeguz"),
					ZlEnduz: context.getProperty("ZlEnduz"),
					Vtken: context.getProperty("Vtken"),
					ZLgart: context.getProperty("ZLgart"),
					TpOcor: context.getProperty("TpOcor"),
					Awart: context.getProperty("Awart"),
					ZlLgart: context.getProperty("ZlLgart"),
					Lgtxt: context.getProperty("Lgtxt"),
					ZlAnzhl: context.getProperty("ZlAnzhl"),
					Hrgmt: context.getProperty("Hrgmt"),
					PspPhtd: context.getProperty("PspPhtd"),
					PspPhtdtx: context.getProperty("PspPhtdtx"),
					Sobeg: context.getProperty("Sobeg"),
					Pabeg: context.getProperty("Pabeg"),
					Paend: context.getProperty("Paend"),
					Soend: context.getProperty("Soend"),
					Newbegtm: context.getProperty("Newbegtm"),
					Newendtm: context.getProperty("Newendtm"),
					Cdmot: context.getProperty("Cdmot"),
					Type: context.getProperty("	Type"),
					Message: context.getProperty("Message"),
				});

			}

			//Add child to request
			requestBody.Pernr = pernr;

			requestBody.ABONO_SAVE2Set = child;

			//Issue Create

			//oModel.create('/<collection_name>', requestBody, null, function() { alert ('success')}, function() { alert('failed'} );
			oModel.create("/DADOS_SAVESet", requestBody, {
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

		},
		buscaJustificativa: function (lv_index) {
			var justificativaModel = sap.ui.getCore().getModel("justificativaModel");
			lv_index = parseInt(lv_index);
			for (var i = 0; i < justificativaModel.oData.length; i++) {
				if (lv_index === justificativaModel.oData[i].index) {
					this.motivo = justificativaModel.oData[i].Atext;
					this.justificativa = justificativaModel.oData[i].Message;
				}
			}

		},
		insereRegistro: function (oData) {
			var teste = 0;
		},
		onFragmentCallback: function () {
			//MessageToast.show("Back in controller");
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function () {
			history.go(-1);
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter("Cname", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(oTableSearchState);
			}

		},

		carregarBtnJustificativa: function (oEvent) {
			// if (!this._oPopover) {
			// 	this._oPopover = sap.ui.xmlfragment("whr.com.br.view.Popover", this);
			// 	//this._oPopover.bindElement("/ProductCollection/0");
			// 	this.getView().addDependent(this._oPopover);
			// }

			var sDialogName = "BtnJustificativa";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];
			var tb = this.getView().byId("table");
			var rowid = tb.setSelectedKey;

			if (!oDialog) {
				oDialog = new BtnJustificativa(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}

			var justificativaModel = sap.ui.getCore().getModel("justificativaModel");
			//oDialog.setModel(justificativaModel);

			oDialog.open();
			//Limpa tela
			//this.getView().byId("Motivo2").setSelectedKey(null);
			this.getView().byId("justificativa2").setValue(null);
			//this.getView().byId("justivicativaGest_teste").setValue(null);

			var index = parseInt(oEvent.getSource().getParent().getCells()[8].getText());

			/*			var indexModel = new sap.ui.model.json.JSONModel(); // VIES
						sap.ui.getCore().setModel(indexModel, 'indexModel'); // VIES

						indexModel.setData({
							index: index
						});

						var oLinhas = this.byId("table").getItems().length;

						for (var i = 0; i < oLinhas; i++) {
							if (i === index) {
								for (var y = 0; y < justificativaModel.oData.length; y++) {
									if (i === y && y === justificativaModel.oData[y].index) {*/
			//this.getView().byId("Motivo2").setSelectedKey(oEvent.getSource().getParent().getCells()[9].getText());
			this.getView().byId("justificativa2").setValue(oEvent.getSource().getParent().getCells()[10].getText());
			//this.getView().byId("justivicativaGest_teste").setValue(justificativaModel.oData[y].justivicativaGest);
			/*				}
						}

					}
				}*/

		},

		handleCloseButton: function (oEvent) {
			this._oPopover.close();
		},

		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Pernr")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {object} oTableSearchState an array of filters for the search
		 * @private
		 */
		_applySearch: function (oTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(oTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (oTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		teste: function (oEvent) {
			//this.byId("justivicativaEmp").setValue("testee");
			//var justificativaModel = sap.ui.getCore().getModel("justificativaModel");
			//this._oPopover.setModel(justificativaModel);
		},
		formatTime: function (time) {
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "HH:mm"
			});
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));
			return timeStr;
		},
		formatDate: function (v) {

			jQuery.sap.require("sap.ui.core.format.DateFormat");

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd/MM/YYYY"
			});

			return oDateFormat.format(new Date(v));

		},
		checkTableSelecionado: function () {

			var oTable,
				lv_selected,
				retorno = false;

			oTable = this.byId("table").getItems();

			for (var i = 0; i < oTable.length; i++) {
				lv_selected = '';
				lv_selected = oTable[i].getSelected();
				if (lv_selected === true) {
					retorno = true;
				}
			}
			return retorno;
		}

	});
});