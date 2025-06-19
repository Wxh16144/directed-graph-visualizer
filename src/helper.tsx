import * as d3 from 'd3';
import { GraphSettings } from './type';

export function collectRecursiveIds(
  edges: any[],
  nodeId: string,
  direction: 'in' | 'out',
  nodeSet: Set<string>,
  edgeSet: Set<string>,
) {
  edges.forEach((e, idx) => {
    const sourceId =
      typeof e.source === 'object' && e.source !== null
        ? (e.source as any).id
        : (e.source as string) ?? '';
    const targetId =
      typeof e.target === 'object' && e.target !== null
        ? (e.target as any).id
        : (e.target as string) ?? '';
    if (direction === 'in' && targetId === nodeId && !nodeSet.has(sourceId)) {
      nodeSet.add(sourceId);
      edgeSet.add(idx.toString());
      collectRecursiveIds(edges, sourceId, direction, nodeSet, edgeSet);
    }
    if (direction === 'out' && sourceId === nodeId && !nodeSet.has(targetId)) {
      nodeSet.add(targetId);
      edgeSet.add(idx.toString());
      collectRecursiveIds(edges, targetId, direction, nodeSet, edgeSet);
    }
  });
}

export function getRelatedIds(edges: any[], nodeId: string, mode: 'normal' | 'in' | 'out') {
  const relatedNodeIds = new Set<string>();
  const relatedEdgeIdx = new Set<string>();
  relatedNodeIds.add(nodeId);
  if (mode === 'in') {
    collectRecursiveIds(edges, nodeId, 'in', relatedNodeIds, relatedEdgeIdx);
  } else if (mode === 'out') {
    collectRecursiveIds(edges, nodeId, 'out', relatedNodeIds, relatedEdgeIdx);
  } else {
    edges.forEach((e, idx) => {
      const sourceId =
        typeof e.source === 'object' && e.source !== null
          ? (e.source as any).id
          : (e.source as string) ?? '';
      const targetId =
        typeof e.target === 'object' && e.target !== null
          ? (e.target as any).id
          : (e.target as string) ?? '';
      if (sourceId === nodeId) {
        relatedNodeIds.add(targetId.toString());
        relatedEdgeIdx.add(idx.toString());
      }
      if (targetId === nodeId) {
        relatedNodeIds.add(sourceId.toString());
        relatedEdgeIdx.add(idx.toString());
      }
    });
  }
  return { relatedNodeIds, relatedEdgeIdx };
}

export function highlightGraph(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  filtered: { edges: any[] },
  nodeId: string,
  mode: 'normal' | 'in' | 'out',
  graphSettings: Required<GraphSettings>,
) {
  const { relatedNodeIds, relatedEdgeIdx } = getRelatedIds(filtered.edges, nodeId, mode);

  // 先将所有节点、label、边设为灰色
  g.selectAll('circle').attr('fill', graphSettings.grayColor);
  g.selectAll('text').attr('fill', graphSettings.grayColor).attr('font-weight', 'normal');
  g.selectAll('line').attr('stroke', graphSettings.grayColor).attr('stroke-width', 1.5);

  // 高亮相关节点和 label
  g.selectAll('circle').each(function (nodeDatum: any) {
    if (relatedNodeIds.has(nodeDatum.id.toString())) {
      // 区分出入边模式下的节点颜色
      let nodeColor = graphSettings.focusColor;
      if (mode === 'in') {
        nodeColor = graphSettings.graphInColor;
      } else if (mode === 'out') {
        nodeColor = graphSettings.graphOutColor;
      }
      d3.select(this).attr('fill', nodeColor);
      g.select(`.label-${nodeDatum.id}`)
        .attr('fill', nodeColor)
        .attr('font-weight', 'bold')
        .attr('font-size', graphSettings.hoverFontSize);
    }
  });

  // 高亮相关线条
  g.selectAll('line').each(function (edgeDatum: any, idx: number) {
    if (relatedEdgeIdx.has(idx.toString())) {
      // 动画相关
      const sourceId =
        typeof edgeDatum.source === 'object' && edgeDatum.source !== null
          ? (edgeDatum.source as any).id
          : (edgeDatum.source as string) ?? '';
      const targetId =
        typeof edgeDatum.target === 'object' && edgeDatum.target !== null
          ? (edgeDatum.target as any).id
          : (edgeDatum.target as string) ?? '';
      // 动画方向
      let markerStart: string | null = null;
      let markerEnd: string | null = null;
      const dashArray = '8,4';
      let dashOffsetFrom = 0;
      let dashOffsetTo = 24;
      const lineColor =
        mode === 'in'
          ? graphSettings.graphInColor
          : mode === 'out'
          ? graphSettings.graphOutColor
          : graphSettings.hoverColor;
      if (mode === 'in' || mode === 'out') {
        markerStart = null;
        markerEnd = 'url(#arrow)';
        dashOffsetFrom = 0;
        dashOffsetTo = 24;
        const animateLine = (line: d3.Selection<SVGLineElement, any, any, any>) => {
          line
            .attr('stroke', lineColor)
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', dashArray)
            .attr('stroke-dashoffset', dashOffsetFrom)
            .attr('marker-start', markerStart)
            .attr('marker-end', markerEnd)
            .transition()
            .duration(800)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', dashOffsetTo)
            .on('end', function (this: SVGLineElement) {
              const current = d3.select(this);
              if (current.attr('stroke') === lineColor) {
                animateLine(current);
              }
            });
        };
        animateLine(d3.select(this as any));
      } else {
        // 普通模式下高亮为实线无动画
        d3.select(this)
          .interrupt()
          .attr('stroke', lineColor)
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', null)
          .attr('stroke-dashoffset', null)
          .attr('marker-start', null)
          .attr('marker-end', 'url(#arrow)');
      }
      // 高亮两端节点和 label
      if (sourceId) {
        let nodeColor = graphSettings.focusColor;
        if (mode === 'in') {
          nodeColor = graphSettings.graphInColor;
        } else if (mode === 'out') {
          nodeColor = graphSettings.graphOutColor;
        }
        g.select(`.node-${sourceId}`).attr('fill', nodeColor);
        g.select(`.label-${sourceId}`)
          .attr('fill', nodeColor)
          .attr('font-weight', 'bold')
          .attr('font-size', graphSettings.hoverFontSize);
      }
      if (targetId) {
        let nodeColor = graphSettings.focusColor;
        if (mode === 'in') {
          nodeColor = graphSettings.graphInColor;
        } else if (mode === 'out') {
          nodeColor = graphSettings.graphOutColor;
        }
        g.select(`.node-${targetId}`).attr('fill', nodeColor);
        g.select(`.label-${targetId}`)
          .attr('fill', nodeColor)
          .attr('font-weight', 'bold')
          .attr('font-size', graphSettings.hoverFontSize);
      }
    } else {
      // 非高亮边恢复为实线
      d3.select(this)
        .interrupt()
        .attr('stroke', graphSettings.linkColor)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', null)
        .attr('stroke-dashoffset', null)
        .attr('marker-start', null)
        .attr('marker-end', 'url(#arrow)');
    }
  });
}
