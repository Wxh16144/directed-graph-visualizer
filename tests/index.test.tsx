import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GraphVisualizer from '../src/GraphVisualizer';

describe('GraphVisualizer', () => {
  //正常工作
  it('should render without crashing', () => {
    const { container } = render(<GraphVisualizer nodes={[]} edges={[]} />);
    expect(container).toBeInTheDocument();
  });

  //测试节点和边的渲染
  it('should render nodes and edges correctly', async () => {
    const { nodes, edges } = await import('../playground/public/gaddi.json');
    const { container } = render(<GraphVisualizer nodes={nodes} edges={edges} />);
    expect(container.querySelectorAll('circle').length).toBe(nodes.length);
    expect(container.querySelectorAll('line').length).toBe(edges.length);
  });

  describe('controlled/uncontrolled', () => {
    let nodes: any[], edges: any[];
    beforeEach(async () => {
      const data = await import('../playground/public/gaddi.json');
      nodes = data.nodes;
      edges = data.edges;
    });

    it('should support controlled selectedNodeId', () => {
      const { container, rerender } = render(
        <GraphVisualizer nodes={nodes} edges={edges} selectedNodeId={'10'} />,
      );
      expect(container.querySelectorAll('circle').length).toBe(9);
      // 切换选中节点
      rerender(<GraphVisualizer nodes={nodes} edges={edges} selectedNodeId={'20'} />);
      expect(container.querySelectorAll('circle').length).toBe(5);
    });

    it('should support uncontrolled selectedNodeId', () => {
      const { container, rerender } = render(
        <GraphVisualizer nodes={nodes} edges={edges} defaultSelectedNodeId="5" />,
      );
      expect(container.querySelectorAll('circle').length).toBe(4);
      // 切换选中节点
      rerender(<GraphVisualizer nodes={nodes} edges={edges} defaultSelectedNodeId="0" />);
      expect(container.querySelectorAll('circle').length).toBe(4);
    });
  });

  describe('filterOrphan', () => {
    const nodes = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
      { id: 'd', label: 'D' }, // 孤立节点
    ];

    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];

    it('should show all nodes and edges when filterOrphan is false', () => {
      const { container } = render(
        <GraphVisualizer nodes={nodes} edges={edges} filterOrphan={false} />,
      );
      // 4 nodes, 2 edges
      expect(container.querySelectorAll('circle').length).toBe(4);
      expect(container.querySelectorAll('line').length).toBe(2);
    });

    it('should filter orphan nodes when filterOrphan is true', () => {
      const { container } = render(
        <GraphVisualizer nodes={nodes} edges={edges} filterOrphan={true} />,
      );
      // 只剩下3个有边的节点，2条边
      expect(container.querySelectorAll('circle').length).toBe(3);
      expect(container.querySelectorAll('line').length).toBe(2);
    });

    it('should show only selected node and its neighbors when selectedNodeId is set', () => {
      const { container } = render(
        <GraphVisualizer nodes={nodes} edges={edges} filterOrphan={true} selectedNodeId={'b'} />,
      );
      // b, a, c
      expect(container.querySelectorAll('circle').length).toBe(3);
      expect(container.querySelectorAll('line').length).toBe(2);
    });

    it('should show only the selected node if it is isolated and filterOrphan is false', () => {
      const { container } = render(
        <GraphVisualizer nodes={nodes} edges={edges} filterOrphan={false} selectedNodeId={'d'} />,
      );
      // 只剩下d
      expect(container.querySelectorAll('circle').length).toBe(1);
      expect(container.querySelectorAll('line').length).toBe(0);
    });
  });

  describe('hover with ctrl/shift', () => {
    let nodes: any[], edges: any[];
    beforeEach(async () => {
      const data = await import('../playground/public/gaddi.json');
      nodes = data.nodes;
      edges = data.edges;
    });

    it('should highlight in mode "in" when Shift is held and hover', async () => {
      const { container } = render(
        <GraphVisualizer
          nodes={nodes}
          edges={edges}
          graphSettings={{
            graphInColor: 'blue',
          }}
        />,
      );
      const node = container.querySelector('.node-22');
      expect(node).toBeTruthy();
      await act(async () => {
        await userEvent.keyboard('{Shift>}');
        await userEvent.hover(node!);
      });
      expect(node).toHaveAttribute('fill', 'blue');

      const blueNodes = container.querySelectorAll('circle[fill="blue"]');
      // 22和它的入边节点数量
      expect(blueNodes.length).toBe(11);
    });

    it('should highlight in mode "out" when Ctrl is held and hover', async () => {
      const { container } = render(
        <GraphVisualizer
          nodes={nodes}
          edges={edges}
          graphSettings={{
            graphOutColor: 'red',
          }}
        />,
      );
      const node = container.querySelector('.node-21');
      expect(node).toBeTruthy();
      await act(async () => {
        await userEvent.keyboard('{Control>}');
        await userEvent.hover(node!);
      });
      expect(node).toHaveAttribute('fill', 'red');
      const redNodes = container.querySelectorAll('circle[fill="red"]');
      // b和它的出边节点数量
      expect(redNodes.length).toBe(13);
    });

    // 键盘不做任何操作，鼠标悬停
    it('should highlight in mode "normal" when hovering without modifiers', async () => {
      const { container } = render(
        <GraphVisualizer
          nodes={nodes}
          edges={edges}
          graphSettings={{
            hoverColor: 'green',
          }}
        />,
      );

      const node = container.querySelector('.node-10');
      expect(node).toBeTruthy();
      await act(async () => {
        await userEvent.hover(node!);
      });
      expect(node).toHaveAttribute('fill', 'green');
      const greenNodes = container.querySelectorAll('circle[fill="green"]');
      // 10和它的 出/入边节点数量
      expect(greenNodes.length).toBe(9);
    });
  });
});
