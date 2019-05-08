<template>
  <bv-dialog title="维护项目信息" :visible.sync="visible" :show-close="showClose">
    <el-form ref="dialogForm" :model="project" :rules="rules" label-width="150px">
      <bv-row layout="dialog-2">
        <bv-col>
          <el-form-item label="项目名称：" prop="projectName" >
            <el-input  v-model="project.projectName" class="edit-input"  filterable width="80%" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="销售名称：" prop="saleName">
            <el-input  v-model="project.saleName" class="edit-input"  ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="行政区域：" prop="divisionCode">
            <el-select  v-model="project.divisionCode" placeholder="请选择"    width="80%" >
              <el-option
                v-for="item in divisionCodes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="地址:" prop="address">
            <el-input  v-model="project.address" class="edit-input"  type="textarea" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="开发企业：" prop="companyId">
            <el-select  v-model="project.companyId" placeholder="请选择" clearable >
              <el-option
                v-for="item in companys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="物业企业：" prop="serviceId">
            <el-select  v-model="project.serviceId" placeholder="请选择" clearable >
              <el-option
                v-for="item in companys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="业务委员会：" prop="ownerId">
            <el-select  v-model="project.ownerId" placeholder="请选择" clearable >
              <el-option
                v-for="item in companys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="开盘日期：" prop="openDate">
            <el-date-picker
              v-model="project.openDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="入住日期：" prop="admitDate">
            <el-date-picker
              v-model="project.admitDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </bv-col>


        <bv-col>
          <el-form-item label="售楼电话：" prop="salePhone">
            <el-input  v-model="project.salePhone" class="edit-input"  ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="售楼地址:" prop="saleAddress">
            <el-input  v-model="project.saleAddress" class="edit-input"  type="textarea" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="总套数：" prop="totalNum">
            <el-input  v-model="project.totalNum" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="建筑面积：" prop="totalArea">
            <el-input  v-model="project.totalArea" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="四至范围：" prop="boundArea">
            <el-input  v-model="project.boundArea" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="占地面积：" prop="coverArea">
            <el-input  v-model="project.coverArea" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="自然幢数：" prop="bldNum">
            <el-input  v-model="project.bldNum" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="项目简介:" prop="projectDesribe">
            <el-input  v-model="project.projectDesribe" class="edit-input"  type="textarea" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="设备装修情况:" prop="fitment">
            <el-input  v-model="project.fitment" class="edit-input"  type="textarea" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="配套设施:" prop="supporting">
            <el-input  v-model="project.supporting" class="edit-input"  type="textarea" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="周围交通:" prop="traffic">
            <el-input  v-model="project.traffic" class="edit-input"  type="textarea" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="绿化率:" prop="greenPercent">
            <el-input  v-model="project.greenPercent" class="edit-input"  type="edit-input" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="容积率:" prop="plotratio">
            <el-input  v-model="project.plotratio" class="edit-input"  type="edit-input" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="建筑密度:" prop="buildingDensity">
            <el-input  v-model="project.buildingDensity" class="edit-input"  type="edit-input" ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="车位个数：" prop="parkingNum">
            <el-input  v-model="project.parkingNum" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="板块编号：" prop="plateNo">
            <el-input  v-model="project.plateNo" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="土地投资（万元）：" prop="landInvest">
            <el-input  v-model="project.landInvest" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="计划总建筑面积：" prop="planTotalArea">
            <el-input  v-model="project.planTotalArea" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="计划总投资（万元）：" prop="planTotalInvest">
            <el-input  v-model="project.planTotalInvest" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="计划开工时间：" prop="planOpenDate">
            <el-date-picker
              v-model="project.planOpenDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="计划竣工时间：" prop="planFinishDate">
            <el-date-picker
              v-model="project.planFinishDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="实际完成投资（万元）：" prop="actualInvest">
            <el-input  v-model="project.actualInvest" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="实际开工时间：" prop="actualOpenDate">
            <el-date-picker
              v-model="project.actualOpenDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="实际完工时间：" prop="actualFinishDate">
            <el-date-picker
              v-model="project.actualFinishDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </bv-col>

      </bv-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="confirmModify()">保存</el-button>
      <el-button @click="cancelModify()">取消</el-button>
    </div>
  </bv-dialog>
</template>

<script>
  import { insertProject,  updateProject} from '@/api/custom/project'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: false
      },
      project: {
        type: Object
      },
      editType:{
        default:''
      },
      rules: {

      },
    },
    data() {
      return {
        divisionCodes:this.$store.getters.depts,
        companys:this.$store.getters.comps
      }
    },
    methods: {
      cancelModify() {
        this.$emit('on-edit',false)
      },
      confirmModify() {
        // 表单验证
        this.$refs.dialogForm.validate((valid) => {
          if (!valid) {
            return false
          }
          // 新增
          if(this.editType == 'add'){
            insertProject(this.project).then(() => {
              this.$emit('on-edit', true)
            })
          }else{
            updateProject(this.project).then(() => {
              this.$emit('on-edit', true)
            })
          }

        })
      }
    }
  }
</script>
