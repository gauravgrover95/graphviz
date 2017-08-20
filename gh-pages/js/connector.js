///////////////////////////////   Connector   /////////////////////////////////

// * makeSelector should be used from appropriate module


// var src = cy.$('#Rv2703\\(SigA\\)');
// var tar = cy.$('#Rv3286c\\(SigF\\)');

//1. while turning on connector, if tracer is on, then ask user to turn off tracer.
//- else Turn on the Connector 
//2. take inputs from tapHandler.
//3. If the number of inputs are 2 then execute the function below.
//4. If more nodes are clicked then alert user that it will clear the previous selection. ask user to

/* Some important things to be taken care of */
//- if the connector switch is closed then we have to *reset* the mechanism
//- 



// if(Tracer.status) {
// 	// ask user to turn off tracer.
// 	alert("Please Turn off Tracer first");
// } else {
// 	// 1. take inputs from tapHandler.
//     // 2. If the number of inputs are 2 then execute the function below.
//     // 3. If more nodes are clicked then alert user that it will clear the previous selection. ask user to
// }



var Connector = (function() {
	// PRIVATE VARIABLES
	var status = false;
	var click = 0;
	// CACHING
	var $checkbox = $('#connector-button');


	// BINDING EVENTS
	// $checkbox.on('change', function() {
	// 	setStatus(($(this).prop('checked'))?true:false);
	// });
	// CLASS METHODS

	/**
	*
	* tracer selection
	* @param {string: id of node} id
	*/
	function select(nodeId) {
	  var detectorResponse = TapHandler.detector(nodeId);
	  // conditions I require are 1000, 2000, 2100 and 2200;
	  switch(detectorResponse) {
	  	// first node selection
	  case 1000:
				firstHighlight(nodeId);
	      break;
	      // double click on first node
	  case 2000:
	  		universalPreviousClick();
	      break;

	      // new node selection in accordance with tracer mechanism
	  case 2100:
	  		nextHighlight(nodeId);
	      break;

	      // new node selection NOT in accordance with tracer mechanism
	  case 2200:
				nextHighlight(nodeId);
	  		break;
	      
	  default:
	      alert('I am not sure. What to do. :( Please report to maintainance of website');
	  }
	}

	function getStatus() {
		return status;
	}

	function setStatus(val) {
    try {
      if(typeof(val) !== 'boolean') throw new Error('setStatus() only accepts boolean value');
      status = val;
      // $checkbox.prop('checked', (getStatus())?true:false);
      return 'success';
    } catch(e) {
      alert(e.message);
    }
  }

  function firstHighlight(nodeId) {
    TapHandler.appendNodeSelection(nodeId);
    baseSelect(nodeId);
    click++;
  }

  function universalPreviousClick() {
    window.alert('This node has been selected previously!\n' +
    'If you wish to start a new tracer session. You can always click on white space and start from scratch!');
  }

  function nextHighlight(nodeId) {
  	if(click >= 2) {
  		click = 0;
  		Connector.destroy();
  		firstHighlight(nodeId);
  		return;
  	}
  	// TapHandler.appendNodeSelection(nodeId);
  	// highlight it
  	
  	// highlight the path against it
  	var nodeSelectionArray = TapHandler.getNodeSelection();
  	var src    = nodeSelectionArray[0];
  	// var target = nodeSelectionArray[1];
  	var target = nodeId;
  	try {
  		
	  	// function a(_callback, x, y) {
	  	// 	console.log('please wait...');
		  // 	console.log('Calling show loader..');
		  // 	Utilities.showLoader(); 
	  	// 	_callback(x, y);
	  	// }

		  // 	// function b(_callback) {
		  // 	// 	_callback();
		  // 	// }

		  // 	a(highlightPath, src, target);

		 //  	var isPaused = false;

			// function firstFunction(){
			//     isPaused = true;
			//     // show loader
			//     jQuery('#loader').css('display', 'block');

			//     isPaused = false;
			// };

			// function secondFunction(){
			//     firstFunction()

			//     alert("Here");

			//     function waitForIt(){
			//         if (isPaused) {
			//             setTimeout(function(){waitForIt()},100);
			//         } else {
			//             // highlight nodes
			// 		    highlightPath(src, target);
			//         };
			//     }
			// };

			showLoader();
		    highlightPath(src, target);
		    setTimeout(function() {
		    	hideLoader();
		    }, 10000);

	  	
  	} catch(err) {
  		// will not proceed further if not path is found
  		vex.dialog.alert('No Path found')
  		return;
  	}
  	
  	click++;	
  }

  function baseSelect(nodeId) {
	    // highlight it
        // convert node string to object
	    var node = Utilities.fetchNodes(nodeId);
	    // simple select the clicked node
	    node.addClass('selected');
	    node.removeClass('hide-labels')
  }

  function highlightPath(id1, id2) {

  	console.log('highlighPath running')
  	var src    = Utilities.fetchNodes(id1);
  	var tar    = Utilities.fetchNodes(id2);

		var bfs = cy.elements().bfs({
		  roots: makeSelector(src.id()),
		  directed: true,
		  visit: function(i, depth, v, e, u){},
		});

		// console.log(bfs.path.edges());
		// flag/counter variable to detect if there is some path found or not
		var x = 0;
		bfs.path.nodes().forEach(function(e){
		    var bf = cy.elements().bellmanFord({ root: makeSelector(e.id()), directed: true });

			var path = bf.pathTo(makeSelector(tar.id())).select();

			// if path exists from sub-node
			if(path.length != 0) {	
				// highlight the path from this node to target node
				path.nodes().forEach(function(e) {
					if(!e.hasClass('selected'))
						e.removeClass('hide-labels');
						e.addClass('connector-middle-node-selection');
				});
					
				path.edges().forEach(function(ele) {
				  ele.addClass('connector-edge-selection');
				});  

				// Also highlight path from src to this node
				var bf2 = cy.elements().bellmanFord({ root: makeSelector(src.id()), directed: true })

				var path2 = bf2.pathTo(makeSelector(e.id())).select();

				// console.log('PathTo: ' + e.id());
				// console.log(path2);
				path2.edges().forEach(function(ele) {
				  ele.addClass('connector-edge-selection');
				});
				x++;
			}
		});
	  	// $('#view1').html('process completed...');
		// console.log('process complete');
		// Utilities.hideLoader();
		// no path is found
		if(x == 0) {
			throw "no path found";
		} else {
			src.removeClass('connector-middle-node-selection');
			tar.removeClass('connector-middle-node-selection');
			// I forgot why I did this
			// tar.addClass('hide-labels');
			baseSelect(id2);
			baseSelect(id1);
		}
  }

  function destroy() {
  	cy.nodes().removeClass('selected');
    cy.nodes().removeClass('connector-middle-node-selection');
    cy.nodes().removeClass('connector-node-selection');
    cy.edges().removeClass('connector-edge-selection');
    TapHandler.setNodeSelection([]);
    click = 0;
  	cy.nodes().addClass('plain-node');
  }

  function makeSelector(text) {
		return '#' + RegExp.escape(text);
	}

	// RETURN PUBLIC VARIABLES
	return {
		select: select,
		getStatus: getStatus,
		setStatus: setStatus,
		destroy: destroy,
		click: click
	}
})()







