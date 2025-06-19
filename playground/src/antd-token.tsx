import { useSize } from 'ahooks';
import { theme } from 'antd';
import { useMemo, useRef } from 'react';
import { DirectedGraphVisualizer, type GraphSettings } from 'react-directed-graph-visualizer';
import data from '../public/gaddi.json';

// https://g6.antv.antgroup.com/examples/algorithm/case/#pattern-matching
function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerRef);

  // 使用 Ant Design 的主题色
  const { token } = theme.useToken();

  const graphSettings = useMemo<GraphSettings>(
    () => ({
      bg: token.colorBgContainer,
      focusColor: token.colorPrimary,
      nodeColor: token.colorTextLabel,
      linkColor: token.colorTextQuaternary,
      grayColor: token.colorSplit,
      fontSize: 16,
      hoverFontSize: 18,
      hoverColor: token.colorPrimary,
      // 出度和入度颜色
      graphOutColor: token.colorSuccess,
      graphInColor: token.colorWarning,
    }),
    [token],
  );

  return (
    <div ref={containerRef} style={{ width: '100dvw', height: '100dvh' }}>
      <DirectedGraphVisualizer
        nodes={data.nodes ?? []}
        edges={data.edges ?? []}
        width={containerSize?.width}
        height={containerSize?.height}
        graphSettings={graphSettings}
        onSelectNode={(node) => console.log('Clicked node:', node)}
      />
    </div>
  );
}

export default App;
