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
    },
    {
      path: 'survey',
      component: () => import('@/views/public/survey'),
      name: 'ListSurvey',
      meta: {
        title: '调查问卷'
      }
    }
  ]
}
export default basicRouter
