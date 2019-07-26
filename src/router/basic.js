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
      path: '机构简介',
      component: () => import('@/views/basic/competent'),
      name: 'ListCompetent',
      meta: {
        title: '机构简介'
      }
    },
    {
      path: 'divisions',
      component: () => import('@/views/basic/division'),
      name: 'ListDivision',
      meta: {
        title: '行政区划'
      }
    },
    {
      path: 'regions',
      component: () => import('@/views/basic/region'),
      name: 'ListRegion',
      meta: {
        title: '小区建档'
      }
    },
    {
      path: 'listProjectByRegion/:id',
      component: () => import('@/views/basic/region/listProjectByRegion'),
      name: 'ListProjectByRegion',
      meta: {
        title: '小区建档'
      },
      hidden: true
    },
    {
      path: 'regionMaintain',
      component: () => import('@/views/basic/region/regionMaintain'),
      name: 'RegionMaintain',
      meta: {
        title: '小区建档'
      }
    }
  ]
}
export default basicRouter
