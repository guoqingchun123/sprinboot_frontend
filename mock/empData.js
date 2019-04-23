const empData =[
  {
    value: 'jishubu',
    label: '技术部',
    children: [{
        value: 'emp1',
        label: '刘备'
      }, {
        value: 'emp2',
        label: '诸葛亮'
      }, {
        value: 'emp3',
        label: '关羽'
      }, {
        value: 'emp4',
        label: '张飞'
     }, {
        value: 'emp5',
        label: '赵云',
      }, {
        value: 'emp6',
        label: '黄忠'
      }]
  },
  {
    value: 'chanpinbu',
    label: '产品部',
    children: [{
      value: 'emp7',
      label: '曹操'
    }, {
      value: 'emp8',
      label: '郭嘉'
    }, {
      value: 'emp9',
      label: '张辽'
    }, {
      value: 'emp10',
      label: '典韦'
    }, {
      value: 'emp11',
      label: '马超',
    }, {
      value: 'emp12',
      label: '许褚'
    }]
  },
  {
    value: 'renzibu',
    label: '人力资源部',
    children: [{
      value: 'emp13',
      label: '孙权'
    }, {
      value: 'emp14',
      label: '太史慈'
    }, {
      value: 'emp15',
      label: '甘宁'
    }, {
      value: 'emp16',
      label: '凌统'
    }, {
      value: 'emp17',
      label: '陆逊',
    }, {
      value: 'emp18',
      label: '周泰'
    }]
  }
];
export default [
    {
    '/empData/empData': () => {
      return empData
    },
  }
]
