const customFile = [
  {corpId:'20190001',
    fileType:'系统集成报告',
    fileTypeId:'2',
    fileName:'系统集成报告文件',
    fileSize:'8k',
    fileDetailType:'png',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
},
  {corpId:'20190001',
    fileType:'系统集成报告',
    fileTypeId:'2',
    fileName:'系统集成报告文件1',
    fileSize:'8k',
    fileDetailType:'doc',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
},
  {corpId:'20190002',
    fileType:'系统集成报告',
    fileTypeId:'2',
    fileName:'系统集成报告文件2',
    fileSize:'8k',
    fileDetailType:'doc'
  },
  {corpId:'20190001',
    fileType:'项目验收报告',
    fileTypeId:'3',
    fileName:'项目验收报告文件',
    fileSize:'8k',
    fileDetailType:'doc'
  },
  {corpId:'20190001',
    fileType:'网络拓扑图',
    fileTypeId:'4',
    fileName:'网络拓扑图文件',
    fileSize:'8k',
    fileDetailType:'png'
  },
  {corpId:'20190001',
    fileType:'服务器、网络设备资料',
    fileTypeId:'5',
    fileName:'服务器、网络设备资料文件',
    fileSize:'8k',
    fileDetailType:'doc'
  }
];

export default [
  {
    '/customFile/customFile': () => {
        return customFile
    }
  }
]
