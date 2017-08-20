
a = 2;
ScoreKeeper = (function() {
  // # Purturbation Score Handlers

  var __init__ = (function() {
    // betweenness centrality instance
    var bc = cy.$().bc();

    // all nodes in the graph
    var nds = cy.nodes(); 

    var sum = 0;

    nds.forEach(function(ele) {
      sum = sum + bc.betweennessNormalized(ele);
    });

    nds.forEach(function(ele) {
      // normalised node betweenness centrality
      var nbc = bc.betweennessNormalized(ele)/sum*100;
      obj[ele.id()] = nbc;
    });
  })();

  var _totalEdges = cy.edges().length;
  var $perturb = $('#perturb');

  function render() {
    updateScore(calculateScore()); 
  }

  function updateScore(score) {
    $perturb.text(score);
  }

  function calculateScore() {

    var sum = 0;
    $.each(obj, function(key, value) {
      sum += value;
    }); 
    sum = sum.toFixed(2);
    return sum;
  }

  return {
    updateScore: updateScore,
    calculateScore: calculateScore,
    render: render,
  } 
})();
