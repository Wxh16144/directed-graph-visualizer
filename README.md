# react-directed-graph-visualizer

<!-- SHIELD GROUP -->

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![install size][npm-size]][npm-size-url]

[![Test CI status][test-ci]][test-ci-url] [![Deploy CI][release-ci]][release-ci-url] [![Coverage][coverage]][codecov-url]

[![contributors][contributors-shield]][contributors-url] [![forks][forks-shield]][forks-url] [![stargazers][stargazers-shield]][stargazers-url] [![issues][issues-shield]][issues-url]

[![docs by dumi][dumi-url]](https://d.umijs.org/) [![Build With father][father-url]](https://github.com/umijs/father/)

<!-- umi url -->

[dumi-url]: https://img.shields.io/badge/docs%20by-dumi-blue
[father-url]: https://img.shields.io/badge/build%20with-father-028fe4.svg

<!-- npm url -->

[npm-image]: http://img.shields.io/npm/v/react-directed-graph-visualizer.svg?style=flat-square&color=deepgreen&label=latest
[npm-url]: http://npmjs.org/package/react-directed-graph-visualizer
[npm-size]: https://img.shields.io/bundlephobia/minzip/react-directed-graph-visualizer?color=deepgreen&label=gizpped%20size&style=flat-square
[npm-size-url]: https://packagephobia.com/result?p=react-directed-graph-visualizer

<!-- coverage -->

[coverage]: https://codecov.io/gh/Wxh16144/directed-graph-visualizer/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/Wxh16144/directed-graph-visualizer/branch/master

<!-- Github CI -->

[test-ci]: https://github.com/Wxh16144/directed-graph-visualizer/workflows/Test%20CI/badge.svg
[release-ci]: https://github.com/Wxh16144/directed-graph-visualizer/workflows/Release%20CI/badge.svg
[test-ci-url]: https://github.com/Wxh16144/directed-graph-visualizer/actions?query=workflow%3ATest%20CI
[release-ci-url]: https://github.com/Wxh16144/directed-graph-visualizer/actions?query=workflow%3ARelease%20CI
[download-image]: https://img.shields.io/npm/dm/react-directed-graph-visualizer.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-directed-graph-visualizer

## 简介

> 基于 D3.js 的 React 有向图可视化组件，支持节点高亮、键盘导航、主题自定义，适用于交互式数据可视化场景。

### 功能特性

- 支持节点/边高亮、出入边模式
- 键盘 Shift/Control 辅助高亮出入边
- 支持自定义主题和样式
- 响应式自适应容器大小
- 支持节点拖拽、缩放、平移
- 适合大规模有向图的交互分析
- 支持自定义节点/边渲染
- 丰富的事件回调（节点选择、边点击等）

## 快速上手

### 安装

推荐使用 `pnpm` 安装

```bash
pnpm i react-directed-graph-visualizer -S
```

### 使用示例

```tsx | pure
import { DirectedGraphVisualizer } from 'react-directed-graph-visualizer';

const nodes = [
  { id: '1', label: '节点1' },
  { id: '2', label: '节点2' },
];
const edges = [{ source: '1', target: '2' }];

export default () => (
  <DirectedGraphVisualizer
    nodes={nodes}
    edges={edges}
    width={800}
    height={600}
    onSelectNode={(id) => console.log('选中节点', id)}
  />
);
```

## API

| 属性                  | 说明            | 类型                   | 默认值 |
| --------------------- | --------------- | ---------------------- | ------ |
| nodes                 | 节点数据        | `Node[]`               | 必填   |
| edges                 | 边数据          | `Edge[]`               | 必填   |
| selectedNodeId        | 当前高亮节点 id | `string`               | -      |
| defaultSelectedNodeId | 默认高亮节点 id | `string`               | -      |
| onSelectNode          | 节点点击回调    | `(id: string) => void` | -      |
| width                 | 画布宽度        | `number`               | 800    |
| height                | 画布高度        | `number`               | 600    |
| graphSettings         | 主题与样式配置  | `GraphSettings`        | 见下表 |

### GraphSettings 可配置项

| 属性          | 说明         | 类型   | 默认值         |
| ------------- | ------------ | ------ | -------------- |
| bg            | 背景色       | string | white          |
| focusColor    | 选中节点色   | string | orange         |
| nodeColor     | 普通节点色   | string | mediumseagreen |
| linkColor     | 普通边色     | string | slategray      |
| grayColor     | 非高亮色     | string | lightgray      |
| hoverColor    | 悬浮高亮色   | string | crimson        |
| fontSize      | 字体大小     | number | 16             |
| hoverFontSize | 悬浮字体大小 | number | 24             |
| graphOutColor | 出边高亮色   | string | royalblue      |
| graphInColor  | 入边高亮色   | string | goldenrod      |

## 迭代记录

详情：[CHANGELOG](./CHANGELOG.md)

## License

Copyright © 2025 - present [Wxh16144][profile-url].  
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[profile-url]: https://github.com/Wxh16144

<!-- contributors -->

[contributors-shield]: https://img.shields.io/github/contributors/Wxh16144/directed-graph-visualizer.svg?style=flat
[contributors-url]: https://github.com/Wxh16144/directed-graph-visualizer/graphs/contributors

<!-- forks -->

[forks-shield]: https://img.shields.io/github/forks/Wxh16144/directed-graph-visualizer.svg?style=flat
[forks-url]: https://github.com/Wxh16144/directed-graph-visualizer/network/members

<!-- stargazers -->

[stargazers-shield]: https://img.shields.io/github/stars/Wxh16144/directed-graph-visualizer.svg?style=flat
[stargazers-url]: https://github.com/Wxh16144/directed-graph-visualizer/stargazers

<!-- issues -->

[issues-shield]: https://img.shields.io/github/issues/Wxh16144/directed-graph-visualizer.svg?style=flat
[issues-url]: https://github.com/Wxh16144/directed-graph-visualizer/issues/new/choose
