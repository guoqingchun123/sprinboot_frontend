const approveLog=[
  {"approveId":"67d7b640-133d-40c7-a47c-91297e6a48c0","projId":"BV_1619","flowState":"0001","result":"0","approveOpinion":"很好","technologyLeader":"157","projManager":"189","manageUser":"19008","manageTime":"2019/3/13 17:16","remark1":"123","remark2":"2222222"},
  {"approveId":"84870f54-4c70-4e7b-9f6f-618060e1c546","projId":"BV_1611","flowState":"0000","result":"0","approveOpinion":"同意","technologyLeader":"157","projManager":"","manageUser":"100001","manageTime":"2019/3/13 17:10","remark1":"小伙子加油干","remark2":""},
  {"approveId":"8c8e83e2-9390-4bf1-99c5-a257cbed1c67","projId":"BV_16199","flowState":"0002","result":"0","approveOpinion":"同意","technologyLeader":"157","projManager":"189","manageUser":"19010","manageTime":"2018/11/8 17:21","remark1":"阿还得把","remark2":"gtrhf"},
  {"approveId":"a5ab32c9-4ea1-45da-94a7-4b0224609d92","projId":"bvtest1","flowState":"0000","result":"0","approveOpinion":"ab","technologyLeader":"1","projManager":"","manageUser":"100001","manageTime":"2019/3/18 11:37","remark1":"20190319","remark2":""},
  {"approveId":"b5931c7a-9855-4c2e-ad40-39570270433f","projId":"BV_16188","flowState":"0002","result":"0","approveOpinion":"同意","technologyLeader":"157","projManager":"189","manageUser":"19010","manageTime":"2018/11/27 15:11","remark1":"好好干","remark2":"好好哈哈"},
  {"approveId":"c1ec9cb3-d29d-4e7f-9cac-a7c0bd911b37","projId":"BV_16198","flowState":"0002","result":"0","approveOpinion":"同意","technologyLeader":"157","projManager":"189","manageUser":"19010","manageTime":"2018/11/26 13:30","remark1":"77","remark2":"0"},
  {"approveId":"d70a0403-e2f2-4085-8d7d-c5e8ebcc4ed4","projId":"bvtest","flowState":"0000","result":"0","approveOpinion":"流程1","technologyLeader":"1","projManager":"","manageUser":"100001","manageTime":"2019/3/13 10:16","remark1":"","remark2":""},
  {"approveId":"f31ec84d-0649-4bbe-93e2-07a9b15220fd","projId":"BV_16200","flowState":"0000","result":"0","approveOpinion":"同意","technologyLeader":"49","projManager":"","manageUser":"19011","manageTime":"2018/11/8 16:36","remark1":"好","remark2":""},
  {"approveId":"f880d689-c588-49d5-bd43-08af6e8f4d1e","projId":"BV_16197","flowState":"0000","result":"0","approveOpinion":"同意","technologyLeader":"157","projManager":"","manageUser":"19011","manageTime":"2018/11/26 13:23","remark1":"888","remark2":""},
  {"approveId":"0ecfd9d3-789d-4069-ae71-d0dd931c4bd7","projId":"BV_16189","flowState":"0000","result":"1","approveOpinion":"不同意","technologyLeader":"157","projManager":"","manageUser":"100001","manageTime":"2019/3/13 17:15","remark1":"222","remark2":""},

]
export default [
  {
    '/basicProj/approveLog': () => {
      return approveLog
    }
  }
]