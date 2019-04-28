<template>
  <div class="app-container">
    <bv-table ref="table" title="从业机构管理" :pagination="true" :filter.sync="filter" :fetch-api="queryCompanys" @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none" view="add" authority="add" @click="startCreate()">新增</bv-button>
        <bv-button show="one" view="modify" authority="modify" @click="startModify()">修改</bv-button>
        <bv-button show="oneOrMore" view="remove" authority="remove" @click="startRemove()">删除</bv-button>
        <bv-button @click="startExport()">导出</bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="审核日期:" prop="scheduleDate">
            <el-date-picker v-model="filter.scheduleDate" type="date" placeholder="请输入查询日期" value-format="yyyy-MM-dd" clearable />
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="false" prop="scheduleId" label="企业id" />
      <el-table-column v-if="false" prop="projId" label="企业编号" />
      <el-table-column prop="compName" label="企业名称" sortable />
      <el-table-column prop="compType" label="企业类别" />
      <el-table-column prop="state" label="状态" sortable :formatter="stateFormat" />
      <el-table-column prop="recTime" label="备案日期" />
    </bv-table>
    <bv-dialog title="从业机构新增" :visible.sync="dialogFormVisible"  fullscreen>
      <bv-form ref="dialogForm" :model="item" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="从业机构名称：" prop="compShortName" >
                <el-input  v-model="item.compShortName" class="edit-input"  filterable width="80%" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="从业机构简称：" prop="compName">
              <el-input  v-model="item.compName" class="edit-input"  ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="企业类别：" prop="compType">
              <el-select  v-model="item.compType" placeholder="请选择"    width="80%" >
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
              <el-select  v-model="item.devisionCode" placeholder="请选择" clearable >
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
              <el-input  v-model="item.creditCode" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="营业期限起始日期：" prop="creditDate">
              <el-date-picker
                v-model="item.creditDate"
                type="daterange"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="资质证书编号：" prop="qualifyNo">
              <el-input  v-model="item.qualifyNo" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="资质证书有效期：" prop="qualifyDate">
              <el-date-picker
                v-model="item.qualifyDate"
                type="daterange"
                range-separator="至"
                start-placeholder="起始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="注册地址:" prop="registerAddress">
              <el-input  v-model="item.registerAddress"  class="edit-input" size="small"  type="textarea"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系地址:" prop="contractAddress">
              <el-input  v-model="item.contractAddress" class="edit-input" size="small" type="textarea" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="邮政编码：" prop="postalCode">
              <el-input  v-model="item.postalCode" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系人：" prop="linkMan">
              <el-input  v-model="item.linkMan" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="联系电话：" prop="linkPhone">
              <el-input  v-model="item.linkPhone" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="传真：" prop="faxNo">
              <el-input  v-model="item.faxNo" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="电子邮件：" prop="email">
              <el-input  v-model="item.email" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="网站：" prop="website">
              <el-input  v-model="item.website" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="总经理：" prop="generalManager">
              <el-input  v-model="item.generalManager" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="法定代表人：" prop="legalName">
              <el-input  v-model="item.legalName" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="法人代表联系电话：" prop="legalPhone">
              <el-input  v-model="item.legalPhone" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="法定代表证件类型：" prop="legalCertType">
              <el-select  v-model="item.legalCertType" placeholder="请选择" clearable >
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
            <el-form-item label="法人代表证件号：" prop="legalPhone">
              <el-input  v-model="item.legalPhone" class="edit-input" size="small" ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="有职称专业人数：" prop="hasTitleNum">
              <el-input  v-model="item.hasTitleNum" class="edit-input" type="number" size="small" ></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="高级职称专业人数：" prop="highTitleNum">
              <el-input  v-model="item.highTitleNum" class="edit-input" size="small" type="number" ></el-input>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="在册人员总数：" prop="headCount">
              <el-input  v-model="item.headCount" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="中级职称人数：" prop="middleTitleNum">
              <el-input  v-model="item.middleTitleNum" class="edit-input" size="small" type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="初级级职称人数：" prop="primaryTitleNum">
              <el-input  v-model="item.primaryTitleNum" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="净资产（万元）：" prop="netAsset">
              <el-input  v-model="item.netAsset" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="总资产（万元）：" prop="totalAsset">
              <el-input  v-model="item.totalAsset" class="edit-input" size="small"  type="number"></el-input>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="注册资本：" prop="registerAsset">
              <el-input  v-model="item.registerAsset" class="edit-input" size="small" type="number"></el-input>
            </el-form-item>
          </bv-col>


          <bv-col>
            <el-form-item label="企业性质：" prop="corpProperty">
              <el-select  v-model="item.corpProperty" placeholder="请选择" clearable >
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
            <el-form-item label="成立日期：" prop="createDate">
              <el-date-picker v-model="item.createDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="批准从事业务日期：" prop="approveDate">
              <el-date-picker v-model="item.approveDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </bv-col>

          <bv-col>
            <el-form-item label="是否外来机构" prop="isForeign">
              <el-select  v-model="item.isForeign" placeholder="请选择" clearable >
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
              <el-select  v-model="item.isBranch" placeholder="请选择" clearable >
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
              <el-input  v-model="item.busiScope" class="edit-input" size="small" type="textarea"></el-input>
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
  import { fetchMySchedules, fetchProjInfos, fetchTaskInfos, insertMySchedule, deleteSchedule } from '@/api/employee/schedule'
  import { queryCompanys } from '@/api/custom/company'
  export default {
    name: 'MySchedule',
    data(){
      return {
        item: {},
        filter: {},
        tableInstance: {},
        scheduleState: null,
        fetchMySchedules,
        queryCompanys,
        dialogFormVisible: false,
        modifyType: null,
        projInfos: [],
        comPropertys:[
          {
            value: '100',
            label: '内资企业'
          },{
            value: '110',
            label: '国有企业'
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
        taskInfos: [],
        rules: {
          projId: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
          taskId: [
            { required: true, message: '请选择任务', trigger: 'change' }
          ],
          briefing: [
            { required: true, message: '请输入简报', trigger: 'blur' },
          ],
          workHours:[
            { required: true, message: '请输入实际投入工时'}
          ]
        }
      }
    },
    created() {
      this.$store.dispatch('app/fetchDicts', 'scheduleState').then(data => {
        this.scheduleState = data
      });
      fetchProjInfos().then(response => {
        this.projInfos = response.data
      })
    },
    methods: {
      //弹窗用
      initSchedule() {
        this.item = {}
      },
      stateFormat(row, column, cellValue) {
        let scheduleState = ''
        this.scheduleState.forEach((value)=>{
          if (cellValue == value.code) {
            scheduleState = value.name
          }
        })
        return scheduleState
      },
      //项目名称下拉菜单 on-change,级联查询
      projIdChange(projId) {
        let data = {
          projId: projId
        }
        fetchTaskInfos(data).then(response => {
          this.taskInfos = response.data
        })
      },
      startCreate() {
        this.dialogFormVisible = true
        this.modifyType = 'create'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      startModify() {
        this.item = {...this.tableInstance.table.selection[0]}
        this.projIdChange(this.item.projId)
        this.dialogFormVisible = true
        this.modifyType = 'modify'
        this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
      },
      cancelModify() {
        this.taskInfos = []
        this.initSchedule()
        this.dialogFormVisible = false
        this.modifyType = null
      },
      confirmModify() {
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }

          if (this.modifyType === 'modify') {
            /*modifyRole(item).then(() => {
              this.tableInstance.table.clearSelection()
              this.afterModify()
            })*/
          } else {
            insertMySchedule(this.item).then(() => {
              this.afterModify()
            })
          }
        })
      },
      afterModify() {
        this.taskInfos = []
        this.tableInstance.fetchData()
        this.initSchedule()
        this.dialogFormVisible = false
        this.modifyType = null
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      startRemove() {
        this.$confirm('此操作将删除该行事历, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let selection = this.$refs.table.selection
          deleteSchedule(selection.map(item => item.scheduleId).join()).then(() => {
            this.tableInstance.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
      },
      startExport() {
        console.log(this.scheduleState)
      }
    }
  }
</script>
