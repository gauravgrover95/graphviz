var TapHandler = (function() {

	// PRIVATE VARIABLES
	// array of unescaped strings of Node IDs
	var nodeSelection = [];
	var edgeSelection = [];

	// CACHE DOM

	// BIND EVENTS
	// node tap
	cy.nodes().on('tap', function(e) {
		
		console.log("some node is clicked");

		// fetching nodeID
		var nodeId = e.cyTarget.id();
		
		// fetching node Object
		var node = e;
		// check Tracer.status
		if(Tracer.getStatus()) {
			Tracer.select(nodeId);
		} else if(Connector.getStatus()) {
			Connector.select(nodeId)
		}
		else {
			// TODO
			// simpleSelect();
		}
	});

	// space tap
	cy.on('tap', function(e) {
		if(e.cyTarget === cy) {
			// showLoader();

			// Tracer.destroy();
			// Connector.destroy();




		    Tracer.idealSelection = [];
		    TapHandler.setNodeSelection([]);

		    TapHandler.setNodeSelection([]);
		    Connector.click = 0;
		    

		    cy.startBatch();
			    cy.batch(function(){
					cy.nodes().removeClass('tracer-ideal-selection')
				    		  .addClass('plain-node')
				    		  .addClass('plain-node')
				    		  .removeClass('selected')
				    		  .removeClass('connector-middle-node-selection')
				    		  .removeClass('connector-node-selection');
				});
		    cy.endBatch();

		    cy.startBatch();
		    cy.batch(function(){

			    cy.edges().removeClass('connector-edge-selection')
			    		  .removeClass('highlighted-edges')
			    		  .removeClass('traced-edges');

			});
		    cy.endBatch();
			// setTimeout(function(){ hideLoader(); }, 3000);

		}
	})

	// PUBLIC FUNCTIONS

	function getLastSelectedNodeId() {
		var size = nodeSelection.length;
		return nodeSelection[size - 2];
	}

	// PRIVATE FUNCTIONS

	function getNodeSelection() {
		return nodeSelection;
	}

	function getNodeSelectionByIndex(index) {
		return nodeSelection[index];
	}

	/**
	* @param {array of strings: array of unescaped nodeIds} arr
	*/
	function setNodeSelection(arr) {	
		nodeSelection = arr;
	}

	/**
	* @param {string: unescaped node id} nodeId
	*/
	function appendNodeSelection(nodeId) {
		nodeSelection.push(nodeId);
	}

	function detector(nodeId) {
		// #### First Node Selected
    if(nodeSelection.length === 0) {
    	return 1000;

    // #### Second or any next node is being selected
    } else if(nodeSelection.length > 0) {

      // ### node was already selected previously
      if(nodeSelection.indexOf(nodeId) != -1) {

        // ## we have clicked the same node that was just selected
        if(nodeId === nodeSelection[nodeSelection.length-1]) {

          // # double click on first node
          if(nodeSelection.length === 1) {
          	return 2000;

          // # double clicking on second node or other than first
          } else if(nodeSelection.length > 1){
          	return 2001;

          }

        // ## we have clicked the node that was previously selected in accordance with tracer mechanism
        } else {
          return 2010;
        }

      // ### new node selection
      } else {
        // ## new node selection in accordance with tracer mechanism
        if(Tracer.getIdealSelection().indexOf(nodeId) >= 0) {
          return 2100;

        }
        // ## new node selection NOT in accordance with tracer mechanism
        else {
        	return 2200;
			// alert the user about the data loss
			// var ans = window.confirm('Do you really want to do this?');
			// if(ans == true) return 2110;
			// else return 2111;
        }
      }
    }
	}

	return {
		detector: detector,
		getNodeSelection: getNodeSelection,
		getNodeSelectionByIndex: getNodeSelectionByIndex,
		getLastSelectedNodeId: getLastSelectedNodeId,
		setNodeSelection: setNodeSelection,
		appendNodeSelection: appendNodeSelection,

	}

})();