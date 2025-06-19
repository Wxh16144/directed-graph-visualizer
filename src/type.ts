export type Node = {
  id: string;
  name: string;
};

export type Edge = {
  source: string;
  target: string;
};

export interface DirectedGraphVisualizerProps<N extends Node = Node, E extends Edge = Edge> {
  nodes: N[];
  edges: E[];
  /**
   * The ID of the node to focus on. If provided, only this node and its related nodes will be displayed.
   */
  selectedNodeId?: string;
  defaultSelectedNodeId?: string;
  /**
   * Callback function when a node is clicked.
   */
  onSelectNode?: (id: string) => void;
  width?: number;
  height?: number;
  graphSettings?: GraphSettings;
}

export interface GraphSettings {
  /**
   * Background color of the graph.
   * @default '#fff'
   */
  bg?: string;
  /**
   * Color of the focused node.
   * @default '#f90'
   */
  focusColor?: string;
  /**
   * Default color of nodes.
   * @default '#69b3a2'
   */
  nodeColor?: string;
  /**
   * Color of the edges.
   * @default '#d3d3d3'
   */
  linkColor?: string;
  /**
   * Color of the edges when not focused.
   * @default '#d3d3d3'
   */
  grayColor?: string;
  /**
   * Color of the node when hovered.
   * @default '#ff5252'
   */
  hoverColor?: string;
  /**
   * Default font size for the graph.
   * @default 16
   */
  fontSize?: number;
  /**
   * Font size when hovering over a node.
   * @default 24
   */
  hoverFontSize?: number;
  /**
   * Color of the edges for outgoing connections.
   * @default '#4caf50'
   */
  graphOutColor?: string;
  /**
   * Color of the edges for incoming connections.
   * @default '#21e5f3'
   */
  graphInColor?: string;
}
