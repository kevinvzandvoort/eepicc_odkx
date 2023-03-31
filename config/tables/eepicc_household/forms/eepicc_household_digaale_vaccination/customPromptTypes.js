define(['promptTypes','jquery','underscore', 'opendatakit', 'database', 'prompts'],
function(promptTypes, $, _, opendatakit, database) {
    
	return {	
        "linked_table2" : promptTypes._linked_type.extend({
			
			type: "linked_table2",
			templatePath: '../config/tables/eepicc_household/forms/eepicc_household_digaale/linked_table2.handlebars',
    valid: true,
    _cachedEvent: null,
	_protoDisplay: {
		new_button_label: 'linked_table_new_instance_label',
		},
    launchAction: 'org.opendatakit.survey.activities.MainMenuActivity',

    events: {
        "click .openInstance": "openInstance",
        "click .deleteInstance": "confirmDeleteInstance",
        "click .addInstance": "addInstance"
    },
    disableButtons: function() {
        var that = this;
        that.$('.openInstance').prop('disabled', true);
        that.$('.deleteInstance').prop('disabled', true);
        that.$('.addInstance').prop('disabled', true);
    },
    enableButtons: function() {
        var that = this;
        that.$('.openInstance').prop('disabled', false);
        that.$('.deleteInstance').prop('disabled', false);
        that.$('.addInstance').prop('disabled', false);
    },
    choice_filter: function(){ return true; },
    configureRenderContext: function(ctxt) {
        var that = this;
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);
        odkCommon.log('D',"prompts." + that.type + ".configureRenderContext", "px: " + that.promptIdx);
        that.renderContext.new_instance_text = ((that.display.new_instance_text !== null &&
                that.display.new_instance_text !== undefined) ? that.display.new_instance_text : "New");
        that.getlinkedModel($.extend({},ctxt,{success:function(linkedModel) {
            var dbTableName = linkedModel.table_id;
            var selString = that.convertSelection(linkedModel);
            var selArgs = queryDefn.selectionArgs();
            var ordBy = that.convertOrderBy(linkedModel);
            var displayElementName = that.getLinkedInstanceName();
            odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.before.get_linked_instances", "px: " + that.promptIdx);
			
			var database2 = database;
			database2.get_linked_instances2 = function(ctxt, dbTableName, selection, selectionArgs, displayElementName, orderBy) {
        var that = this;
        //
        // UserTable lt = DataIf.query( dbTableName, selection, selectionArgs, null, null, orderBy, "ASC", null, null, false, postprocessorcb
        //
        // And, on the postprocessorcb success callback:
        //
        // for ( var i = 0 ; i < result.rows.length ; i+=1 ) {
        //      var instance = result.rows.item(i);
        //      var ts = odkCommon.toDateFromOdkTimeStamp(instance._savepoint_timestamp);
        //      instanceList.push({
        //          display_field: (displayElementName === undefined || displayElementName === null) ? ((ts == null) ? "" : ts.toISOString()): instance[displayElementName],
        //          instance_id: instance._id,
        //          savepoint_timestamp: ts,
        //          savepoint_type: instance._savepoint_type,
        //          savepoint_creator: instance._savepoint_creator,
        //          locale: instance._locale,
        //          form_id: instance._form_id
        //      });
        //  }
        //  ctxt.log('D','get_linked_instances.inside', dbTableName + " instanceList: " + instanceList.length);
        //  ctxt.success(instanceList);
        if ( dbTableName === "framework" ) {
            ctxt.success([]);
            return;
        }

        var ss = that._selectMostRecentFromDataTableStmt(dbTableName, selection, selectionArgs, orderBy);
        odkData.arbitraryQuery(dbTableName, ss.stmt, ss.bind, null, null,
            function(reqData) {
                var instanceList = [];
                for (var rowCntr = 0; rowCntr < reqData.getCount(); rowCntr++) {
                    var ts = odkCommon.toDateFromOdkTimeStamp(reqData.getData(rowCntr, '_savepoint_timestamp'));
                    instanceList.push({
                        display_field: (displayElementName === undefined || displayElementName === null) ?
                                            ((ts === null) ? "" : ts.toISOString()): reqData.getData(rowCntr, displayElementName),
						age_years: reqData.getData(rowCntr, 'age_years'),
						household_id: reqData.getData(rowCntr, 'household_id'),
                        instance_id: reqData.getData(rowCntr, '_id'),
                        savepoint_timestamp: ts,
                        savepoint_type: reqData.getData(rowCntr, '_savepoint_type'),
                        savepoint_creator: reqData.getData(rowCntr, '_savepoint_creator'),
                        locale: reqData.getData(rowCntr, '_locale'),
                        form_id: reqData.getData(rowCntr, '_form_id'),
                        default_access: reqData.getData(rowCntr, '_default_access'),
                        row_owner: reqData.getData(rowCntr, '_row_owner'),
                        group_read_only: reqData.getData(rowCntr, '_group_read_only'),
                        group_modify: reqData.getData(rowCntr, '_group_modify'),
                        group_privileged: reqData.getData(rowCntr, '_group_privileged'),
                        effective_access: reqData.getData(rowCntr, '_effective_access')
                    });
                }
                ctxt.log('D','get_linked_instances.inside', dbTableName + " instanceList: " + instanceList.length);
                ctxt.success(instanceList);
            }, function(errorMsg) { 
                ctxt.failure({message: errorMsg}); 
            });
		}
			
            database2.get_linked_instances2($.extend({},ctxt,{success:function(instanceList) {
                odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.success.get_linked_instances", "px: " + that.promptIdx);
                var filteredInstanceList = _.filter(instanceList, function(instance) {
                    return that.choice_filter(instance);
                });
                
				cyrb128 = function(str) {
						let h1 = 1779033703, h2 = 3144134277,
						h3 = 1013904242, h4 = 2773480762;
						for (let i = 0, k; i < str.length; i++) {
							k = str.charCodeAt(i);
							h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
							h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
							h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
							h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
						}
						h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
						h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
						h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
						h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
						return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
					}
					
					function sfc32(a, b, c, d) {
						return function() {
							a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
							var t = (a + b) | 0;
							a = b ^ b >>> 9;
							b = c + (c << 3) | 0;
							c = (c << 21 | c >>> 11);
							d = d + 1 | 0;
							t = t + d | 0;
							c = c + t | 0;
							return (t >>> 0) / 4294967296;
						}
					}
					
					household_id = instanceList[0].household_id;
					
					// Create cyrb128 state:
					var seed = cyrb128((household_id).toString());
					
					// Four 32-bit component hashes provide the seed for sfc32.
					var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);
				
				//Make sure it is in the same order (except if age_years is changed in the script
				filteredInstanceList.sort((a,b) => a.age_years - b.age_years);
				
				var baklist = JSON.parse(JSON.stringify(filteredInstanceList));
				var listsize = 0;
				var i = 0;
				
				var baklist2 = JSON.parse(JSON.stringify(baklist));
				
				/* Change max iterations if you want to resample selected participants, if no participant is selected */
				//var MAX_ITERATIONS = 32;
				var MAX_ITERATIONS = 2;
				
				while(listsize == 0 && i < MAX_ITERATIONS){
					i++;	
					console.log("z_i is: "+i);
					baklist = JSON.parse(JSON.stringify(baklist2));
					
					//sample participants and assign to the parameter in name
				//that.name;
				filteredInstanceList = _.filter(baklist, function(instance) {
					
					var sp = 0;
					if(instance.age_years == 0) {sp = 0.599999} else
					if(instance.age_years == 1) {sp = 1} else
					if(instance.age_years >= 2 && instance.age_years <= 4) {sp = 0.05} else
					if(instance.age_years >= 5 && instance.age_years <= 14) {sp = 0.50} else
					if(instance.age_years >= 15 && instance.age_years <= 29) {sp = 0.25} else
					if(instance.age_years >= 30 && instance.age_years <= 49) {sp = 0.1701355} else
					if(instance.age_years >= 50) {sp = 1} else
					sp = 0;
					
					instance.rand = rand();
					
					return instance.rand <= sp;
                });
				
				listsize = filteredInstanceList.length;
				
				}
				
				console.log("z_i filtered size is: "+listsize);
				
				instanceList = filteredInstanceList;
				
                // set the image icon
                for (var i = 0; i < instanceList.length ; i++){
                    // sets the savepoint_type to incomplete if the formId doesn't match the current form
                    if (instanceList[i].form_id != that.getLinkedFormId()) {
                        instanceList[i].savepoint_type = opendatakit.savepoint_type_incomplete;
                    }

                    if (instanceList[i].savepoint_type == "COMPLETE"){
                        instanceList[i].icon_class = "glyphicon-ok";
                    }
                    else{
                        instanceList[i].icon_class = "glyphicon-warning-sign";
                    }
                    //make the date more readable
                    instanceList[i].savepoint_timestamp = opendatakit.getShortDateFormat(instanceList[i].savepoint_timestamp);
                }

                that.renderContext.instances = instanceList;

                that.renderContext.columns = [
                    { title : "Last Saved"},
                    { title : "Name"},
                    { title : "Finalized"},
                    { title : ""}
                ];

				

                odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.success.get_linked_instances.success", "px: " + that.promptIdx + " instanceList: " + instanceList.length);
                ctxt.success();
            }}), dbTableName, selString, selArgs, displayElementName, ordBy);
        }}));
    },
    openInstance: function(evt) {
        var instanceId;
        var openButton = $(evt.target).closest(".openInstance");

        if (openButton !== null && openButton !== undefined) {
            instanceId = openButton.attr("instance-id");
        }
        else {
            odkCommon.log('E',"In linked_table.openInstance instanceId is undefined");
            return;
        }

        var that = this;
		
        that.disableButtons();
        var platInfo = opendatakit.getPlatformInfo();
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);

        var openInstanceElementKeyToValueMap = null;
        if ( queryDefn.openRowInitialElementKeyToValueMap ) {
            openInstanceElementKeyToValueMap = queryDefn.openRowInitialElementKeyToValueMap();
        }

        var dispatchStruct = {promptPath: that.getPromptPath(), userAction: 'launchSurvey'};

		var outcome = odkSurvey.openInstance(dispatchStruct,
			that.getLinkedTableId(),
			that.getLinkedFormId(),
			instanceId, openInstanceElementKeyToValueMap);

        odkCommon.log('D','linked_table.openInstance - doAction: ' +  platInfo.container + " outcome is " + outcome);
        if (outcome === null || outcome !== "OK") {
            odkCommon.log('W',"linked_table.openInstance - doAction cancelled -- Should be OK got >" + outcome + "<");
            that.enableButtons();
        } else {
            odkCommon.log('W',"linked_table.openInstance - doAction in play -- awaiting responseAvailable");
        }
    },
    confirmDeleteInstance: function(evt) {
        var that = this;
        var instanceId;
        var instanceName;
        var deleteButton = $(evt.target).closest(".deleteInstance");

        if (deleteButton !== null && deleteButton !== undefined) {
            instanceId  = deleteButton.attr("instance-id");
            instanceName = deleteButton.attr("instance-name");
        }
        else {
            odkCommon.log('E',"In linked_table.confirmDeleteInstance instanceId is undefined");
            return;
        }

        that._cachedEvent = evt;
        that._screen._screenManager.showConfirmationPopup({message: {text: "Delete " + instanceName + "?"},
                                                           promptIndex:that.promptIdx});
    },
    handleConfirmation: function() {
        var that = this;

        if (that._cachedEvent === null || that._cachedEvent === undefined ) {
            odkCommon.log('E',"In linked_table.handleConfirmation _cachedEvent is null");
            return ({message:"In linked_table.deleteInstance _cachedEvent is null"});
        }
        var instanceId;
        var deleteButton = $(that._cachedEvent.target).closest(".deleteInstance");

        if (deleteButton !== null && deleteButton !== undefined) {
            instanceId  = deleteButton.attr("instance-id");
        }
        else {
            odkCommon.log('W',"In linked_table.handleConfirmation instanceId is undefined");
            return null;
        }

        // TODO: should this be done here? Seems like it should wait for a reRender
        // var tableRow = $(that._cachedEvent.target).closest(".linkedTable tr");
        // if (tableRow !== null && tableRow !== undefined) {
        //     tableRow.remove();
        // }
        that.disableButtons();

        var ctxt = that.controller.newContext(that._cachedEvent, that.type + ".handleConfirmation");
        that.controller.enqueueTriggeringContext($.extend({},ctxt,{success:function() {
            odkCommon.log('D',"prompts." + that.type + ".handleConfirmation", "px: " + that.promptIdx);
            that.getlinkedModel($.extend({},ctxt,{success:function(linkedModel) {
                database.delete_checkpoints_and_row($.extend({},ctxt,{success:function() {
                        that.enableButtons();
                        that.reRender(ctxt);
                    },
                    failure:function(m) {
                        that.enableButtons();
                        that.reRender($.extend({},ctxt,{success:function() {
                                ctxt.failure(m);
                            },
                            failure:function(m2) {
                                ctxt.failure(m2);
                            }}));
                    }}), linkedModel, instanceId);
            }}));
        }, failure: function(m) {
            odkCommon.log('D',"prompts." + that.type + ".handleConfirmation -- prior event terminated with an error -- aborting!", "px: " + that.promptIdx);
            that.enableButtons();
            ctxt.failure(m);
        }}));
        that._cachedEvent = null;
        return null;
    },
    addInstance: function(evt) {
        var that = this;
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);
        that.disableButtons();
        var platInfo = opendatakit.getPlatformInfo();

        var newInstanceElementKeyToValueMap = null;
        if ( queryDefn.newRowInitialElementKeyToValueMap ) {
            newInstanceElementKeyToValueMap = queryDefn.newRowInitialElementKeyToValueMap();
        }

        var dispatchStruct = {promptPath: that.getPromptPath(), userAction: 'launchSurvey'};

		var outcome = odkSurvey.addInstance(dispatchStruct,
			that.getLinkedTableId(),
			that.getLinkedFormId(),
			newInstanceElementKeyToValueMap);

        odkCommon.log('D','linked_table.addInstance - doAction: ' +  platInfo.container + " outcome is " + outcome);
        if (outcome === null || outcome !== "OK") {
            odkCommon.log('W',"linked_table.addInstance - doAction cancelled -- Should be OK got >" + outcome + "<");
            that.enableButtons();
        } else {
            odkCommon.log('W',"linked_table.addInstance - doAction in play -- awaiting responseAvailable");
        }
    }
        }),
		
		"linked_table3" : promptTypes._linked_type.extend({
			
			type: "linked_table3",
			templatePath: '../config/tables/eepicc_household/forms/eepicc_household_digaale/linked_table3.handlebars',
    valid: true,
    _cachedEvent: null,
	_protoDisplay: {
		new_button_label: 'linked_table_new_instance_label',
		},
    launchAction: 'org.opendatakit.survey.activities.MainMenuActivity',

    events: {
        "click .openInstance": "openInstance",
        "click .deleteInstance": "confirmDeleteInstance",
        "click .addInstance": "addInstance"
    },
    disableButtons: function() {
        var that = this;
        that.$('.openInstance').prop('disabled', true);
        that.$('.deleteInstance').prop('disabled', true);
        that.$('.addInstance').prop('disabled', true);
    },
    enableButtons: function() {
        var that = this;
        that.$('.openInstance').prop('disabled', false);
        that.$('.deleteInstance').prop('disabled', false);
        that.$('.addInstance').prop('disabled', false);
    },
    choice_filter: function(){ return true; },
    configureRenderContext: function(ctxt) {
        var that = this;
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);
        odkCommon.log('D',"prompts." + that.type + ".configureRenderContext", "px: " + that.promptIdx);
        that.renderContext.new_instance_text = ((that.display.new_instance_text !== null &&
                that.display.new_instance_text !== undefined) ? that.display.new_instance_text : "New");
        that.getlinkedModel($.extend({},ctxt,{success:function(linkedModel) {
            var dbTableName = linkedModel.table_id;
            var selString = that.convertSelection(linkedModel);
            var selArgs = queryDefn.selectionArgs();
            var ordBy = that.convertOrderBy(linkedModel);
            var displayElementName = that.getLinkedInstanceName();
            odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.before.get_linked_instances", "px: " + that.promptIdx);
			
			var database2 = database;
			database2.get_linked_instances2 = function(ctxt, dbTableName, selection, selectionArgs, displayElementName, orderBy) {
        var that = this;
        //
        // UserTable lt = DataIf.query( dbTableName, selection, selectionArgs, null, null, orderBy, "ASC", null, null, false, postprocessorcb
        //
        // And, on the postprocessorcb success callback:
        //
        // for ( var i = 0 ; i < result.rows.length ; i+=1 ) {
        //      var instance = result.rows.item(i);
        //      var ts = odkCommon.toDateFromOdkTimeStamp(instance._savepoint_timestamp);
        //      instanceList.push({
        //          display_field: (displayElementName === undefined || displayElementName === null) ? ((ts == null) ? "" : ts.toISOString()): instance[displayElementName],
        //          instance_id: instance._id,
        //          savepoint_timestamp: ts,
        //          savepoint_type: instance._savepoint_type,
        //          savepoint_creator: instance._savepoint_creator,
        //          locale: instance._locale,
        //          form_id: instance._form_id
        //      });
        //  }
        //  ctxt.log('D','get_linked_instances.inside', dbTableName + " instanceList: " + instanceList.length);
        //  ctxt.success(instanceList);
        if ( dbTableName === "framework" ) {
            ctxt.success([]);
            return;
        }

        var ss = that._selectMostRecentFromDataTableStmt(dbTableName, selection, selectionArgs, orderBy);
        odkData.arbitraryQuery(dbTableName, ss.stmt, ss.bind, null, null,
            function(reqData) {
                var instanceList = [];
                for (var rowCntr = 0; rowCntr < reqData.getCount(); rowCntr++) {
                    var ts = odkCommon.toDateFromOdkTimeStamp(reqData.getData(rowCntr, '_savepoint_timestamp'));
                    instanceList.push({
                        display_field: (displayElementName === undefined || displayElementName === null) ?
                                            ((ts === null) ? "" : ts.toISOString()): reqData.getData(rowCntr, displayElementName),
						age_years: reqData.getData(rowCntr, 'age_years'),
						household_id: reqData.getData(rowCntr, 'household_id'),
                        instance_id: reqData.getData(rowCntr, '_id'),
                        savepoint_timestamp: ts,
                        savepoint_type: reqData.getData(rowCntr, '_savepoint_type'),
                        savepoint_creator: reqData.getData(rowCntr, '_savepoint_creator'),
                        locale: reqData.getData(rowCntr, '_locale'),
                        form_id: reqData.getData(rowCntr, '_form_id'),
                        default_access: reqData.getData(rowCntr, '_default_access'),
                        row_owner: reqData.getData(rowCntr, '_row_owner'),
                        group_read_only: reqData.getData(rowCntr, '_group_read_only'),
                        group_modify: reqData.getData(rowCntr, '_group_modify'),
                        group_privileged: reqData.getData(rowCntr, '_group_privileged'),
                        effective_access: reqData.getData(rowCntr, '_effective_access')
                    });
                }
                ctxt.log('D','get_linked_instances.inside', dbTableName + " instanceList: " + instanceList.length);
                ctxt.success(instanceList);
            }, function(errorMsg) { 
                ctxt.failure({message: errorMsg}); 
            });
		}
			
            database2.get_linked_instances2($.extend({},ctxt,{success:function(instanceList) {
                odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.success.get_linked_instances", "px: " + that.promptIdx);
                var filteredInstanceList = _.filter(instanceList, function(instance) {
                    return that.choice_filter(instance);
                });
                
				//Make sure it is in the same order (except if age_years is changed in the script
				filteredInstanceList.sort((a,b) => a.age_years - b.age_years);
				instanceList = filteredInstanceList;
				
                // set the image icon
                for (var i = 0; i < instanceList.length ; i++){
                    // sets the savepoint_type to incomplete if the formId doesn't match the current form
                    if (instanceList[i].form_id != that.getLinkedFormId()) {
                        instanceList[i].savepoint_type = opendatakit.savepoint_type_incomplete;
                    }

                    if (instanceList[i].savepoint_type == "COMPLETE"){
                        instanceList[i].icon_class = "glyphicon-ok";
                    }
                    else{
                        instanceList[i].icon_class = "glyphicon-warning-sign";
                    }
                    //make the date more readable
                    instanceList[i].savepoint_timestamp = opendatakit.getShortDateFormat(instanceList[i].savepoint_timestamp);
                }

                that.renderContext.instances = instanceList;

                that.renderContext.columns = [
                    { title : "Last Saved"},
                    { title : "Name"},
                    { title : "Finalized"},
                    { title : ""}
                ];

				

                odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.success.get_linked_instances.success", "px: " + that.promptIdx + " instanceList: " + instanceList.length);
                ctxt.success();
            }}), dbTableName, selString, selArgs, displayElementName, ordBy);
        }}));
    },
    openInstance: function(evt) {
        var instanceId;
        var openButton = $(evt.target).closest(".openInstance");

        if (openButton !== null && openButton !== undefined) {
            instanceId = openButton.attr("instance-id");
        }
        else {
            odkCommon.log('E',"In linked_table.openInstance instanceId is undefined");
            return;
        }

        var that = this;
		
        that.disableButtons();
        var platInfo = opendatakit.getPlatformInfo();
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);

        var openInstanceElementKeyToValueMap = null;
        if ( queryDefn.openRowInitialElementKeyToValueMap ) {
            openInstanceElementKeyToValueMap = queryDefn.openRowInitialElementKeyToValueMap();
        }

        var dispatchStruct = {promptPath: that.getPromptPath(), userAction: 'launchSurvey'};

		var outcome = odkSurvey.openInstance(dispatchStruct,
			that.getLinkedTableId(),
			that.getLinkedFormId(),
			instanceId, openInstanceElementKeyToValueMap);

        odkCommon.log('D','linked_table.openInstance - doAction: ' +  platInfo.container + " outcome is " + outcome);
        if (outcome === null || outcome !== "OK") {
            odkCommon.log('W',"linked_table.openInstance - doAction cancelled -- Should be OK got >" + outcome + "<");
            that.enableButtons();
        } else {
            odkCommon.log('W',"linked_table.openInstance - doAction in play -- awaiting responseAvailable");
        }
    },
    confirmDeleteInstance: function(evt) {
        var that = this;
        var instanceId;
        var instanceName;
        var deleteButton = $(evt.target).closest(".deleteInstance");

        if (deleteButton !== null && deleteButton !== undefined) {
            instanceId  = deleteButton.attr("instance-id");
            instanceName = deleteButton.attr("instance-name");
        }
        else {
            odkCommon.log('E',"In linked_table.confirmDeleteInstance instanceId is undefined");
            return;
        }

        that._cachedEvent = evt;
        that._screen._screenManager.showConfirmationPopup({message: {text: "Delete " + instanceName + "?"},
                                                           promptIndex:that.promptIdx});
    },
    handleConfirmation: function() {
        var that = this;

        if (that._cachedEvent === null || that._cachedEvent === undefined ) {
            odkCommon.log('E',"In linked_table.handleConfirmation _cachedEvent is null");
            return ({message:"In linked_table.deleteInstance _cachedEvent is null"});
        }
        var instanceId;
        var deleteButton = $(that._cachedEvent.target).closest(".deleteInstance");

        if (deleteButton !== null && deleteButton !== undefined) {
            instanceId  = deleteButton.attr("instance-id");
        }
        else {
            odkCommon.log('W',"In linked_table.handleConfirmation instanceId is undefined");
            return null;
        }

        // TODO: should this be done here? Seems like it should wait for a reRender
        // var tableRow = $(that._cachedEvent.target).closest(".linkedTable tr");
        // if (tableRow !== null && tableRow !== undefined) {
        //     tableRow.remove();
        // }
        that.disableButtons();

        var ctxt = that.controller.newContext(that._cachedEvent, that.type + ".handleConfirmation");
        that.controller.enqueueTriggeringContext($.extend({},ctxt,{success:function() {
            odkCommon.log('D',"prompts." + that.type + ".handleConfirmation", "px: " + that.promptIdx);
            that.getlinkedModel($.extend({},ctxt,{success:function(linkedModel) {
                database.delete_checkpoints_and_row($.extend({},ctxt,{success:function() {
                        that.enableButtons();
                        that.reRender(ctxt);
                    },
                    failure:function(m) {
                        that.enableButtons();
                        that.reRender($.extend({},ctxt,{success:function() {
                                ctxt.failure(m);
                            },
                            failure:function(m2) {
                                ctxt.failure(m2);
                            }}));
                    }}), linkedModel, instanceId);
            }}));
        }, failure: function(m) {
            odkCommon.log('D',"prompts." + that.type + ".handleConfirmation -- prior event terminated with an error -- aborting!", "px: " + that.promptIdx);
            that.enableButtons();
            ctxt.failure(m);
        }}));
        that._cachedEvent = null;
        return null;
    },
    addInstance: function(evt) {
        var that = this;
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);
        that.disableButtons();
        var platInfo = opendatakit.getPlatformInfo();

        var newInstanceElementKeyToValueMap = null;
        if ( queryDefn.newRowInitialElementKeyToValueMap ) {
            newInstanceElementKeyToValueMap = queryDefn.newRowInitialElementKeyToValueMap();
        }

        var dispatchStruct = {promptPath: that.getPromptPath(), userAction: 'launchSurvey'};

		var outcome = odkSurvey.addInstance(dispatchStruct,
			that.getLinkedTableId(),
			that.getLinkedFormId(),
			newInstanceElementKeyToValueMap);

        odkCommon.log('D','linked_table.addInstance - doAction: ' +  platInfo.container + " outcome is " + outcome);
        if (outcome === null || outcome !== "OK") {
            odkCommon.log('W',"linked_table.addInstance - doAction cancelled -- Should be OK got >" + outcome + "<");
            that.enableButtons();
        } else {
            odkCommon.log('W',"linked_table.addInstance - doAction in play -- awaiting responseAvailable");
        }
    }
        }),
		
		"linked_table4" : promptTypes._linked_type.extend({
			
			type: "linked_table4",
			templatePath: '../config/tables/eepicc_household/forms/eepicc_household_digaale/linked_table4.handlebars',
    valid: true,
    _cachedEvent: null,
	_protoDisplay: {
		new_button_label: 'linked_table_new_instance_label',
		},
    launchAction: 'org.opendatakit.survey.activities.MainMenuActivity',

    events: {
        "click .openInstance": "openInstance",
        "click .deleteInstance": "confirmDeleteInstance",
        "click .addInstance": "addInstance"
    },
    disableButtons: function() {
        var that = this;
        that.$('.openInstance').prop('disabled', true);
        that.$('.deleteInstance').prop('disabled', true);
        that.$('.addInstance').prop('disabled', true);
    },
    enableButtons: function() {
        var that = this;
        that.$('.openInstance').prop('disabled', false);
        that.$('.deleteInstance').prop('disabled', false);
        that.$('.addInstance').prop('disabled', false);
    },
    choice_filter: function(){ return true; },
    configureRenderContext: function(ctxt) {
        var that = this;
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);
        odkCommon.log('D',"prompts." + that.type + ".configureRenderContext", "px: " + that.promptIdx);
        that.renderContext.new_instance_text = ((that.display.new_instance_text !== null &&
                that.display.new_instance_text !== undefined) ? that.display.new_instance_text : "New");
        that.getlinkedModel($.extend({},ctxt,{success:function(linkedModel) {
            var dbTableName = linkedModel.table_id;
            var selString = that.convertSelection(linkedModel);
            var selArgs = queryDefn.selectionArgs();
            var ordBy = that.convertOrderBy(linkedModel);
            var displayElementName = that.getLinkedInstanceName();
            odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.before.get_linked_instances", "px: " + that.promptIdx);
			
			var database2 = database;
			database2.get_linked_instances2 = function(ctxt, dbTableName, selection, selectionArgs, displayElementName, orderBy) {
        var that = this;
        //
        // UserTable lt = DataIf.query( dbTableName, selection, selectionArgs, null, null, orderBy, "ASC", null, null, false, postprocessorcb
        //
        // And, on the postprocessorcb success callback:
        //
        // for ( var i = 0 ; i < result.rows.length ; i+=1 ) {
        //      var instance = result.rows.item(i);
        //      var ts = odkCommon.toDateFromOdkTimeStamp(instance._savepoint_timestamp);
        //      instanceList.push({
        //          display_field: (displayElementName === undefined || displayElementName === null) ? ((ts == null) ? "" : ts.toISOString()): instance[displayElementName],
        //          instance_id: instance._id,
        //          savepoint_timestamp: ts,
        //          savepoint_type: instance._savepoint_type,
        //          savepoint_creator: instance._savepoint_creator,
        //          locale: instance._locale,
        //          form_id: instance._form_id
        //      });
        //  }
        //  ctxt.log('D','get_linked_instances.inside', dbTableName + " instanceList: " + instanceList.length);
        //  ctxt.success(instanceList);
        if ( dbTableName === "framework" ) {
            ctxt.success([]);
            return;
        }

        var ss = that._selectMostRecentFromDataTableStmt(dbTableName, selection, selectionArgs, orderBy);
        odkData.arbitraryQuery(dbTableName, ss.stmt, ss.bind, null, null,
            function(reqData) {
                var instanceList = [];
                for (var rowCntr = 0; rowCntr < reqData.getCount(); rowCntr++) {
                    var ts = odkCommon.toDateFromOdkTimeStamp(reqData.getData(rowCntr, '_savepoint_timestamp'));
                    instanceList.push({
                        display_field: (displayElementName === undefined || displayElementName === null) ?
                                            ((ts === null) ? "" : ts.toISOString()): reqData.getData(rowCntr, displayElementName),
						age_years: reqData.getData(rowCntr, 'age_years'),
						household_id: reqData.getData(rowCntr, 'household_id'),
                        instance_id: reqData.getData(rowCntr, '_id'),
                        savepoint_timestamp: ts,
                        savepoint_type: reqData.getData(rowCntr, '_savepoint_type'),
                        savepoint_creator: reqData.getData(rowCntr, '_savepoint_creator'),
                        locale: reqData.getData(rowCntr, '_locale'),
                        form_id: reqData.getData(rowCntr, '_form_id'),
                        default_access: reqData.getData(rowCntr, '_default_access'),
                        row_owner: reqData.getData(rowCntr, '_row_owner'),
                        group_read_only: reqData.getData(rowCntr, '_group_read_only'),
                        group_modify: reqData.getData(rowCntr, '_group_modify'),
                        group_privileged: reqData.getData(rowCntr, '_group_privileged'),
                        effective_access: reqData.getData(rowCntr, '_effective_access')
                    });
                }
                ctxt.log('D','get_linked_instances.inside', dbTableName + " instanceList: " + instanceList.length);
                ctxt.success(instanceList);
            }, function(errorMsg) { 
                ctxt.failure({message: errorMsg}); 
            });
		}
			
            database2.get_linked_instances2($.extend({},ctxt,{success:function(instanceList) {
                odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.success.get_linked_instances", "px: " + that.promptIdx);
                var filteredInstanceList = _.filter(instanceList, function(instance) {
                    return that.choice_filter(instance);
                });
                
				//Make sure it is in the same order (except if age_years is changed in the script
				filteredInstanceList.sort((a,b) => a.age_years - b.age_years);
				instanceList = filteredInstanceList;
				
                // set the image icon
                for (var i = 0; i < instanceList.length ; i++){
                    // sets the savepoint_type to incomplete if the formId doesn't match the current form
                    if (instanceList[i].form_id != that.getLinkedFormId()) {
                        instanceList[i].savepoint_type = opendatakit.savepoint_type_incomplete;
                    }

                    if (instanceList[i].savepoint_type == "COMPLETE"){
                        instanceList[i].icon_class = "glyphicon-ok";
                    }
                    else{
                        instanceList[i].icon_class = "glyphicon-warning-sign";
                    }
                    //make the date more readable
                    instanceList[i].savepoint_timestamp = opendatakit.getShortDateFormat(instanceList[i].savepoint_timestamp);
                }

                that.renderContext.instances = instanceList;

                that.renderContext.columns = [
                    { title : "Last Saved"},
                    { title : "Name"},
                    { title : "Finalized"},
                    { title : ""}
                ];

				

                odkCommon.log('D',"prompts." + that.type + ".configureRenderContext.success.get_linked_instances.success", "px: " + that.promptIdx + " instanceList: " + instanceList.length);
                ctxt.success();
            }}), dbTableName, selString, selArgs, displayElementName, ordBy);
        }}));
    },
    openInstance: function(evt) {
        var instanceId;
        var openButton = $(evt.target).closest(".openInstance");

        if (openButton !== null && openButton !== undefined) {
            instanceId = openButton.attr("instance-id");
        }
        else {
            odkCommon.log('E',"In linked_table.openInstance instanceId is undefined");
            return;
        }

        var that = this;
		
        that.disableButtons();
        var platInfo = opendatakit.getPlatformInfo();
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);

        var openInstanceElementKeyToValueMap = null;
        if ( queryDefn.openRowInitialElementKeyToValueMap ) {
            openInstanceElementKeyToValueMap = queryDefn.openRowInitialElementKeyToValueMap();
        }

        var dispatchStruct = {promptPath: that.getPromptPath(), userAction: 'launchSurvey'};

		var outcome = odkSurvey.openInstance(dispatchStruct,
			that.getLinkedTableId(),
			that.getLinkedFormId(),
			instanceId, openInstanceElementKeyToValueMap);

        odkCommon.log('D','linked_table.openInstance - doAction: ' +  platInfo.container + " outcome is " + outcome);
        if (outcome === null || outcome !== "OK") {
            odkCommon.log('W',"linked_table.openInstance - doAction cancelled -- Should be OK got >" + outcome + "<");
            that.enableButtons();
        } else {
            odkCommon.log('W',"linked_table.openInstance - doAction in play -- awaiting responseAvailable");
        }
    },
    confirmDeleteInstance: function(evt) {
        var that = this;
        var instanceId;
        var instanceName;
        var deleteButton = $(evt.target).closest(".deleteInstance");

        if (deleteButton !== null && deleteButton !== undefined) {
            instanceId  = deleteButton.attr("instance-id");
            instanceName = deleteButton.attr("instance-name");
        }
        else {
            odkCommon.log('E',"In linked_table.confirmDeleteInstance instanceId is undefined");
            return;
        }

        that._cachedEvent = evt;
        that._screen._screenManager.showConfirmationPopup({message: {text: "Delete " + instanceName + "?"},
                                                           promptIndex:that.promptIdx});
    },
    handleConfirmation: function() {
        var that = this;

        if (that._cachedEvent === null || that._cachedEvent === undefined ) {
            odkCommon.log('E',"In linked_table.handleConfirmation _cachedEvent is null");
            return ({message:"In linked_table.deleteInstance _cachedEvent is null"});
        }
        var instanceId;
        var deleteButton = $(that._cachedEvent.target).closest(".deleteInstance");

        if (deleteButton !== null && deleteButton !== undefined) {
            instanceId  = deleteButton.attr("instance-id");
        }
        else {
            odkCommon.log('W',"In linked_table.handleConfirmation instanceId is undefined");
            return null;
        }

        // TODO: should this be done here? Seems like it should wait for a reRender
        // var tableRow = $(that._cachedEvent.target).closest(".linkedTable tr");
        // if (tableRow !== null && tableRow !== undefined) {
        //     tableRow.remove();
        // }
        that.disableButtons();

        var ctxt = that.controller.newContext(that._cachedEvent, that.type + ".handleConfirmation");
        that.controller.enqueueTriggeringContext($.extend({},ctxt,{success:function() {
            odkCommon.log('D',"prompts." + that.type + ".handleConfirmation", "px: " + that.promptIdx);
            that.getlinkedModel($.extend({},ctxt,{success:function(linkedModel) {
                database.delete_checkpoints_and_row($.extend({},ctxt,{success:function() {
                        that.enableButtons();
                        that.reRender(ctxt);
                    },
                    failure:function(m) {
                        that.enableButtons();
                        that.reRender($.extend({},ctxt,{success:function() {
                                ctxt.failure(m);
                            },
                            failure:function(m2) {
                                ctxt.failure(m2);
                            }}));
                    }}), linkedModel, instanceId);
            }}));
        }, failure: function(m) {
            odkCommon.log('D',"prompts." + that.type + ".handleConfirmation -- prior event terminated with an error -- aborting!", "px: " + that.promptIdx);
            that.enableButtons();
            ctxt.failure(m);
        }}));
        that._cachedEvent = null;
        return null;
    },
    addInstance: function(evt) {
        var that = this;
        var queryDefn = opendatakit.getQueriesDefinition(this.values_list);
        that.disableButtons();
        var platInfo = opendatakit.getPlatformInfo();

        var newInstanceElementKeyToValueMap = null;
        if ( queryDefn.newRowInitialElementKeyToValueMap ) {
            newInstanceElementKeyToValueMap = queryDefn.newRowInitialElementKeyToValueMap();
        }

        var dispatchStruct = {promptPath: that.getPromptPath(), userAction: 'launchSurvey'};

		var outcome = odkSurvey.addInstance(dispatchStruct,
			that.getLinkedTableId(),
			that.getLinkedFormId(),
			newInstanceElementKeyToValueMap);

        odkCommon.log('D','linked_table.addInstance - doAction: ' +  platInfo.container + " outcome is " + outcome);
        if (outcome === null || outcome !== "OK") {
            odkCommon.log('W',"linked_table.addInstance - doAction cancelled -- Should be OK got >" + outcome + "<");
            that.enableButtons();
        } else {
            odkCommon.log('W',"linked_table.addInstance - doAction in play -- awaiting responseAvailable");
        }
    }
        })
    };
    
});