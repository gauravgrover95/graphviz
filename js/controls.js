//**************************************************************************
// Controls are below


var Controller = (function() {

  // user variables
  var _totalEdges = cy.edges().length;


  // cache DOM
  $searchButton = $('#search-button');
  $searchInput = $('#search-input');


  $deleteInput = $('#delete-input');
  $deleteButton = $('#delete-button');

  $deleteUnitInput = $('#delete-unit-input');
  $deleteUnitButton = $('#delete-unit-button');

  $hideEndsInput = $('#hide-ends-input');
  $hideEndsButton = $('#hide-ends-button');

  $undoButton = $('#undo-button');
  $redoButton = $('#redo-button');
  $undoAllButton = $('#undo-all-button');
  $redoAllButton = $('#redo-all-button');

  $centerButton = $('#center-button');

  $saveImageButton = $('#save-image-button');



  // Bind Events  
  $searchButton.on('click', function() {
    try {
      var id = $searchInput.val();
      if(!id) throw new Error('Input field is empty', 'controls.js', '41');
      search(id);
    } catch(e) {
      alert(e.message);
    }
  });
  $deleteButton.on('click', function() {
    try {
      var id = $deleteInput.val();
      if(!id) throw new Error('Input field is empty', 'controls.js', '41');
      deleteNode(id);
      ScoreKeeper.render();
    } catch(e) {
      alert(e.message);
    }
  });
  $deleteUnitButton.on('click', function() {
    try {
      var id = $deleteUnitInput.val();
      if(!id) throw new Error('Input field is empty', 'controls.js', '41');
      deleteNodeWithLeaves(id);
      ScoreKeeper.render();
    } catch(e) {
      alert(e.message);
    }
  });
  $hideEndsButton.on('click', function() {
    try {
      var id = $hideEndsInput.val();
      if(!id) throw new Error('Input field is empty', 'controls.js', '41');
      hideEnds(id);
      ScoreKeeper.render();
    } catch(e) {
      alert(e.message);
    }
  });
  $undoButton.on('click', undo);
  $redoButton.on('click', redo);
  $undoAllButton.on('click', undoAll);
  $redoAllButton.on('click', redoAll);
  $centerButton.on('click', center);
  $saveImageButton.on('click', saveImage);

  // ### PUBLIC FUNCTIONS

  function search(id) {
    // creating selector from id
    var selector = Utilities.makeSelector(id);
    
    //highlight searched node
    cy.nodes(selector).addClass('selected');;
      
    // pan to searched object
    cy.animate({
      fit: { 
        eles: selector,
        padding: 320
      }
    }, { duration: 700 });

  // clear value in search-box if any 
  $searchInput.val('');
  }


  // center
  function center() {
    cy.zoom(1);
    cy.fit();
  }   

  // Create and open image of canvas in new tab
  function saveImage() {
    var png64 = cy.png();
    window.open(png64,'_blank');
  }


  // undo
  function undo() {
      ur.undo();
      ScoreKeeper.render();
  }

  // redo 
  function redo() {
      ur.redo();
      ScoreKeeper.render();
  }

  // undo every action
  function undoAll() {
      while(!ur.isUndoStackEmpty()) {
          ur.undo();
      }
      ScoreKeeper.render();
  }

  // redo every action
  function redoAll() {
      while(!ur.isRedoStackEmpty()) {
          ur.redo();
      }
      ScoreKeeper.render();
  }

  // delete
  function deleteNode(id) {
    var ele = Utilities.fetchNodes(id, 'node');
    ur.do('deleteEle', ele);
    $deleteInput.val('');
    ScoreKeeper.render();
  }

  function deleteNodeWithLeaves(id) {
    var eles = Utilities.fetchNodesWithLeaves(id, 'node');
    ur.do('deleteEles', eles);
    $deleteUnitInput.val('');
    ScoreKeeper.render();
  }


  function hideEnds(id) {
    var eles = Utilities.fetchEnds(id);
    ur.do('deleteEles', eles);
    $hideEndsInput.val('');
  }




  // ### PRIVATE FUNCTIONS

  // # Purturbation Score Handlers
  function updateScore(score) {
      var id = "#perturb";
      var lastScore = $(id).text();
      $(id).text(score);
      return lastScore;
  }

  function calculateScore() {
      var edgesLeft = cy.edges().length;
      var perc = edgesLeft/_totalEdges*100;
      perc = perc.toFixed(2);
      return perc;
  }

  // ## Undo-Redo Rgistrations

  // # Delete Node registration

  // deleteNode do & redo
  function deleteEle(ele){

     var id = ele.id();
     stack.push([ id, obj[id] ]);
     delete obj[id];
     var a = ele.remove();
     ScoreKeeper.render();
     return a;
  }

  // deleteNode undo
  function restoreEle(ele){
    var arr = stack.pop();
    obj[arr[0]] = arr[1];
    var a = ele.restore();
    ScoreKeeper.render();
    return a;
  }

  // registering a redo-undo pair for deleting elements
  ur.action("deleteEle", deleteEle, restoreEle);

  // # Delete Nodes With Leaves registration

  // deleteNodeWithLeaves
  function deleteEles(eles) {
    var arr = [];
    for (var i = eles.length - 1; i >= 0; i--) {
      var id = eles[i].id();
      stack.push([ id, obj[id] ]);
      delete obj[id];
      arr.push(eles[i].remove());
    }


    ScoreKeeper.render();
    return arr;
  }

  function restoreEles(eles) {
    var arr = [];
    for (var i = eles.length - 1; i >= 0; i--) {
      var arr = stack.pop();
      obj[arr[0]] = arr[1];
      arr.push(eles[i].restore());
    }
    ScoreKeeper.render();
    return arr;
  }

  // register delete with 
  ur.action("deleteEles", deleteEles, restoreEles);



  // PUBLIC APIs
  return {
    search: search,
    center: center,
    undo: undo,
    redo: redo,
    undoAll: undoAll,
    redoAll: redoAll,
    deleteNode: deleteNode,
    deleteNodeWithLeaves: deleteNodeWithLeaves,
    saveImage: saveImage,
    hideEnds: hideEnds,
  };

})();
