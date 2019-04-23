 const customFileTree=[
   {corpId:'20190001',
     id: 1,
     label: "全部分类",
     children: [
       {
         id: 2,
         label: "系统集成报告",
       },
       {
         id: 3,
         label: "项目验收报告",
       },
       {
         id: 4,
         label: "网络拓扑图",
       },
       {
         id: 5,
         label: "服务器、网络设备资料",
       },
       {
         id: 6,
         label: "操作手册",
       },
       {
         id: 7,
         label: "其他",
       },
       {
         id: 8,
         label: "项目交接文件",
       },
       {
         id: 9,
         label: "需求说明书",
       },
       {
         id: 10,
         label: "小区信息导入模板",
       },
       {
         id: 11,
         label: "财务连接密码详解",
       },
     ]
   },
   {corpId:'20190002',
     id: 1,
     label: "全部分类",
     children: [
       {
         id: 2,
         label: "系统集成报告",
       },
       {
         id: 3,
         label: "项目验收报告",
       },
       {
         id: 4,
         label: "网络拓扑图",
       },
       {
         id: 5,
         label: "服务器、网络设备资料",
       },
       {
         id: 6,
         label: "操作手册",
       },
       {
         id: 7,
         label: "其他",
       },
       {
         id: 8,
         label: "项目交接文件",
       },
       {
         id: 9,
         label: "需求说明书",
       },
       {
         id: 10,
         label: "小区信息导入模板",
       },
       {
         id: 11,
         label: "财务连接密码详解",
       },
     ]
   }
 ];

 export default [
   {
   '/customFileTree/customFileTree': () => {
     return customFileTree
   }
  }
]
