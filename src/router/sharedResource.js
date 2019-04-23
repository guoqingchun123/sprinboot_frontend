import Layout from '@/layout/Layout';

const sharedResourceRouter = {
  path: '/sharedResource',
  alwaysShow: false,
  component: Layout,
  meta: {
    title: '${sharedResource}',
    icon: 'user'
  },
  children: [
    {
      path: 'isoFiles',
      component: () => import('@/views/sharedResource/index'),
      name: 'ISOFiles',
      meta: {
        title: '${isoFiles}'
      },
      redirect: 'noredirect',
      children:[
        {
          path: 'IFManage',
          component: () => import('@/views/sharedResource/isoManage'),
          name: 'IFManage',
          meta: {
            title: '${fileManagement}'
          }
        },
        {
          path: 'IFDownload',
          component: () => import('@/views/sharedResource/isoDownload'),
          name: 'IFDownload',
          meta: {
            title: '${fileDownload}'
          }
        }
      ]
    },
    {
      path: 'publicFiles',
      component: () => import('@/views/sharedResource/index'),
      name: 'PublicFiles',
      meta: {
        title: '${publicFiles}'
      },
      redirect: 'noredirect',
      children:[
        {
          path: 'publicFileManage',
          component: () => import('@/views/sharedResource/publicManage'),
          name: 'PFManage',
          meta: {
            title: '${fileManagement}'
          }
        },
        {
          path: 'PFDownload',
          component: () => import('@/views/sharedResource/publicDownload'),
          name: 'PFDownload',
          meta: {
            title: '${fileDownload}'
          }
        }
      ]
    },
    {
      path: 'fileOperate',
      component: () => import('@/views/sharedResource/fileOperate'),
      name: 'FileOperate',
      meta: {
        title: '${fileOperate}'
      },
    }
  ]
}
export default sharedResourceRouter;
