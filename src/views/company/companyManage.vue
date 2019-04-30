<template>
  <div class="app-container">
    <bv-table ref="table" title="从业机构管理" :pagination="true" :filter.sync="filter" :fetch-api="queryCompanys"  @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="机构名称:" prop="compName">
            <el-input v-model="filter.compName" clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="机构简称:" prop="compShortName">
            <el-input v-model="filter.compShortName"  clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="机构编号:" prop="compId">
            <el-input v-model="filter.compId"  clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="法定代表人:" prop="legalName">
            <el-select v-model="filter.legalName"  clearable />
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="机构类别：" prop="compType">
            <el-select  v-model="filter.compType" placeholder="请选择"    width="80%" >
              <el-option
                v-for="item in compTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="状态：" prop="compState">
            <el-select  v-model="filter.compState" placeholder="请选择"    width="80%" >
              <el-option
                v-for="item in compStateS"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" prop="bcGuid" label="企业id" />
      <el-table-column v-if="false" prop="compId" label="企业编号" />
      <el-table-column prop="compName" label="机构名称" sortable />
      <el-table-column prop="compShortName" label="机构简称" sortable />
      <el-table-column prop="compId" label="机构编号" sortable />
      <el-table-column prop="compType" label="机构类别"   :formatter="compTypesFormat"/>
      <el-table-column prop="legalName" label="法定代表人"  />
      <el-table-column prop="compState" label="状态"  :formatter="compStateFormat" />
      <el-table-column prop="reqTime" label="申请日期" />
    </bv-table>
    <bv-dialog title="从业机构新增" :visible.sync="dialogFormVisible"  width="70%">
      <bv-form ref="dialogForm" :model="company" :rules="rules"  label-width="160px">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="从业机构名称：" prop="compName" >
                <el-input  v-model="company.compName" class="edit-input"  filterable width="80%" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="从业机构简称：" prop="compShortName">
              <el-input  v-model="company.compShortName" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="企业类别：" prop="compType">
              <el-select  v-model="company.compType" placeholder="请选择"    width="80%" >
                  <el-option
                    v-for="item in compTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="所属行政区：" prop="devisionCode">
              <el-select  v-model="company.devisionCode" placeholder="请选择" clearable >
                <el-option
                  v-for="item in devisionCodeS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="统一社会信用代码：" prop="creditCode">
              <el-input  v-model="company.creditCode" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="营业期限起始日期：" prop="creditDate"   width="80%">
              <el-date-picker
                v-model="company.creditDate"
                type="daterange"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="资质证书编号：" prop="qualifyNo">
              <el-input  v-model="company.qualifyNo" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
           <el-form-item label="资质证书有效期：" prop="qualifyDate">
              <el-date-picker
                v-model="company.qualifyDate"
                type="daterange"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="企业性质：" prop="corpProperty">
              <el-select  v-model="company.corpProperty" placeholder="请选择" clearable >
                <el-option
                  v-for="item in comPropertys"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="资质等级：" prop="qualifyGrade">
              <el-select  v-model="company.qualifyGrade" placeholder="请选择" clearable >
                <el-option
                  v-for="item in qualifyGradeS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="注册地址:" prop="registerAddress">
              <el-input  v-model="company.registerAddress"  class="edit-input"  type="textarea"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系地址:" prop="contractAddress">
              <el-input  v-model="company.contractAddress" class="edit-input"  type="textarea" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系人：" prop="linkMan">
              <el-input  v-model="company.linkMan" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系电话：" prop="linkPhone">
              <el-input  v-model="company.linkPhone" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="邮政编码：" prop="postalCode">
              <el-input  v-model="company.postalCode" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="传真：" prop="faxNo">
              <el-input  v-model="company.faxNo" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="电子邮件：" prop="email">
              <el-input  v-model="company.email" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="网站：" prop="website">
              <el-input  v-model="company.website" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="总经理：" prop="generalManager">
              <el-input  v-model="company.generalManager" class="edit-input"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="法定代表人：" prop="legalName">
              <el-input  v-model="company.legalName" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="法人代表联系电话：" prop="legalPhone">
              <el-input  v-model="company.legalPhone" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="法定代表证件类型：" prop="legalCertType">
              <el-select  v-model="company.legalCertType" placeholder="请选择" clearable >
                <el-option
                  v-for="item in certTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="法人代表证件号：" prop="legalCertNo">
              <el-input  v-model="company.legalCertNo" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="有职称专业人数：" prop="hasTitleNum">
              <el-input  v-model="company.hasTitleNum" class="edit-input" type="number" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="高级职称专业人数：" prop="highTitleNum">
              <el-input  v-model="company.highTitleNum" class="edit-input" size="small" type="number" ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="在册人员总数：" prop="headCount">
              <el-input  v-model="company.headCount" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="中级职称人数：" prop="middleTitleNum">
              <el-input  v-model="company.middleTitleNum" class="edit-input" size="small" type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="初级级职称人数：" prop="primaryTitleNum">
              <el-input  v-model="company.primaryTitleNum" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="净资产（万元）：" prop="netAsset">
              <el-input  v-model="company.netAsset" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="总资产（万元）：" prop="totalAsset">
              <el-input  v-model="company.totalAsset" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="注册资本：" prop="registerAsset">
              <el-input  v-model="company.registerAsset" class="edit-input" size="small" type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="成立日期：" prop="createDate">
              <el-date-picker v-model="company.createDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="批准从事业务日期：" prop="approveDate">
              <el-date-picker v-model="company.approveDate" type="date" placeholder="选择日期"  value-format="yyyy-MM-dd" ></el-date-picker>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="是否外来机构" prop="isForeign">
              <el-select  v-model="company.isForeign" placeholder="请选择" clearable >
                <el-option
                  v-for="item in yesOrNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="是否分支机构" prop="isBranch">
              <el-select  v-model="company.isBranch" placeholder="请选择" clearable >
                <el-option
                  v-for="item in yesOrNo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="经营范围" prop="busiScope">
              <el-input  v-model="company.busiScope" class="edit-input" size="small" type="textarea"></el-input>
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirmModify()">保存</bv-button>
        <bv-button view="cancel" @click="cancelModify()">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>

