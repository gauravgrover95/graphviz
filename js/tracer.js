//**************************************************************************
// Tracer Functionality is written below
// This file just provide the helper functions to the actual events like buttonClick or cy.Tap
/*
* 2 types of edge selection: highlighting(.highlighted-edges) and tracing(.traced-edges)
* 
**/

var Tracer = (function() {

  // PRIVATE VARIABLES
  var status = false;
  var idealSelection = [];

  // CACHING
  var $checkbox = $('#tracer-button');
  var $tracerMenu = $("#tracer-menu .links");
  var $tracerButtonTemplate = $('#tracer-button-template').html();

  // BINDING EVENTS
  // $checkbox.on('change', function() {
  //   setStatus(($(this).prop('checked'))?true:false);
  // });


  /**
  *
  * tracer selection
  * @param {string: id of node} id
  */
  function select(nodeId) {
    var detectorResponse = TapHandler.detector(nodeId);
    switch(detectorResponse) {
    case 1000:
        // alert('This is the First Node');
        firstHighlight(nodeId);
        break;
    case 2000:
        // alert('Greater than one click on nodes -> This node was already selected previously -> We clicked the same thing we just clicked -> double click on first node');
        universalPreviousClick();  
        break;
    case 2001:
        // alert('Greater than one click on nodes -> This node was already selected previously -> We clicked the same thing we just clicked -> double click on node other than the first');
        universalPreviousClick();
        break;
    case 2010:
        // alert('Greater than one click on nodes ->  This node was already selected previously -> previously selected with tracer mech');
        universalPreviousClick();
        break;
    case 2100:
        // alert('Greater than one click on nodes -> new node selection -> new node with tracer mechanism');
        nextHighlight(nodeId);
        break;
    case 2110:
        // alert('user allowed');
        break;
    case 2111:
        // alert('user didn\'t allow it');
        break;
    case 2200:
        alert('Sorry! This node selection is not according to tracer ideal selection!');
        break;
        

    default:
        alert('I am not sure. What to do.');
    }
  }

  function universalPreviousClick() {
    window.alert('This node has been selected previously!\n' +
    'If you wish to start a new tracer session. You can always click on white space and start from scratch!');
  }



  /**
  * # ideal highlight of tracer
  * @param {string: unescaped nodeID} node
  */
  function firstHighlight(nodeId) {
    TapHandler.appendNodeSelection(nodeId);
    baseSelect(nodeId);
  }


  /**
  * 
  */
  function baseSelect(nodeId) {
    // convert node string to object
    var node = Utilities.fetchNodes(nodeId);
    // nb = neighborhood
    var nbNodes = node.neighborhood().filter('node');
    var nbEdges = node.neighborhood().filter('edge')


    // # highlighting the clicked node nbNodes and nbEdges of current node
    // simple select the clicked node
    node.addClass('selected');
    // highlighting its neighborhood edges
    nbEdges.addClass('highlighted-edges');
    // highlighting neighborhood nodes
    nbNodes.addClass('tracer-ideal-selection');

    // removing ideal-selection from last nodes because it is not
    if( TapHandler.getNodeSelection().length > 1 )
    Utilities.fetchNodes(TapHandler.getLastSelectedNodeId()).removeClass('tracer-ideal-selection'); 

    // # refilling Ideal Selection array
    idealSelection = [];
    Utilities.fetchNodes(nodeId).neighborhood('node').forEach(function(ele) {     
      idealSelection.push(ele.id());
    });
  } 

  function nextHighlight(nodeId) {

    // saving clicked node in TapHandler's nodeSelection
    TapHandler.appendNodeSelection(nodeId);

    // # unhighlighting any edge that was previously highlighted
    cy.edges('.highlighted-edges').removeClass('highlighted-edges');
    cy.nodes('.tracer-ideal-selection').removeClass('tracer-ideal-selection');

    var nbEdges = Utilities.fetchNodes(nodeId)
                           .neighborhood('edge');

    // # highlight the last edge to be traced

    nbEdges.forEach(function(edge) {
      // if node id == lastNodeId.currentNodeId || currentNodeId.lastNodeID
      if(edge.id() == nodeId + "." + TapHandler.getLastSelectedNodeId() ||
       edge.id() == TapHandler.getLastSelectedNodeId() + "." + nodeId) 
      {
        edge.addClass('traced-edges');
      }
    });

    baseSelect(nodeId);

  }




  function destroy() {
    cy.nodes().removeClass('tracer-ideal-selection');
    Tracer.idealSelection = [];
    TapHandler.setNodeSelection([]);
    $tracerMenu.html('');
    cy.nodes().removeClass('selected');
    cy.edges().removeClass('highlighted-edges');
    cy.edges().removeClass('traced-edges');
    cy.nodes().addClass('plain-node');
  }

  function getIdealSelection() {
    return idealSelection;
  }

  /**
  * @param {array of strings: array of unescaped nodeIds} arr
  */
  function setIdealSelection(arr) {
    idealSelection = arr;
  }

  function appendIdealSelection(nodeId) { 
    idealSelection.push(nodeId);
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

  function clearMenu() {$tracerMenu.html("");}

  function ButtonClickHandler(ele) {
    var node = Utilities.fetchNodes(ele.id, 'node');
    clearTracerMenu();
    tracerSelect(node);
  }

  return {
    getStatus: getStatus,
    setStatus: setStatus,
    getIdealSelection: getIdealSelection,
    setIdealSelection: setIdealSelection,
    select: select,
    destroy: destroy,
  }
})();