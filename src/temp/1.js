export default {
  path: '/vote',
  alwaysShow: true,
  component: 'Layout',
  meta: {
    title: '${vote}',
    icon: 'peoples'
  },
  children: [
    {
      path: 'standard',
      component: 'vote/standard',
      name: 'ListStandard',
      meta: {
        title: '表决标准'
      }
    }
  ]
}