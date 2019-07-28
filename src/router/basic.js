import Layout from '@/layout'

const basicRouter = {
  path: '/basic',
  alwaysShow: true,
  component: Layout,
  meta: {
    title: '${basic}',
    icon: 'table'
  },
  children: [
    {
      path: 'divisions',
      component: () => import('@/views/basic/division'),
      name: 'ListDivision',
      meta: {
        title: '行政区划'
      }
    }, {
      path: 'regions',
      component: () => import('@/views/basic/region'),
      name: 'ListRegion',
      meta: {
        title: '小区建档'
      }
    }, {
      path: 'corps',
      component: () => import('@/views/basic/corp'),
      name: 'ListCorp',
      meta: {
        title: '企业管理'
      }
    }
  ]
}
export default basicRouter
