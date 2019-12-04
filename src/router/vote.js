import Layout from '@/layout'

const voteRouter = {
  path: '/vote',
  alwaysShow: true,
  component: Layout,
  meta: {
    title: '${vote}',
    icon: 'peoples'
  },
  children: [
    {
      path: 'standard',
      component: () => import('@/views/vote/standard'),
      name: 'ListStandard',
      meta: {
        title: '表决标准'
      }
    }
  ]
}
export default voteRouter
