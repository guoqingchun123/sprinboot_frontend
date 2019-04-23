const travels = [{"travelMonth":"2018-1","empId":"0037","empName":"王松","postName":"P4","deptName":"产品研发","startDate":"2018-1-3","endDate":"2018-1-4","travelPlace":"德州",
"projIdName":"(BV_17009)德州市预售资金监管","feeType":"差旅补贴","days":"1.5","travelAmount":"50","totalAmount":"75","payProid":"2018-01","vstingPriod":"","travelFlag":"已执行"},
{"travelMonth":"2018-08","empId":"0024","empName":"王聪聪","postName":"P4","deptName":"房产业务部","startDate":"2018-8-2","endDate":"2018-8-2","travelPlace":"枣庄", "projIdName":
"(BV_17009)德州市预售资金监管","feeType":"差旅补贴","days":"1","travelAmount":"65","totalAmount":"65","payProid":"2018-08","vstingPriod":"","travelFlag":"已执行"},{"travelMonth"
:"2018-08","empId":"0096","empName":"杨彬彬","postName":"P6","deptName":"产品研发","startDate":"2018-8-1","endDate":"2018-8-2","travelPlace":"陵城", "projIdName":"(BV_17030)陵城"+
"预售资金监管","feeType":"差旅补贴","days":"2","travelAmount":"70","totalAmount":"140","payProid":"2018-08","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-08",
"empId":"0108","empName":"张月林","postName":"P2","deptName":"产品研发","startDate":"2018-8-1","endDate":"2018-8-3","travelPlace":"青州", "projIdName":""
,'feeType':"差旅补贴","days":"3","travelAmount":"60","totalAmount":"180","payProid":"2018-08","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-08","empId":"0111",
"empName":"周龙杰","postName":"P2","deptName":"房产业务部","startDate":"2018-8-1","endDate":"2018-8-3","travelPlace":"沧州", "projIdName":"(BV_17045)沧州县市财务升级","feeType":
"差旅补贴","days":"3","travelAmount":"60","totalAmount":"180","payProid":"2018-08","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-08","empId":"0114","empName":
"刘汝泽","postName":"P3","deptName":"产品研发","startDate":"2018-8-1","endDate":"2018-8-2","travelPlace":"陵城", "projIdName":"(BV_17030)陵城预售资金监管","feeType":"差旅补贴",
"days":"2","travelAmount":"60","totalAmount":"120","payProid":"2018-08","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-07","empId":"0001","empName":"王云涌",
"postName":"M4","deptName":"公司","startDate":"2018-7-5","endDate":"2018-7-5","travelPlace":"聊城", "projIdName":"(BV_17050)聊城维修资金升级","feeType":"差旅补贴",
"days":"1","travelAmount":"70","totalAmount":"70","payProid":"2018-07","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-07","empId":"0002","empName":"孟丽丽",
"postName":"M4","deptName":"财务部","startDate":"2018-7-12","endDate":"2018-7-13","travelPlace":"秦皇岛", "projIdName":"","feeType":"差旅补贴",
"days":"2","travelAmount":"70","totalAmount":"140","payProid":"2018-07","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-07","empId":"0002","empName":"孟丽丽",
"postName":"M4","deptName":"财务部","startDate":"2018-7-2","endDate":"2018-7-5","travelPlace":"西宁", "projIdName":"","feeType":"差旅补贴",
"days":"4","travelAmount":"70","totalAmount":"280","payProid":"2018-07","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-07","empId":"0005","empName":"李增涛",
"postName":"M3","deptName":"市场部","startDate":"2018-07-09","endDate":"2018-07-12","travelPlace":"廊坊", "projIdName":"","feeType":"差旅补贴",
"days":"4.5","travelAmount":"70","totalAmount":"315","payProid":"2018-07","vstingPriod":"","travelFlag":"已执行"},{"travelMonth":"2018-07","empId":"0005","empName":"李增涛",
"postName":"M3","deptName":"市场部","startDate":"2018-07-21","endDate":"2018-07-23","travelPlace":"秦皇岛", "projIdName":"","feeType":"差旅补贴",
"days":"3","travelAmount":"70","totalAmount":"210","payProid":"2018-07","vstingPriod":"","travelFlag":"已执行"}]

export default [
  {
    '/employee/listTravel': () => {
      return travels
    }
  }
]