<template>
  <bv-dialog title="从业机构新增" :visible.sync="visible"  width="70%">
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
                v-for="item in divisionCodes"
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
            <el-input  v-model="company.hasTitleNum" class="edit-input" type="number"    ></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="高级职称专业人数：" prop="highTitleNum">
            <el-input  v-model="company.highTitleNum" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>

        <bv-col>
          <el-form-item label="在册人员总数：" prop="headCount">
            <el-input  v-model="company.headCount" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="中级职称人数：" prop="middleTitleNum">
            <el-input  v-model="company.middleTitleNum" class="edit-input"  type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="初级级职称人数：" prop="primaryTitleNum">
            <el-input  v-model="company.primaryTitleNum" class="edit-input"  type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="净资产（万元）：" prop="netAsset">
            <el-input  v-model="company.netAsset" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="总资产（万元）：" prop="totalAsset">
            <el-input  v-model="company.totalAsset" class="edit-input"   type="number"></el-input>
          </el-form-item>
        </bv-col>
        <bv-col>
          <el-form-item label="注册资本：" prop="registerAsset">
            <el-input  v-model="company.registerAsset" class="edit-input"  type="number"></el-input>
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
</template>

<script>
  import { insertCompany ,updateCompany} from '@/api/custom/company'
    export default {
        name: "editCompany",
        props:{
          modifyType:{
            default:''
          },
          visible:{
            default :true
          },
          company:{},
        },
        data(){
          var validatePhone = (rule,value,callback) => {
            if(/^1[34578]\d{9}$/.test(value) == false){
              callback(new Error("请输入正确的手机号"));
            }else{
              callback();
            }
          };
          return{
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
                , {validator:validatePhone,trigger: 'blur'},
              ],
              qualifyDate:[
                {required: true ,  message: '请输入有效期', trigger: 'blur'}
              ],
              creditDate:[
                {required: true ,  message: '请输入有效期', trigger: 'blur'}
              ],
            },
            comPropertys:this.$store.state.app.dicts.corpProperty ,
            qualifyGradeS:this.$store.state.app.dicts.qualifyGrade ,
            yesOrNo:this.$store.state.app.dicts.yesOrNo,
            certTypes:this.$store.state.app.dicts.certType ,
            divisionCodes:this.$store.getters.depts,
            compTypes:this.$store.state.app.dicts.compTypes,
          }
        },
      methods:{
        cancelModify() {
          this.$emit('on-edit', false , false )
        },
        confirmModify() {
          this.$refs.dialogForm.validate((valid) => {
            if (!valid) {
              return false
            }
            if (this.modifyType === 'update') {
              //将修改的数据更新到数据库
              updateCompany(this.company).then(res =>{
                this.$emit('on-edit', false, res)
              })
            }else{
              insertCompany(this.company).then(res => {
                //this.afterModify(res)
                this.$emit('on-edit', false, res)
              })
            }

          })
        },
      }
    }
</script>

<style scoped>

</style>
