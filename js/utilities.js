// array maintained to keep track of selcted objects

var Utilities = (function() {
  RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|\s]/g, '\\$&');
  };

  function makeSelector(text) {
    return '#' + RegExp.escape(text);
  }

  function hideLoader() {
    jQuery('#loader').css('display', 'none');
    var d = new Date();
    var n = d.toLocaleTimeString();
    console.log(n);
  }

  function showLoader() {
    jQuery('#loader').css('display', 'block');
    console.log('hey heye hey heye ');
    var d = new Date();
    var n = d.toLocaleTimeString();
    console.log(d);
  }

  /**
  * fetch DOM objets from given id
  * @param {string: id of node or input-box(un-escaped or raw is acceptable )} id
  * @param {string: type of id (inputBox or node)} idType
  * @return {HTML DOM Object of id passes} ele
  */
  function fetchNodes(id, idType) {
    if(idType === undefined) {
      idType = 'node';
    }

    if(idType === 'node') {
      var selector = makeSelector(id);
      ele = cy.nodes(selector);
      return ele;
    } else  if(idType === 'inputBox') {
      var id = $('#' + id).val();
      var selector = makeSelector(id);
      ele = cy.nodes(selector);
      return ele;
    }
  }

  function fetchNodesWithLeaves(id, idType) {

    if(idType === undefined) {
      idType = 'node';
    }

    if(idType === 'node') {    
      var ele = fetchNodes(id, 'node');
      var neighbors = ele.neighborhood();
      // stack of deleted elements
      var arr = [];
      arr.push(ele);
      neighbors.forEach(function(ele) {
        if(ele.connectedEdges().length == 1) arr.push(ele);
      });
      return arr;
    } else if(idType === 'inputBox') {
      var ele = fetchNodes(id, 'inputBox');
      var neighbors = ele.neighborhood();
      // stack of deleted elements
      var arr = [];
      arr.push(ele);
      neighbors.forEach(function(ele) {
        if(ele.connectedEdges().length == 1) arr.push(ele);
      });
      return arr;
    }
  }


  function fetchEnds(nodeId, idType) {

    if(idType === undefined) {
      idType = 'node';
    }

    var ele = fetchNodes(nodeId);
    var neighbors = ele.neighborhood();
    // stack of deleted elements
    var arr = [];
    neighbors.forEach(function(ele) {
      if(ele.connectedEdges().length == 1) arr.push(ele);
    });
    return arr;
  }

  function BFSSelect(nodeId) {
    var x = 0;
    var bfs = cy.elements().bfs({
      roots: '#' + RegExp.escape(nodeId),
      visit: function(i, depth, v, e, u){
        
        if(x>0)
        e.addClass('highlighted-edges');
        
        this.addClass('selected');
        ++x;
      },
      directed: true,
    });

    var path = bfs.path; // path to found node
    var found = bfs.found; // found node
  }

  function BFSColorRegulated(nodeId) {
    var x = 0;
    var bfs = cy.elements().bfs({
      roots: '#' + RegExp.escape(nodeId),
      visit: function(i, depth, v, e, u){
        
        this.addClass('regulated');
        ++x;
      },
      directed: true,
    });

    var path = bfs.path; // path to found node
    var found = bfs.found; // found node
  }

  return {
    BFSSelect: BFSSelect,
    BFSColorRegulated: BFSColorRegulated,
    escapeString: RegExp.escape,
    makeSelector: makeSelector,
    fetchNodes: fetchNodes,
    fetchNodesWithLeaves: fetchNodesWithLeaves,
    fetchEnds: fetchEnds,
    showLoader: showLoader,
    hideLoader: hideLoader
  }

})();



