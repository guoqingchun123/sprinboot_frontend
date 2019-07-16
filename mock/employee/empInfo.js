var employees = [{empId:'0001',empName:'0001',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0002',empName:'0002',empState:'正常',endDate:'2019-08-13',postId:'P2',phoneNo:'13702311253'},
{empId:'0003',empName:'0003',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0004',empName:'0004',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0005',empName:'0005',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0006',empName:'0006',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0007',empName:'0007',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0008',empName:'0008',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0009',empName:'0009',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0010',empName:'0010',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0011',empName:'0011',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0012',empName:'0012',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0013',empName:'0013',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0014',empName:'0014',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0015',empName:'0015',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0016',empName:'0016',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0017',empName:'0017',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0018',empName:'0018',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0019',empName:'0019',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0021',empName:'0021',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0022',empName:'0022',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0023',empName:'0023',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0024',empName:'0024',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0025',empName:'0025',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0026',empName:'0026',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0027',empName:'0027',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0028',empName:'0028',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0029',empName:'0029',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0030',empName:'0030',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0031',empName:'0031',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'},
{empId:'0032',empName:'0032',empState:'未开户',endDate:'2019-08-13',postId:'M4',phoneNo:'13702311253'}]

const deptName = [{value:'0001',label:'技术部'},{value:'0002',label:'产品研发中心'},{value:'0003',label:'金融部'},{value:'0004',label:'房产业务部'},
  {value:'0005',label:'财务部'},{value:'0006',label:'人力资源部'},{value:'0007',label:'销售部'},{value:'0008',label:'测试部'},{value:'0008',label:'客服部'}
]

const postId = [{value:'P1',label:'P1'},{value:'P2',label:'P2'},{value:'P3',label:'P3'},{value:'P4',label:'P4'},{value:'P5',label:'P5'},{value:'P6',label:'P6'},
  {value:'P7',label:'P7'},{value:'P8',label:'P8'},{value:'M1',label:'M1'},{value:'M2',label:'M2'},{value:'M3',label:'M3'},{value:'M4',label:'M4'},
  {value:'S1',label:'S1'},{value:'S2',label:'S2'},{value:'S3',label:'S3'},{value:'S4',label:'S4'},{value:'S5',label:'S5'},{value:'S6',label:'S6'},
  {value:'S7',label:'S7'},{value:'S8',label:'S8'}]

const areas =[{value:'0001',label:'济南总部'},{value:'0002',label:'天津工行'},{value:'0003',label:'济南中信银行'},{value:'0004',label:'青岛'},
  {value:'0005',label:'海尔金融'},{value:'0006',label:'青岛工行'},{value:'0007',label:'青岛崂山'},{value:'0008',label:'青岛测试'}]

const supervisors = [{value:'王云涌',code:'0001'},{value:'李华',code:'0002'},{value:'徐淑允',code:'0003'},{value:'孟丽丽',code:'0004'},
  {value:'刘建凯',code:'0005'},{value:'朱明亮',code:'0006'},{value:'李增涛',code:'0007'},{value:'宁建华',code:'0008'},{value:'葛泽臣',code:'0009'},
  {value:'孙震',code:'0010'},{value:'王慧',code:'0011'}]

const tableDatas = {employees1:employees,deptName1:deptName,postId1:postId,areas1:areas,supervisors1:supervisors}

export default [
  {
    '/employ/empInfo' : () => {
      return employees
    },
    '/employ/tableDatas' : () =>{
      return tableDatas
    }
  }
]