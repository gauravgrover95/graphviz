
// object that stores ids of the elements and their corresponding betweenness centrality scores 
var obj = {};
// stack used to save the deleted scores from obj
var stack = [];

// i have placed selections here because same is being utilized by tap-handler class also
var nodeSelection = [];
// tracedNodes = [];
var edgeSelection = [];