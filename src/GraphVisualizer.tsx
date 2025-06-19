// import { theme } from 'antd';
import * as d3 from 'd3';
import { useEvent, useMergedState } from 'rc-util';
import React, { useEffect, useRef } from 'react';
import { highlightGraph } from './helper';
import { DirectedGraphVisualizerProps, GraphSettings } from './type';

const defaultGraphSettings: Required<GraphSettings> = {
  bg: '#fff',
  focusColor: '#f90',
  nodeColor: '#69b3a2',
  linkColor: '#d3d3d3',
  grayColor: '#d3d3d3',
  hoverColor: '#ff5252',
  fontSize: 16,
  hoverFontSize: 24,
  graphOutColor: '#4caf50',
  graphInColor: '#21e5f3',
};

const GraphVisualizer: React.FC<DirectedGraphVisualizerProps> = ({
  nodes,
  edges,
  selectedNodeId: propSelectedNodeId,
  defaultSelectedNodeId,
  onSelectNode,
  width = 800,
  height = 600,
  graphSettings: propGraphSettings,
}) => {
  const graphSettings = { ...defaultGraphSettings, ...propGraphSettings };
  const NODE_RADIUS = 16;

  const [selectedNodeId, setSelectedNodeId] = useMergedState<string | undefined>(
    defaultSelectedNodeId,
    {
      value: propSelectedNodeId,
      onChange: (value) => {
        onSelectNode?.(value!);
      },
    },
  );

  const svgRef = useRef<SVGSVGElement>(null);

  const refMode = React.useRef<'none' | 'refer' | 'referred'>('none');

  // ========== Keyboard Event Handling ==========
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') refMode.current = 'referred';
      if (event.key === 'Control') refMode.current = 'refer';
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && refMode.current === 'referred') refMode.current = 'none';
      if (event.key === 'Control' && refMode.current === 'refer') refMode.current = 'none';
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ========== Filter Nodes and Edges ==========
  const filtered = React.useMemo(() => {
    if (!selectedNodeId) return { nodes, edges };
    const nodeSet = new Set<string>();
    nodeSet.add(selectedNodeId);
    edges.forEach((e) => {
      if (e.source === selectedNodeId) nodeSet.add(e.target);
      if (e.target === selectedNodeId) nodeSet.add(e.source);
    });

    const filteredNodes = nodes.filter((n) => nodeSet.has(n.id));
    const filteredEdges = edges.filter(
      (e) =>
        nodeSet.has(e.source) &&
        nodeSet.has(e.target) &&
        (e.source === selectedNodeId || e.target === selectedNodeId),
    );

    return { nodes: filteredNodes, edges: filteredEdges };
  }, [nodes, edges, selectedNodeId]);

  // ========== D3 Visualization ==========
  const createGraphSimulation = useEvent(() => {
    const svg = d3.select(svgRef.current!);
    svg.selectAll('*').remove();

    // 缩放/平移
    const g = svg.append('g');
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        }),
    );

    const simulation = d3
      .forceSimulation<any>(filtered.nodes)
      .force(
        'link',
        d3
          .forceLink(filtered.edges)
          .id((d: any) => d.id)
          .distance(120),
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = g
      .append('g')
      .attr('stroke', graphSettings.linkColor)
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(filtered.edges)
      .enter()
      .append('line')
      .attr('marker-end', 'url(#arrow)')
      .attr('class', (d) => {
        const sourceId = d.source;
        const targetId = d.source;
        return `link link-${sourceId}-${targetId}`;
      });

    // Draw nodes and labels together so label is under node
    const nodeGroup = g
      .append('g')
      .selectAll('g')
      .data(filtered.nodes)
      .enter()
      .append('g')
      .attr('class', (d) => `node-group node-group-${d.id}`);

    // Draw labels first (under the circle)
    const label = nodeGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 0)
      .text((d) => d.name)
      .attr('class', (d) => `label label-${d.id}`)
      .attr('fill', (d) =>
        d.id === selectedNodeId ? graphSettings.focusColor : graphSettings.nodeColor,
      );

    // Draw circles (nodes) above the label
    const node = nodeGroup
      .append('circle')
      .attr('r', NODE_RADIUS)
      .attr('fill', (d) =>
        d.id === selectedNodeId ? graphSettings.focusColor : graphSettings.nodeColor,
      )
      .attr('class', (d) => `node node-${d.id}`)
      .call(
        d3
          .drag<SVGCircleElement, any>()
          .on('start', (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on('drag', (event) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end', (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }),
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNodeId?.(d.id);
      })
      .on('mouseover', function (event, d) {
        // 语义化传递
        let mode: 'normal' | 'in' | 'out' = 'normal';
        if (refMode.current === 'referred') mode = 'in';
        else if (refMode.current === 'refer') mode = 'out';
        highlightGraph(g, filtered, d.id.toString(), mode, graphSettings);
      })
      .on('mouseout', function () {
        g.selectAll('circle').attr('fill', (d: any) =>
          d.id === selectedNodeId ? graphSettings.focusColor : graphSettings.nodeColor,
        );
        // mouseout 恢复字体大小
        g.selectAll('text')
          .attr('fill', (d: any) =>
            d.id === selectedNodeId ? graphSettings.focusColor : graphSettings.nodeColor,
          )
          .attr('font-weight', 'normal')
          .attr('font-size', graphSettings.fontSize);
        g.selectAll('line')
          .interrupt()
          .attr('stroke', graphSettings.linkColor)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', null)
          .attr('stroke-dashoffset', null)
          .attr('marker-start', null)
          .attr('marker-end', 'url(#arrow)');
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
      label.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y + 36); // label below node
    });

    return function cleanup() {
      simulation.stop();
      svg.selectAll('*').remove();
      svg.on('.zoom', null);
    };
  });

  useEffect(createGraphSimulation, [filtered, width, height, selectedNodeId, graphSettings]);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ background: graphSettings.bg }} />
  );
};

export default GraphVisualizer;
