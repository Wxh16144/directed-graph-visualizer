export type Node = {
  id: string;
  label: string;
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
  /** 是否过滤掉没有入边和出边的孤立节点 */
  filterOrphan?: boolean;
}

export interface GraphSettings {
  // 背景
  bg?: string;
  // 聚焦节点颜色
  focusColor?: string;
  // 节点颜色
  nodeColor?: string;
  // 边颜色
  linkColor?: string;
  // 灰色
  grayColor?: string;
  // 鼠标悬停时的颜色
  hoverColor?: string;
  // 字体大小
  fontSize?: number;
  // 鼠标悬停时的字体大小
  hoverFontSize?: number;
  // 出边颜色
  graphOutColor?: string;
  // 入边颜色
  graphInColor?: string;
}
