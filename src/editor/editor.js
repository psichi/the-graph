// code as used in the-graph-editor/the-graph-editor.html

Polymer('the-graph-editor', {
  graph: null,
  grid: 72,
  snap: 36,
  width: 800,
  height: 600,
  scale: 1,
  plugins: {},
  nofloGraph: null,
  menus: null,
  autolayout: false,
  theme: "dark",
  selectedNodes: [],
  copyNodes: [],
  errorNodes: {},
  selectedEdges: [],
  animatedEdges: [],
  displaySelectionGroup: true,
  forceSelection: false,
  created: function () {
    this.pan = [0,0];
    var pasteAction = function (graph, itemKey, item) {
      var pasted = TheGraph.Clipboard.paste(graph);
      this.selectedNodes = pasted.nodes;
      this.selectedEdges = [];
    }.bind(this);
    var pasteMenu = {
      icon: "paste",
      iconLabel: "paste",
      action: pasteAction
    };
    // Default context menu defs
    var nodeActions = {
      delete: function (graph, itemKey, item) {
        graph.removeNode(itemKey);
        // Remove selection
        var newSelection = [];
        for (var i=0, len=this.selectedNodes.length; i<len; i++){
          var selected = this.selectedNodes[i];
          if (selected !== item) {
            newSelection.push(selected);
          }
        }
        this.selectedNodes = newSelection;
      }.bind(this),
      copy: function (graph, itemKey, item) {
        TheGraph.Clipboard.copy(graph, [itemKey]);
      }
    }, edgeActions = {
      delete: function (graph, itemKey, item) {
        graph.removeEdge(item.from.node, item.from.port, item.to.node, item.to.port);
        // Remove selection
        var newSelection = [];
        for (var i=0, len=this.selectedEdges.length; i<len; i++){
          var selected = this.selectedEdges[i];
          if (selected !== item) {
            newSelection.push(selected);
          }
        }
        this.selectedEdges = newSelection;
      }.bind(this)
    };
    this.menus = {
      main: {
        icon: "sitemap",
        e4: pasteMenu
      },
      edge: {
        actions: edgeActions,
        icon: "long-arrow-right",
        s4: {
          icon: "trash-o",
          iconLabel: "delete",
          action: edgeActions.delete
        }
      },
      node: {
        actions: nodeActions,
        s4: {
          icon: "trash-o",
          iconLabel: "delete",
          action: nodeActions.delete
        },
        w4: {
          icon: "copy",
          iconLabel: "copy",
          action:  nodeActions.copy
        }
      },
      nodeInport: {
        w4: {
          icon: "sign-in",
          iconLabel: "export",
          action: function (graph, itemKey, item) {
            var pub = item.port;
            if (pub === 'start') {
              pub = 'start1';
            }
            if (pub === 'graph') {
              pub = 'graph1';
            }
            var count = 0;
            // Make sure public is unique
            while (graph.inports[pub]) {
              count++;
              pub = item.port + count;
            }
            var priNode = graph.getNode(item.process);
            var metadata = {x:priNode.metadata.x-144, y:priNode.metadata.y};
            graph.addInport(pub, item.process, item.port, metadata);
          }
        }
      },
      nodeOutport: {
        e4: {
          icon: "sign-out",
          iconLabel: "export",
          action: function (graph, itemKey, item) {
            var pub = item.port;
            var count = 0;
            // Make sure public is unique
            while (graph.outports[pub]) {
              count++;
              pub = item.port + count;
            }
            var priNode = graph.getNode(item.process);
            var metadata = {x:priNode.metadata.x+144, y:priNode.metadata.y};
            graph.addOutport(pub, item.process, item.port, metadata);
          }
        }
      },
      graphInport: {
        icon: "sign-in",
        iconColor: 2,
        n4: {
          label: "inport"
        },
        s4: {
          icon: "trash-o",
          iconLabel: "delete",
          action: function (graph, itemKey, item) {
            graph.removeInport(itemKey);
          }
        }
      },
      graphOutport: {
        icon: "sign-out",
        iconColor: 5,
        n4: {
          label: "outport"
        },
        s4: {
          icon: "trash-o",
          iconLabel: "delete",
          action: function (graph, itemKey, item) {
            graph.removeOutport(itemKey);
          }
        }
      },
      group: {
        icon: "th",
        s4: {
          icon: "trash-o",
          iconLabel: "ungroup",
          action: function (graph, itemKey, item) {
            graph.removeGroup(itemKey);
          }
        },
        // TODO copy group?
        e4: pasteMenu
      },
      selection: {
        icon: "th",
        w4: {
          icon: "copy",
          iconLabel: "copy",
          action: function (graph, itemKey, item) {
            TheGraph.Clipboard.copy(graph, item.nodes);
          }
        },
        e4: pasteMenu
      }
    };
  },
  ready: function () {},
  attached: function () {
  },
  detached: function () {
    for (var name in this.plugins) {
      this.plugins[name].unregister(this);
      delete this.plugins[name];
    }
  },
  addPlugin: function (name, plugin) {
    this.plugins[name] = plugin;
    plugin.register(this);
  },
  addMenu: function (type, options) {
    // options: icon, label
    this.menus[type] = options;
  },
  addMenuCallback: function (type, callback) {
    if (!this.menus[type]) {
      return;
    }
    this.menus[type].callback = callback;
  },
  addMenuAction: function (type, direction, options) {
    if (!this.menus[type]) {
      this.menus[type] = {};
    }
    var menu = this.menus[type];
    menu[direction] = options;
  },
  getMenuDef: function (options) {
    // Options: type, graph, itemKey, item
    if (options.type && this.menus[options.type]) {
      var defaultMenu = this.menus[options.type];
      if (defaultMenu.callback) {
        return defaultMenu.callback(defaultMenu, options);
      }
      return defaultMenu;
    }
    return null;
  },
  widthChanged: function () {
    this.style.width = this.width + "px";
  },
  heightChanged: function () {
    this.style.height = this.height + "px";
  },
  graphChanged: function () {
    if (typeof this.graph.addNode === 'function') {
      this.buildInitialLibrary(this.graph);
      this.nofloGraph = this.graph;
      return;
    }
    var noflo;
    if ('noflo' in window) {
      noflo = window.noflo;
    }
    if (!noflo && 'require' in window) {
      noflo = require('noflo');
    }
    if (!noflo) {
      console.warn('Missing noflo dependency! Should be built with Component.io or Browserify to require it.');
      return;
    }
    noflo.graph.loadJSON(this.graph, function(nofloGraph){
      this.buildInitialLibrary(nofloGraph);
      this.nofloGraph = nofloGraph;
      this.fire('graphInitialised', this);
    }.bind(this));
  },
  buildInitialLibrary: function (nofloGraph) {
    /*if (Object.keys(this.$.graph.library).length !== 0) {
     // We already have a library, skip
     // TODO what about loading a new graph? Are we making a new editor?
     return;
     }*/
    nofloGraph.nodes.forEach(function (node) {
      var component = {
        name: node.component,
        icon: 'cog',
        description: '',
        inports: [],
        outports: []
      };
      Object.keys(nofloGraph.inports).forEach(function (pub) {
        var exported = nofloGraph.inports[pub];
        if (exported.process === node.id) {
          for (var i = 0; i < component.inports.length; i++) {
            if (component.inports[i].name === exported.port) {
              return;
            }
          }
          component.inports.push({
            name: exported.port,
            type: 'all'
          });
        }
      });
      Object.keys(nofloGraph.outports).forEach(function (pub) {
        var exported = nofloGraph.outports[pub];
        if (exported.process === node.id) {
          for (var i = 0; i < component.outports.length; i++) {
            if (component.outports[i].name === exported.port) {
              return;
            }
          }
          component.outports.push({
            name: exported.port,
            type: 'all'
          });
        }
      });
      nofloGraph.initializers.forEach(function (iip) {
        if (iip.to.node === node.id) {
          for (var i = 0; i < component.inports.length; i++) {
            if (component.inports[i].name === iip.to.port) {
              return;
            }
          }
          component.inports.push({
            name: iip.to.port,
            type: 'all'
          });
        }
      });
      nofloGraph.edges.forEach(function (edge) {
        var i;
        if (edge.from.node === node.id) {
          for (i = 0; i < component.outports.length; i++) {
            if (component.outports[i].name === edge.from.port) {
              return;
            }
          }
          component.outports.push({
            name: edge.from.port,
            type: 'all'
          });
        }
        if (edge.to.node === node.id) {
          for (i = 0; i < component.inports.length; i++) {
            if (component.inports[i].name === edge.to.port) {
              return;
            }
          }
          component.inports.push({
            name: edge.to.port,
            type: 'all'
          });
        }
      });
      this.registerComponent(component, true);
    }.bind(this));
  },
  registerComponent: function (definition, generated) {
    this.$.graph.registerComponent(definition, generated);
  },
  libraryRefresh: function () {
    this.$.graph.debounceLibraryRefesh();
  },
  updateIcon: function (nodeId, icon) {
    this.$.graph.updateIcon(nodeId, icon);
  },
  rerender: function () {
    this.$.graph.rerender();
  },
  triggerAutolayout: function () {
    this.$.graph.triggerAutolayout();
  },
  triggerFit: function () {
    this.$.graph.triggerFit();
  },
  animateEdge: function (edge) {
    // Make sure unique
    var index = this.animatedEdges.indexOf(edge);
    if (index === -1) {
      this.animatedEdges.push(edge);
    }
  },
  unanimateEdge: function (edge) {
    var index = this.animatedEdges.indexOf(edge);
    if (index >= 0) {
      this.animatedEdges.splice(index, 1);
    }
  },
  addErrorNode: function (id) {
    this.errorNodes[id] = true;
    this.updateErrorNodes();
  },
  removeErrorNode: function (id) {
    this.errorNodes[id] = false;
    this.updateErrorNodes();
  },
  clearErrorNodes: function () {
    this.errorNodes = {};
    this.updateErrorNodes();
  },
  updateErrorNodes: function () {
    this.$.graph.errorNodesChanged();
  },
  focusNode: function (node) {
    this.$.graph.focusNode(node);
  },
  getComponent: function (name) {
    return this.$.graph.getComponent(name);
  },
  getLibrary: function () {
    return this.$.graph.library;
  },
  toJSON: function () {
    return this.nofloGraph.toJSON();
  }
});
})();
