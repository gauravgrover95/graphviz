
var context_menus_options = {
    // List of initial menu items
    menuItems: [
      // {
      //   id: 'remove', // ID of menu item
      //   title: 'remove', // Title of menu item
      //   // Filters the elements to have this menu item on cxttap
      //   // If the selector is not truthy no elements will have this menu item on cxttap
      //   selector: 'node, edge', 
      //   onClickFunction: function(event) {
      //     console.log(event.cyTarget.id());
      //     ur.do("deleteEle", event.cyTarget);  
      //   },
      //   disabled: false, // Whether the item will be created as disabled
      //   hasTrailingDivider: false, // Whether the item will have a trailing divider
      //   coreAsWell: false // Whether core instance have this item on cxttap
      // },
      {
        id: 'remove',
        title: 'remove',
        selector: 'node, edge',
        onClickFunction: function(event) {
            // console.log(event.cyTarget);

            var ele = event.cyTarget;
            var eles = ele.neighborhood();
            var arr = []; // array maintained to restore the information corresponding to the node deleted
            arr.push(ele);
            eles.forEach(function(ele) {
              if(ele.connectedEdges().length == 1) arr.push(ele);
            });
            ur.do("deleteEles", arr);
        },
        disabled: false,
        hasTrailingDivider: false,
        coreAsWell: false
      },
      {
        id: 'BFS-Select',
        title: 'regulated genes',
        selector: 'node',
        coreAsWell: false,
        onClickFunction: function(event) {
          var ele = event.cyTarget;
          var nodeId = ele.id();
          Utilities.BFSSelect(nodeId);
        },
        disabled: false,
      },
      {
        id: 'undo',
        title: 'undo',
        onClickFunction: function() {
          ur.undo();
        },
        coreAsWell: true,
      },
      {
        id: 'redo',
        title: 'redo',
        onClickFunction: function() {
          ur.redo();
        },
        coreAsWell: true,
      },
      {
        id: 'show-network',
        title: 'show network',
        selector: 'node, edge',
        onClickFunction: function(event) {
            // console.log(event.cyTarget);

            var ele = event.cyTarget;
            // console.log(ele.id());
            // console.log(window.location.href);
            var testSig = /sig/.test(window.location.href);
            var testOther = /other/.test(window.location.href);
            var testBoth = /both/.test(window.location.href);

            if(testSig) {
              window.open("/mycoregdb/sig/cytoscape?q=" + ele.id(), '_blank'); 
            } else if(testOther) {
              window.open("/mycoregdb/other/cytoscape?q=" + ele.id(), '_blank'); 
            } else if(testBoth) {
              window.open("/mycoregdb/both/cytoscape?q=" + ele.id(), '_blank'); 
            }
            // window.location.href = "/reganalyst/sig/cytoscape?q=" + $val;
            // var eles = ele.neighborhood();
            // var arr = []; // array maintained to restore the information corresponding to the node deleted
            // arr.push(ele);
            // eles.forEach(function(ele) {
            //   if(ele.connectedEdges().length == 1) arr.push(ele);
            // });
            // ur.do("deleteEles", arr);
        },
        disabled: false,
        hasTrailingDivider: false,
        coreAsWell: false
      },
    ],
    // css classes that menu items will have
    menuItemClasses: [
      // add class names to this list
    ],
    // css classes that context menu will have
    contextMenuClasses: [
      // add class names to this list
    ]
};

var instance = cy.contextMenus( context_menus_options );