const presaleProjInfo = [
  {"presaleProjId":"1041164080","presaleNo":"H_19007","projField":"0003","projName":"金融项目4","projDept":"000100","saleManager":"0157","presalePerson":"500,070,009","saleProj":"BV_16188","technoProj":"","fileNo":"0","manageUser":"19008","manageTime":"2019/3/13 18:03","modifyTime":"2019/3/13 18:05","remark":"","state":"0001","projDeptName":"总经理办","presalePersonName":"李增涛,朱明亮,韩圆圆","saleProjName":"测试项目十四","technoProjName":"","deptManagers":"[0001]"},
  {"presaleProjId":"1135039311","presaleNo":"H_18001","projField":"0003","projName":"金融项目","projDept":"000100","saleManager":"0001","presalePerson":"1","saleProj":"BV_16188","technoProj":"","fileNo":"0","manageUser":"100001","manageTime":"2018/12/4 14:23","modifyTime":"2019/3/14 8:50","remark":"","state":"0001","projDeptName":"销售部,总经理办","presalePersonName":"王云涌","saleProjName":"测试项目十四","technoProjName":"","deptManagers":"[0001]"},
  {"presaleProjId":"1165648777","presaleNo":"F_18002","projField":"0002","projName":"金融项目4","projDept":"0002","saleManager":"0002","presalePerson":"50,001","saleProj":"","technoProj":"","fileNo":"0","manageUser":"100001","manageTime":"2018/12/4 14:24","modifyTime":"2019/3/13 14:34","remark":"","state":"0001","projDeptName":"市场/客服部","presalePersonName":"王云涌,李增涛","saleProjName":"","technoProjName":"","deptManagers":"[0005]"},
  {"presaleProjId":"1399555449","presaleNo":"C_18003","projField":"0001","projName":"金融项目5","projDept":"000100","saleManager":"0157","presalePerson":"90,013","saleProj":"","technoProj":"","fileNo":"0","manageUser":"100001","manageTime":"2018/12/4 14:34","modifyTime":"2019/3/13 18:00","remark":"","state":"0001","projDeptName":"销售部,总经理办","presalePersonName":"韩圆圆,杨涛","saleProjName":"","technoProjName":"","deptManagers":"[0001]"},
  {"presaleProjId":"1684462801","presaleNo":"H_19008","projField":"0003","projName":"聊城维修资金项目","projDept":"0001,000100","saleManager":"0157","presalePerson":"900,130,258","saleProj":"BV_16188","technoProj":"BV_16188,BV_16189","fileNo":"0","manageUser":"100001","manageTime":"2019/3/14 8:49","modifyTime":"2019/3/14 8:50","remark":"","state":"0001","projDeptName":"销售部,总经理办","presalePersonName":"韩圆圆,杨涛,发顺丰","saleProjName":"测试项目十四","technoProjName":"测试项目十四,测试项目十三","deptManagers":"[0008, 0001]"},
  {"presaleProjId":"2091957563","presaleNo":"C_18006","projField":"0001","projName":"金融项目4","projDept":"0005,0008,0009","saleManager":"0008","presalePerson":"90,013","saleProj":"","technoProj":"","fileNo":"0","manageUser":"19008","manageTime":"2018/12/5 11:24","modifyTime":"2018/12/5 11:24","remark":"","state":"0000","projDeptName":"金融部,测试部,技术部","presalePersonName":"韩圆圆,杨涛","saleProjName":"","technoProjName":"","deptManagers":"[0004, 0011, 0003]"},
  {"presaleProjId":"509918994","presaleNo":"F_18004","projField":"0002","projName":"金融项目1","projDept":"0005,0007","saleManager":"0007","presalePerson":"90,013","saleProj":"","technoProj":"","fileNo":"0","manageUser":"100001","manageTime":"2018/12/4 14:35","modifyTime":"2018/12/4 14:35","remark":"","state":"0000","projDeptName":"金融部,人力资源部","presalePersonName":"韩圆圆,杨涛","saleProjName":"","technoProjName":"","deptManagers":"[0004, 0011]"},
  {"presaleProjId":"553857922","presaleNo":"H_19009","projField":"0003","projName":"金融项目","projDept":"000100,0002,0003","saleManager":"0001","presalePerson":"50,007","saleProj":"BV_16188,BV_16189,BV_16190","technoProj":"BV_1611,BV_16189","fileNo":"0","manageUser":"100001","manageTime":"2019/3/19 11:33","modifyTime":"2019/3/19 11:33","remark":"","state":"0000","projDeptName":"总经理办,市场/客服部,财务部","presalePersonName":"李增涛,朱明亮","saleProjName":"测试项目十四,测试项目十三,测试项目十二","technoProjName":"金融项目33,测试项目十三","deptManagers":"[0001, 0005, 0002]"},
  {"presaleProjId":"978917965","presaleNo":"F_18005","projField":"0002","projName":"金融项目1","projDept":"000100","saleManager":"0007","presalePerson":"50,007","saleProj":"BV_17028,BV_17029","technoProj":"BV_17027,BV_17028","fileNo":"0","manageUser":"19008","manageTime":"2018/12/4 14:37","modifyTime":"2018/12/5 17:54","remark":"","state":"0000","projDeptName":"销售部,总经理办","presalePersonName":"李增涛,朱明亮","saleProjName":"秦皇岛昌黎县维修资金系统与用友财务系统接口开发,青州预售网签及资金监管升级","technoProjName":"山西省运城市平陆县维修资金系统,秦皇岛昌黎县维修资金系统与用友财务系统  接口开发","deptManagers":"[0001]"},

]
export default [
    {
    '/presaleProj/presaleProjInfo': () => {
      return presaleProjInfo
    }
  }
]