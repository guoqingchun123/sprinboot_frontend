const projIds = [
{
  value: '1',
  label: '天津分行设备管理系统'
}, {
  value: '2',
  label: '天津分行星级考试系统'
}, {
  value: '3',
  label: '天津分行凭证影像采集系统'
}, {
  value: '4',
  label: '百思为科办公管理平台'
}, {
  value: '5',
  label: '房产系统'
}]
const taskIds = [
  {
    taskId: '1',
    pid: '1',
    label: '设备1'
  },
  {
    taskId: '2',
    pid: '1',
    label: '设备2'
  },
  {
    taskId: '3',
    pid: '1',
    label: '设备3'
  },
  {
    taskId: '1',
    pid: '2',
    label: '考试1'
  },
  {
    taskId: '2',
    pid: '2',
    label: '考试2'
  },
  {
    taskId: '3',
    pid: '2',
    label: '考试3'
  },
  {
    taskId: '1',
    pid: '3',
    label: '影像1'
  },
  {
    taskId: '2',
    pid: '3',
    label: '影像2'
  },
  {
    taskId: '3',
    pid: '3',
    label: '影像3'
  },
  {
    taskId: '1',
    pid: '4',
    label: '办公1'
  },
  {
    taskId: '2',
    pid: '4',
    label: '办公2'
  },
  {
    taskId: '3',
    pid: '4',
    label: '办公3'
  },
  {
    taskId: '1',
    pid: '5',
    label: '房产1'
  },
  {
    taskId: '2',
    pid: '5',
    label: '房产2'
  },
  {
    taskId: '3',
    pid: '5',
    label: '房产3'
  }
]
const auditDatas = [
  {
    scheduleId: '001',
    scheduleDate: '2019-03-17',
    empName: '云中鹤',
    briefing: '1.0 H ：bvtest--renwu1 ：1\n' +
    '2.0 H ：bvtest--renwu1 ：2',
    workHours: '3',
    state: '0000'
  },
  {
    scheduleId: '002',
    scheduleDate: '2019-03-19',
    empName: '云中鹤',
    briefing: '10.0 H ：bvtest--renwu1 ：阿萨德aaa',
    workHours: '10',
    state: '0001'
  },
  {
    scheduleId: '003',
    scheduleDate: '2019-03-18',
    empName: '云中鹤',
    briefing: '1.0 H ：bvtest--renwu1 ：222\n' +
    '7.0 H ：bvtest--renwu1 ：1111',
    workHours: '8',
    state: '0000'
  }
]

export default [
  {
    '/employ/projIds' : () => {
      return projIds
    },
    '/employ/taskIds' : () => {
      return taskIds
    },
    '/employ/auditDatas' : () => {
      return auditDatas
    }
  }
]