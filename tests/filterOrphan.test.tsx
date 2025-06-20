import { render } from '@testing-library/react';
import GraphVisualizer from '../src/GraphVisualizer';

describe('filterOrphan', () => {
  describe('filterOrphan with selectedNodeId', () => {
    // a->b, b->c, d(孤立)
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

  it('should filter only nodes with no in or out edges (true orphan)', () => {
    // a->b, b->c, d(孤立), e(只有出边), f(只有入边)
    const nodes = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
      { id: 'd', label: 'D' }, // 真正孤立
      { id: 'e', label: 'E' }, // 只有出边
      { id: 'f', label: 'F' }, // 只有入边
    ];
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'e', target: 'b' }, // e只有出边
      { source: 'a', target: 'f' }, // f只有入边
    ];
    const { container } = render(
      <GraphVisualizer nodes={nodes} edges={edges} filterOrphan={true} />,
    );
    // d 是唯一真正的孤立点，应该被过滤，其余都应保留
    expect(container.querySelectorAll('circle').length).toBe(5);
    // 边数不变
    expect(container.querySelectorAll('line').length).toBe(4);
  });

  it('should only filter nodes with no in or out edges (true orphans), not independent clusters', () => {
    // a->b, b->c, d(孤立), e<->f(独立簇), g(孤立)
    const nodes = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
      { id: 'd', label: 'D' }, // 孤立节点
      { id: 'e', label: 'E' }, // 独立簇
      { id: 'f', label: 'F' }, // 独立簇
      { id: 'g', label: 'G' }, // 孤立节点
    ];
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'e', target: 'f' }, // 独立簇
      { source: 'f', target: 'e' }, // 独立簇
    ];
    const { container } = render(
      <GraphVisualizer nodes={nodes} edges={edges} filterOrphan={true} />,
    );
    // d 和 g 是孤立点，应该被过滤，a/b/c/e/f 都应保留
    expect(container.querySelectorAll('circle').length).toBe(5);
    // 边数不变
    expect(container.querySelectorAll('line').length).toBe(4);
  });
});
