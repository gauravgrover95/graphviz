//**************************************************************************
// General Settigs

cy.panningEnabled(true);

cy.boxSelectionEnabled(true);

cy.autounselectify(true);

var ur = cy.undoRedo();




// /**
// * Script to increase the size of every node in the graph proportional to the number of edges
// */
// var f = 25; // factor by which size should increase proportionally
// cy.elements('node').forEach(function(ele) {
//   // n is the number of edges connected to the current node
//   var n = ele.neighbourhood('edge').length;
//   n = Math.cbrt(n);
//   var c = n*20;
//   ele.css({
//     'height': n*f,
//     'width': n*f, 
//   });
// });



/**
* Program to show and hide labels of the nodes
*/
// cy.on('zoom', function() {
//   if(cy.zoom() < 0.36) {
//     cy.elements('node').addClass('hide-labels');
//     cy.elements('.selected').removeClass('hide-labels');
//     cy.elements('.connector-middle-node-selection').removeClass('hide-labels');
//   } else {
//     cy.elements('node').removeClass('hide-labels');
//   }
// });


var defaults = {
    container: ".cytoscape-navigator" // can be a HTML or jQuery element or jQuery selector
  , viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
  , thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
  , thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
  , dblClickDelay: 200 // milliseconds
  , removeCustomContainer: false // destroy the container specified by user on plugin destroy
  , rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
};

var nav = cy.navigator( defaults ); // get navigator instance, nav

// initialising panzoom plugin
cy.panzoom({});

// setting minimum and maximum zoom
cy.minZoom(0.07);
cy.maxZoom(5.0);

// var layout_options = {
//   name: 'cose',

//   // Called on `layoutready`
//   ready: function(){},

//   // Called on `layoutstop`
//   stop: function(){},

//   // Whether to animate while running the layout
//   animate: true,

//   // The layout animates only after this many milliseconds
//   // (prevents flashing on fast runs)
//   animationThreshold: 250,

//   // Number of iterations between consecutive screen positions update
//   // (0 -> only updated on the end)
//   refresh: 20,

//   // Whether to fit the network view after when done
//   fit: true,

//   // Padding on fit
//   padding: 30,

//   // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//   boundingBox: undefined,

//   // Randomize the initial positions of the nodes (true) or use existing positions (false)
//   randomize: false,

//   // Extra spacing between components in non-compound graphs
//   componentSpacing: 100,

//   // Node repulsion (non overlapping) multiplier
//   nodeRepulsion: function( node ){ return 400000; },

//   // Node repulsion (overlapping) multiplier
//   nodeOverlap: 10,

//   // Ideal edge (non nested) length
//   idealEdgeLength: function( edge ){ return 10; },

//   // Divisor to compute edge forces
//   edgeElasticity: function( edge ){ return 100; },

//   // Nesting factor (multiplier) to compute ideal edge length for nested edges
//   nestingFactor: 5,

//   // Gravity force (constant)
//   gravity: 80,

//   // Maximum number of iterations to perform
//   numIter: 1000,

//   // Initial temperature (maximum node displacement)
//   initialTemp: 200,

//   // Cooling factor (how the temperature is reduced between consecutive iterations
//   coolingFactor: 0.95,

//   // Lower temperature threshold (below this point the layout will end)
//   minTemp: 1.0,

//   // Whether to use threading to speed up the layout
//   useMultitasking: true
// };

// var layout = cy.layout( layout_options );



// jQuery UI Inits
$( "#delete-input" ).autocomplete({
  source: availableTags
});

$("#search-input").autocomplete({
  source: availableTags
});

$("#delete-unit-input").autocomplete({
  source: availableTags
});

$("#hide-ends-input").autocomplete({
  source: availableTags
});

$( "#accordion" ).accordion();


// cy.on('mouseover', 'node', function(evt){
//   var node = evt.cyTarget;
//   node.addClass('hover-select');
//   var name = evt.cyTarget.id();
//   console.log(name);
// });

// cy.on('mouseout', 'node', function(evt){
//   var node = evt.cyTarget;
//   node.removeClass('hover-select');
//   var name = evt.cyTarget.id();
//   console.log(name);
// });



// Vex DefaultOptions
vex.defaultOptions.className = 'vex-theme-os';



