import { useSize } from 'ahooks';
import { useRef } from 'react';
import { DirectedGraphVisualizer } from 'react-directed-graph-visualizer';
import data from '../public/gaddi.json';

// https://g6.antv.antgroup.com/examples/algorithm/case/#pattern-matching
function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  // const { data, loading } = useRequest(() => fetch('/gaddi.json').then((res) => res.json()));

  globalThis.console.log('[gaddi.json]', data);

  // =========== render ===========
  // if (loading) {
  //   return <h1 style={{ color: '#ae5ebb', fontSize: 32 }}>Loading...</h1>;
  // }

  return (
    <div ref={containerRef} style={{ width: '100dvw', height: '100dvh' }}>
      <DirectedGraphVisualizer
        nodes={data.nodes ?? []}
        edges={data.edges ?? []}
        width={containerSize?.width}
        height={containerSize?.height}
        onSelectNode={(node) => console.log('Clicked node:', node)}
      />
    </div>
  );
}

export default App;
