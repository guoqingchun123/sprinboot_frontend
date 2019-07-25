import Layout from '@/layout'

const basicRouter = {
  path: '/public',
  alwaysShow: true,
  component: Layout,
  meta: {
    title: '${public}',
    icon: 'message'
  },
  children: [
    {
      path: 'publish',
      component: () => import('@/views/public/publish'),
      name: 'ListPublish',
      meta: {
        title: '信息公开'
      }
    }
  ]
}
export default basicRouter
