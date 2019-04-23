const areas = [{"code":"0001","name":"区域","children":[{"code":"120000","name":"天津工行","areaId":"120000","areaName":"天津工行","areaTime":"早九晚五","showOrder":"1",
"children":[{"code":"120009","name":"测试区域","areaId":"120009","areaName":"测试区域","areaTime":"早九晚五","showOrder":"1"}]},{"code":"370100","name":"济南",
"areaId":"370100","areaName":"济南","areaTime":"早九晚五","showOrder":"2", "children":[{"code":"370101","name":"总部","areaId":"370101","areaName":"总部","areaTime":
"早九晚五","showOrder":"1"},{"code":"370102","name":"济南中心银行","areaId":"370102","areaName":"济南中心银行","areaTime":"早九晚五","showOrder":"2"}]},{"code":"370200",
"name":"青岛","areaId":"370200","areaName":"青岛","areaTime":"早九晚五","showOrder":"3","children":[{"code":"370201", "name":"青岛金融","areaId":"370201","areaName":
"青岛金融","areaTime": "早九晚五","showOrder":"1"},{"code": "370202","name":"青岛工行","areaId":"370202","areaName": "青岛工行","areaTime": "早九晚五","showOrder":"2"},
{"code":"370203","name":"青岛崂山","areaId":"370203","areaName": "青岛崂山","areaTime": "早九晚五","showOrder":"3"},{"code":"370204","name":"青岛测试","areaId":"370204",
"areaName": "青岛测试","areaTime": "早九晚五","showOrder":"4"}]}]}]

const depts = [{"code":"0001","name":"部门","children":[{"code":"10001","name":"销售部","deptName":"销售部","contactName":"鲍明明","contactPhone":"15231245698"},{"code":
"10002","name":"总经理办","deptName":"总经理办","contactName":"王云涌","contactPhone":"13805313432"},{"code":"10003", "name":"市场/客服部", "deptName":"销售部",
"contactName":"鲍明明","contactPhone":"15231245698"},{"code":"10004", "name":"财务部","deptName":"财务部", "contactName":"孟丽丽","contactPhone":"13969056769"},
{"code":"10005", "name":"房产业务部","deptName":"房产业务部", "contactName":"朱明亮","contactPhone":"15203697851"},{"code":"10006", "name":"金融部","deptName":
"金融部", "contactName":"宁建华","contactPhone":"13864136700"},{"code":"10007", "name":"人力资源部","deptName":"人力资源部", "contactName":"徐淑允","contactPhone":
"18765837902"},{"code":"10008", "name":"测试部","deptName":"测试部", "contactName":"徐淑允","contactPhone":"18765837902"},{"code":"10009", "name":"技术部",
"deptName":"技术部", "contactName":"李华","contactPhone":"13505312362","children":[{"code":"1000901", "name":"产品研发中心","deptName":"产品研发中心", "contactName":
"刘建凯","contactPhone":"15269154702"},{"code":"1000902", "name":"移动开发部（济南）","deptName":"移动开发部（济南）", "contactName":"孙秋敬","contactPhone":"18953129489"},
{"code":"1000903", "name":"移动开发部（青岛）","deptName":"移动开发部（青岛）","contactName":"谢旭","contactPhone":"13188886467"},{"code":"1000904", "name":"互金部",
"deptName":"互金部", "contactName":"刘庆祥","contactPhone":"15666662950"}]}]}]

export default [
  {
    '/employ/areaManage': () => {
      return areas
    },
    '/employ/deptManage': () => {
      return depts
    }
  }
]