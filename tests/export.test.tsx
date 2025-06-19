describe('export', () => {
  it('should work', async () => {
    const all = await import('react-directed-graph-visualizer');

    expect(Object.keys(all)).toMatchSnapshot();
  });
});