<script>
  import { queryCompanys ,insertCompany ,deleteCompany ,updateCompany} from '@/api/custom/company'
  export default {
    name: 'company',
    data(){
      var validatePhone = (rule,value,callback) => {
          if(/^1[34578]\d{9}$/.test(value) == false){
            callback(new Error("请输入正确的手机号"));
          }else{
            callback();
          }
        };
      return {
        company: {},
        filter: {
          compName:'',
          compShortName:'',
          compId:'',
          legalName:'',
          compState:'',
          compType:'',
          reqTime:''
        },

        tableInstance: {},
        queryCompanys,
        dialogFormVisible: false,
        modifyType: null,
        compStateS:[
          {
            value: '00',
            label: '正常'
          },{
            value: '02',
            label: '提交'
          }
        ],
        comPropertys:[
          {
            value: '100',
            label: '内资企业'
          },{
            value: '110',
            label: '国有企业'
          }
        ],
        qualifyGradeS:[
          {
            value: '1',
            label: '一级'
          },{
            value: '2',
            label: '二级'
          }
        ],
        yesOrNo:[
          {
            value: '0',
            label: '是'
          },
          {
            value: '1',
            label: '否'
          }
        ],
        certTypes:[
          {
            value: '1',
            label: '身份证'
          }
        ],
        devisionCodeS:[{
          value: '1',
          label: '济南'
        }],
        compTypes:[ {
          value: '1',
          label: '房地产开发企业'
        }, {
          value: '2',
          label: '房地产经纪机构'
        }, {
          value: '3',
          label: '房地产评估机构'
        }, {
          value: '4',
          label: '物业服务企业'
        },
          {
            value: '5',
            label: '房屋测绘机构'
          },
          {
            value: '6',
            label: '业主委员会'
          },
          {
            value: '7',
            label: '居委会'
          },
          {
            value: '8',
            label: '街道办事处'
          },
          {
            value: '9',
            label: '监理机构'
          },
          {
            value: '10',
            label: '审计机构'
          },
          {
            value: '11',
            label: '租赁企业'
          },
          {
            value: '12',
            label: '维修企业'
          },{
            value: '99',
            label: '其他企业'
          }],
        //后台请求的任务数据
        rules: {
          compShortName: [
            { required: true, message: '请填写企业简称', trigger: 'blur'  }
          ],
          compName: [
            { required: true, message: '请填写企业名称', trigger: 'blur' },
            { max:50, message: '最大不超过50个字', trigger: 'blur' }
          ],
          compType: [
            { required: true, message: '请选择企业类型', trigger: 'change' },
          ],
          devisionCode:[
            { required: true, message: '请选择所在行政区',trigger: 'change'}
          ],
          creditCode:[
            { required: true, message: '请填写统一社会信用代码',trigger: 'blur'}
          ],
          qualifyNo:[
            { required: true, message: '请填写资质证书编号',trigger: 'blur'}
          ],
          linkMan:[
            { required: true, message: '请填写联系人',trigger: 'blur'}
          ],
          legalName:[
            { required: true, message: '请填写法定代表人' ,trigger: 'change'}
          ],
          corpProperty:[
            { required: true, message: '请选择企业性质',trigger: 'change'}
          ],
          qualifyGrade:[
            { required: true, message: '请选择资质等级',trigger: 'change'}
          ],
          generalManager:[
            { required: true, message: '请填写总经理姓名',trigger: 'blur'}
          ],
          legalPhone:[
            {required: true ,  message: '请输入手机号码', trigger: 'blur'}
            ,{validator:validatePhone ,trigger: 'blur'},
          ],
          linkPhone:[
            {required: true ,  message: '请输入手机号码', trigger: 'blur'}
            , {validator:validatePhone ,trigger: 'blur'},
          ],

        }
      }
    },
    created() {
    },
    methods: {
      compTypesFormat(row){
        for (let i = 0; i < this.compTypes.length; i++) {
          if (this.compTypes[i].value === row.compType) {
            return this.compTypes[i].label;
          }
        }
      },
      compStateFormat(row){
        for (let i = 0; i < this.compStateS.length; i++) {
          if (this.compStateS[i].value === row.compState) {
            return this.compStateS[i].label;
          }
        }
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.company = {...this.tableInstance.table.selection[0]}
        this.dialogFormVisible = true
        this.modifyType = 'modify'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.dialogFormVisible = false
        this.modifyType = null
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }

          if (this.modifyType === 'modify') {
            //将修改的数据更新到数据库
            updateCompany(this.company).then(res =>{
              this.afterModify(res)
            })
          } else {
            insertCompany(this.company).then(res => {
              this.afterModify(res)
            })
          }
        })
      },
      afterModify(res) {
        if(res.data.level=="success"){
          this.tableInstance.fetchData()
          this.dialogFormVisible = false
          this.modifyType = null
        }
        this.$message({
          message:res.data.retMsg,type: res.data.level
        })

      },
      startRemove() {
        this.$confirm('此操作将删除该从业机构信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCompany(this.tableInstance.table.selection.map(item => item.bcGuid).join()).then(() => {
            this.tableInstance.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
      },
    }
  }
</script>
