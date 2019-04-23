<template>
  <div class="app-container">
    <div v-show="basicProjShow">
      <bv-table ref="table" title="项目信息" :pagination="true" :filter.sync="filter" :fetch-api="fetchBasicProjInfo" @on-mounted="(table) => tableInstance = table">
        <div slot="operates">
          <bv-button show="none" view="add" @click="clickInsert">增加</bv-button>
          <bv-button show="one" view="modify" @click="clickEdit">修改</bv-button>
          <bv-button show="one" view="remove" @click="handleDelete">删除</bv-button>
          <el-button type="primary" icon="el-icon-upload" @click="exportModalShow">导入数据</el-button>
        </div>
        <div slot="search">
          <bv-col>
            <el-form-item label="项目名称" prop="projName">
              <el-input v-model="filter.projName" />
            </el-form-item>
          </bv-col>
        </div>
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column label="序号" type="index" />
        <el-table-column label="项目编号" prop="projId" sortable="projId">
          <template slot-scope="scope"><img src="../../assets/wenjianjia.png" style="width:20px;height:20px; margin-right:6px">{{ scope.row.projId }}</template>
        </el-table-column>
        <el-table-column label="项目名称" prop="projName" />
        <el-table-column label="年度" prop="projYear" />
        <el-table-column label="立项日期" :formatter="dateFormatter" prop="projTime" />
        <el-table-column label="项目状态" prop="projState" :formatter="stateFormatter" />
        <el-table-column label="领域" prop="projField" :formatter="fieldFormatter" />
        <el-table-column label="业务部门" prop="projDept" />
        <el-table-column label="承办方" prop="projSponsor" />
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="clickShowDetail(scope.row)">查看</el-button>
            <!--<el-button type="text" size="small" @click="clickShowTask(scope.row)">查看任务</el-button>-->
          </template>
        </el-table-column>
      </bv-table>
    </div>
    <!-- 添加/修改/查看项目弹窗 -->
    <bv-dialog :title="isShowDetail?'查看项目详情':'维护项目信息'" :visible.sync="dialogVisible" top="2vh" @close="cancelInsertOrUpdate">
      <bv-form ref="insertForm" :model="projInfo" :rules="rules">
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="项目编号" prop="projId">
              <el-input v-model="projInfo.projId" clearable :readonly="isAdd?false:true" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目名称" prop="projName">
              <el-input v-model="projInfo.projName" clearable :readonly="isShowDetail?true:false" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目状态" prop="projState">
              <el-select v-model="projInfo.projState" placeholder="请选择">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :disabled="isShowDetail?true:false"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目类别" prop="projType">
              <el-select v-model="projInfo.projType" placeholder="请选择">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :disabled="isShowDetail?true:false"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目类型" prop="projMode">
              <el-select v-model="projInfo.projMode" placeholder="请选择">
                <el-option
                  v-for="item in modeOptions"
                  :key="item.value"
                  :label="item.label"
                  :disabled="isShowDetail?true:false"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="年度" prop="projYear">
              <el-date-picker v-model="projInfo.projYear" value-format="yyyy" type="year" style="width: 98%;" placeholder="请选择年份" clearable :readonly="isShowDetail?true:false" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="承办方" prop="projSponsor">
              <el-input v-model="projInfo.projSponsor" clearable :readonly="isShowDetail?true:false" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="销售负责人" prop="salesEmp">
              <el-autocomplete v-model="projInfo.salesEmp" :fetch-suggestions="querySearch" placeholder="请输入负责人" clearable />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="售前负责人" prop="preSalesEmp">
              <el-autocomplete v-model="projInfo.preSalesEmp" :fetch-suggestions="querySearch" placeholder="请输入负责人" clearable />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目负责人" prop="projManagerEmp">
              <el-autocomplete v-model="projInfo.projManagerEmp" :fetch-suggestions="querySearch" placeholder="请输入负责人" clearable />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="所属客户" prop="projCust">
              <el-autocomplete v-model="projInfo.projCust" :fetch-suggestions="querySearchCust" placeholder="请输入客户名称" clearable @select="fetchPerson" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="客户方负责人" prop="personGuid">
              <el-select v-model="projInfo.personGuid">
                <el-option v-for="item in custCardList" :key="item.custCardId" :label="item.custName" :value="item.custCardId" />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目领域" prop="projField">
              <el-select v-model="projInfo.projField" placeholder="请选择">
                <el-option
                  v-for="item in fieldOptions"
                  :key="item.value"
                  :label="item.label"
                  :disabled="isShowDetail?true:false"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="业务部门" prop="projDept">
              <el-select v-model="projInfo.projDept">
                <el-option v-for="item in deptList" :key="item.code" :value="item.code" :label="item.value" />
              </el-select>
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="产品模块">
              <el-cascader v-model="projInfo.productId" :options="productList" :show-all-levels="false" />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-1">
          <bv-col>
            <el-form-item label="销售合同名称">
              <el-input v-model="projInfo.conId" clearable />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="立项日期" prop="projTime">
              <el-date-picker v-model="projInfo.projTime" type="date" :placeholder="isShowDetail?'':'请选择日期'" value-format="yyyy-MM-dd" clearable :readonly="isShowDetail?true:false" style="width: 98%;" />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="验收日期" prop="checkTime">
              <el-date-picker v-model="projInfo.checkTime" type="date" :placeholder="isShowDetail?'':'请选择日期'" value-format="yyyy-MM-dd" clearable :readonly="isShowDetail?true:false" style="width: 98%;" />
            </el-form-item>
          </bv-col>
        </bv-row>
        <bv-row layout="dialog-2">
          <bv-col>
            <el-form-item label="开发人员" prop="developer">
              <el-input v-model="projInfo.developer" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        :placeholder="isShowDetail?'':'请输入相关开发人员内容'" clearable :readonly="isShowDetail?true:false"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="项目背景" prop="projDescribe">
              <el-input v-model="projInfo.projDescribe" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="功能要求" prop="projClaim">
              <el-input v-model="projInfo.projClaim" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="验收情况说明" prop="checkDetail">
              <el-input v-model="projInfo.checkDetail" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
              />
            </el-form-item>
          </bv-col>
          <bv-col>
            <el-form-item label="免费服务期" prop="freeTime">
              <el-input v-model="projInfo.freeTime" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                        :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
              />
            </el-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button v-if="!isShowDetail" view="save" type="primary" @click="handleInsertOrEdit('insertForm')">保存</bv-button>
        <bv-button v-if="!isShowDetail" view="cancel" @click="cancelInsertOrUpdate">取 消</bv-button>
        <bv-button v-if="isShowDetail" view="cancel" @click="dialogVisible=false">关闭</bv-button>
      </div>
    </bv-dialog>

    <bv-dialog title="项目数据导入" :visible.sync="exportModal" top="5vh">
      <el-upload
        ref="uploadFile"
        class="upload-demo"
        drag
        :action="upload_url"
        :auto-upload="false"
        :on-change="fileChange"
        :file-list="fileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <bv-button size="small" type="success" @click="submitEmpUpload">上传并导入</bv-button>
        <!--<bv-button size="small" type="success" @click="empExcelDownload">模板下载</bv-button>-->
        <bv-button @click="exportModalCancle">取 消</bv-button>
      </span>
    </bv-dialog>
    <bv-dialog title="添加项目计划" :visible.sync="dialogStepVisible">
      <el-form ref="insertStepForm" :model="insertStepForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="计划名称" prop="planName">
              <el-input v-model="insertStepForm.planName" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="计划状态" prop="planName">
              <el-select v-model="insertStepForm.planState">
                <el-option value="0000" label="未执行" />
                <el-option value="0001" label="执行中" />
                <el-option value="0002" label="已完成" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="计划开始时间">
              <el-date-picker v-model="insertStepForm.preStartDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="计划结束时间">
              <el-date-picker v-model="insertStepForm.preEndDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="实际开始时间">
              <el-date-picker v-model="insertStepForm.actualStartDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout2">
            <el-form-item label="实际结束时间">
              <el-date-picker v-model="insertStepForm.actualEndDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="实际描述">
              <el-input v-model="insertStepForm.description" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save" @click="saveStep">保存</bv-button>
        <bv-button view="cancel" @click="closePlanDialog">关闭</bv-button>
      </div>
    </bv-dialog>
    <div v-show="!basicProjShow">
      <bv-button @click="goBackBasic()">返回</bv-button>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="项目详情" name="basicDetail" lazy>
          <el-form :model="projInfo1" status-icon :rules="rules" label-width="100px" label-position="right">
            <el-row :gutter="$CONST.row.gutter">
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目编号:" prop="projId">
                  {{ projInfo1.projId }}
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目名称:" prop="projName">
                  {{ projInfo1.projName }}
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目状态" prop="projState">
                  {{ projInfo1.projState }}
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目类别" prop="projType">
                  <el-select v-model="projInfo1.projType" placeholder="请选择">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :disabled="isShowDetail?true:false"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目类型" prop="projMode">
                  <el-select v-model="projInfo1.projMode" placeholder="请选择">
                    <el-option
                      v-for="item in modeOptions"
                      :key="item.value"
                      :label="item.label"
                      :disabled="isShowDetail?true:false"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="年度" prop="projYear">
                  <el-date-picker v-model="projInfo1.projYear" value-format="yyyy" type="year" placeholder="请选择年份" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="承办方" prop="projSponsor">
                  <el-input v-model="projInfo1.projSponsor" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="销售负责人" prop="salesEmp">
                  <el-input v-model="projInfo1.salesEmp" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="售前负责人" prop="preSalesEmp">
                  <el-input v-model="projInfo1.preSalesEmp" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目负责人" prop="projManagerEmp">
                  <el-input v-model="projInfo1.projManagerEmp" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="所属客户" prop="projCust">
                  <el-input v-model="projInfo1.projCust" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="客户方负责人" prop="personGuid">
                  <el-input v-model="projInfo1.personGuid" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="项目领域" prop="projField">
                  <el-select v-model="projInfo1.projField" placeholder="请选择">
                    <el-option
                      v-for="item in fieldOptions"
                      :key="item.value"
                      :label="item.label"
                      :disabled="isShowDetail?true:false"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="业务部门" prop="projDept">
                  <el-input v-model="projInfo1.projDept" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="立项日期" prop="projTime">
                  <el-date-picker v-model="projInfo1.projTime" type="date" :placeholder="isShowDetail?'':'请选择日期'" value-format="yyyy-MM-dd" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout1">
                <el-form-item label="验收日期" prop="checkTime">
                  <el-date-picker v-model="projInfo1.checkTime" type="date" :placeholder="isShowDetail?'':'请选择日期'" value-format="yyyy-MM-dd" clearable :readonly="isShowDetail?true:false" />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="开发人员" prop="developer">
                  <el-input v-model="projInfo1.developer" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="isShowDetail?'':'请输入相关开发人员内容'" clearable :readonly="isShowDetail?true:false"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="项目背景" prop="projDescribe">
                  <el-input v-model="projInfo1.projDescribe" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="功能要求" prop="projClaim">
                  <el-input v-model="projInfo1.projClaim" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="验收情况说明" prop="checkDetail">
                  <el-input v-model="projInfo1.checkDetail" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
                  />
                </el-form-item>
              </el-col>
              <el-col v-bind="$CONST.col.layout3">
                <el-form-item label="免费服务期" prop="freeTime">
                  <el-input v-model="projInfo1.freeTime" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="isShowDetail?'':'请输入内容'" clearable :readonly="isShowDetail?true:false"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="查看任务" name="showTask" lazy>
          <task-info :proj-id="projInfo1.projId" />
        </el-tab-pane>
        <el-tab-pane label="项目计划" name="projPlan" lazy>
          <bv-form>
            <bv-row layout="dialog-2">
              <bv-col>
                <h3>项目信息列表</h3>
              </bv-col>
              <bv-col>
                <bv-button v-show="stepOneShow" style="float: right" view="add" @click="insertStep">增加</bv-button>
                <bv-button v-show="!stepOneShow" style="float: right" view="modify" @click="modifyStep">编辑</bv-button>
                <bv-button v-show="!stepOneShow" style="float: right" view="remove" @click="removeStep">删除</bv-button>
              </bv-col>
            </bv-row>
          </bv-form>
          <div class="step" align="center">
            <el-steps direction="vertical" finish-status="success" :active="active">
              <el-step v-for="(item,index) in stepItems" :key="index" :title="item.planName" @click.native="stepClick(item)">
                <template slot="description">
                  <span v-text="planStateFormatter(item.planState)" />
                  <div class="step-row">
                    <span style="position: absolute;left: 3%;">预计开始时间:{{ item.preStartDate }}</span>
                    <span style="position: absolute;left: 15%;">预计结束时间:{{ item.preEndDate }}</span>
                    <br>
                    <span style="position: absolute;left: 3%;">实际开始时间:{{ item.actualStartDate }}</span>
                    <span style="position: absolute;left: 15%;">实际结束时间:{{ item.actualEndDate }}</span>
                    <br>
                    <span style="position: absolute;left: 3%;">{{ item.description }}</span>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-tab-pane>
        <el-tab-pane label="联系人" name="customDetail" lazy>
          <custom-detail :corp-id="projInfo1.projCust" />
        </el-tab-pane>
        <el-tab-pane label="网络设备信息" name="networkEquip" lazy>
          <network-equip :corp-id="projInfo1.projCust" />
        </el-tab-pane>
        <el-tab-pane label="服务器信息" name="serverDetail" lazy>
          <server-detail :corp-id="projInfo1.projCust" />
        </el-tab-pane>
        <el-tab-pane label="数据库信息" name="databaseDetail" lazy>
          <database-detail :corp-id="projInfo1.projCust" />
        </el-tab-pane>
        <el-tab-pane label="web服务器信息" name="webServerDetail" lazy>
          <web-server-detail :corp-id="projInfo1.projCust" />
        </el-tab-pane>
        <el-tab-pane label="应用信息" name="applicationDetail" lazy>
          <application-detail :corp-id="projInfo1.projCust" />
        </el-tab-pane>
        <el-tab-pane label="图档信息" name="fileDetail" lazy>
          <file-detail :corp-id="projInfo1.projCust" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { fetchBasicProjInfo,insertProjInfo,updateProjInfo,deleteProjInfo,fetchProjPlan,insertProjPlanInfo,modifyProjPlanInfo,fetchProjData,fetchCustCard,importProjFunction } from '../../api/proj/proj'
import { importEmpInfoExcel } from '@/api/employee/empInfo'
import taskInfo from './TaskInfo'
import customDetail from './child/customDetail'
import networkEquip from './child/networkEquip'
import serverDetail from './child/serverDetail'
import databaseDetail from '@/views/project/child/databaseDetail'
import webServerDetail from '@/views/project/child/webServerDetail'
import applicationDetail from '@/views/project/child/applicationDetail'

const maxFileSize = 20;

  export default {
    name:'ProjInfoList',
    components:{
      taskInfo,customDetail,networkEquip,serverDetail,databaseDetail,webServerDetail,applicationDetail
    },
    data() {
      return {
        //主页面显示
        basicProjShow: true,
        //查看页面显示
        showDetail: false,
        //判断是否是新增，false是修改
        isAdd: false,
        //新增/修改/查看详情时存储数据的容器
        projInfo: {},
        // 过滤条件
        filter: {},
        //新增弹窗是否显示
        dialogVisible: false,
        //导入数据弹窗是否显示
        exportModal: false,
        //点击查看详情显示详情页弹窗
        showDetailInfoVisible:false,
        //点击查看详情按钮后控制表单数据只读
        isShowDetail:false,
        //弹框表单校验规则
        rules: {
          projId: [
            {required: true, message:'项目编号不能为空', trigger: 'blur'},
            { min: 8, max: 8, message: '长度为 8 个字符', trigger: 'blur' }
          ],
          projName: [
            {required: true, message: '请输入项目名', trigger: 'blur'},
            { min: 1, max: 150, message: '长度必须小于150个字', trigger: 'blur' }
          ],
          projSponsor: [
            { min: 0, max: 100, message: '长度必须小于100个字', trigger: 'blur' }
          ],
          projDescribe: [
            { min: 0, max: 1000, message: '长度必须小于1000个字', trigger: 'blur' }
          ],
          projClaim: [
            { min: 0, max: 1000, message: '长度必须小于1000个字', trigger: 'blur' }
          ],
          checkDetail: [
            { min: 0, max: 1000, message: '长度必须小于1000个字', trigger: 'blur' }
          ],
          freeTime: [
            { min: 0, max: 1000, message: '长度必须小于1000个字', trigger: 'blur' }
          ],
          planName:[
              {required: true, trigger: 'blur'}
            ]
        },
        //项目状态下拉选项
        stateOptions: [
          {
          value: '0001',
          label: '新建/售前'
        }, {
          value: '0002',
          label: '立项'
        }, {
          value: '0003',
          label: '执行中'
        }, {
          value: '0004',
          label: '结束'
        }, {
          value: '0005',
          label: '取消'
        }, {
          value: '0006',
          label: '服务'
        }, {
          value: '0007',
          label: '服务中'
        }, {
          value: '0008',
          label: '终验完成'
        }, {
          value: '0000',
          label: '验收'
        }],
        //项目类别字典
        modeOptions : [
         {
            value:'0001',
            label:'内部'
          },{
            value:'0002',
            label:'外部'
          },{
            value:'0003',
            label:'产品推广'
          }
        ],//项目类型字典
        typeOptions: [
          {
            value:'0000',
            label:'新启'
          },{
            value:'0001',
            label:'二次开发'
          },{
            value:'0002',
            label:'升级'
          },{
            value:'0004',
            label:'其他'
          }
        ],
        //项目领域字典
        fieldOptions: [
        {
          value:'0001',
          label:'消费金融'
        },{
          value:'0002',
          label:'商业银行'
        },{
          value:'0003',
          label:'住建房管'
        },{
          value:'0004',
          label:'其他'
        }
      ],
        activeName: 'basicDetail',
        projInfo1:{},
        stepItems:[],
        dialogStepVisible:false,
        insertStepForm:{
          planName: '',
          planState: '',
          preStartDate: '',
          preEndDate: '',
          actualStartDate: '',
          actualEndDate: '',
          description: ''
        },
        active: 0,
        //增加项目计划按钮显示隐藏
        stepOneShow: true,
        fetchBasicProjInfo,
        //存放后台查询出来的数据 用于选择菜单
        empIds: [], //负责人数据
        custList: [], //客户数据
        deptList: [],  //部门数据
        custCardList: [],  //客户联系人
        productList: [],  //产品模块
        //数据导入
        upload_url: 'url',
        //存放文件数据
        fileList: []
      }
    },
    created(){
      this.initData()
    },
    methods: {
      initData() {
        //查询所有初始数据
        fetchProjData().then(res => {
          this.empIds = res.data.empNames
          this.custList = res.data.custList
          this.deptList = res.data.deptList
          this.productList = res.data.productList
        })
      },
      clickInsert() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //新增标志置为true
        this.isAdd=true
        //显示详情标志置为false
        this.isShowDetail=false
        //清空this.projInfo
        this.projInfo={
          projState: '0001'
        }
      },
      clickEdit() {
        //弹窗显示标志置为true
        this.dialogVisible=true
        //新增标志置为false
        this.isAdd=false
        //显示详情标志置为false
        this.isShowDetail=false
        //将选中的数据赋值给this.projInfo
        this.projInfo=this.selection[0]
      },
      handleDelete () {
        let _that = this
        _that.$confirm('确定要删除此信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //根据this.selection[0] 中的对象的id进行删除
          deleteProjInfo(_that.selection[0].projId).then(res =>{
            if(res.data.level=="success"){
              //刷新页面
              _that.initTable()
              //清空选中
              _that.selection.pop()
            }
            _that.$message({
              message:res.data.retMsg,type: res.data.level
            })
          })

        }).catch(() => {
        });

    },
      //新增或修改页面中保存按钮的操作
      handleInsertOrEdit() {
        //表单校验
        let _that=this
        this.$refs.insertForm.validate((valid) => {
          if (valid) {
            if (_that.isAdd) {
              //将数据存入数据库
              insertProjInfo(_that.projInfo).then(res =>{
                //刷新页面
                _that.tableInstance.fetchData()
                //关闭弹窗
                _that.dialogVisible = false
                this.$message({
                  message:res.data.retMsg,
                  type: res.data.level
                })
              })

            } else {
              //将修改的数据更新到数据库
              updateProjInfo(_that.projInfo).then(res =>{
                // 修改成功后执行
                if(res.data.level=="success"){
                  //刷新页面
                  _that.tableInstance.fetchData()
                  //关闭弹窗
                  _that.dialogVisible = false
                  //清空选中
                  _that.selection.pop()
                }
                  this.$message({
                    message:res.data.retMsg,type: res.data.level
                  })
              }
              )
            }
          }else {
            //校验没有通过时的处理
            this.$message({
              message:'请检查数据的合法性！',type: 'warning'
            })
          }
        })
      },
      //表格操作列查看详情点击事件
      clickShowDetail(row) {
        //置弹窗显示标志位true
        // this.dialogVisible = true
        //置显示详情标志为true
        this.isShowDetail = true
        //置新增标志为false
        this.isAdd = false
        //给ProjInfo赋值为当前点击行的数据
        this.projInfo1=row
        this.basicProjShow = false
        this.initProjPlan()
      },
      //新增弹窗关闭事件
      cancelInsertOrUpdate() {
        //清除表单校验
        this.$nextTick(function () {
          this.$refs.insertForm.clearValidate()
        })
        //关闭弹窗
        this.dialogVisible = false
      },
      selectable(row){
        if(row.projState=='0005'){
          return false
        }else {
          return true
        }
      },
      //过滤器用法
      dateFormatter(row) {
        return row.projTime
      },
      stateFormatter(row) {
        switch (row.projState) {
          case '0000':return "验收"
          case '0001':return "新建/售前"
          case '0002':return "立项"
          case '0003':return "执行中"
          case '0004':return "结束"
          case '0005':return "取消"
          case '0006':return "服务"
          case '0007':return "服务中"
          case '0008':return "终验完成"
        }
      },
      fieldFormatter(row) {
        switch (row.projField) {
          case '0001':return "消费金融"
          case '0002':return "商业银行"
          case '0003':return "住建房管"
          case '0004':return "其他"
        }
      },
      /**
       * 查看页面方法
       * */
      //从查看页面返回项目信息列表
      goBackBasic(){
        this.projInfo1 = {}
        this.basicProjShow = true
      },
      insertStep(){
        this.insertStepForm = {}
        this.dialogStepVisible = true
      },
      saveStep(){
        // this.insertStepForm
        // debugger
        if(this.insertStepForm.id){
          modifyProjPlanInfo(this.insertStepForm).then( () =>{
            this.initProjPlan()
            //传到后台存入数据库
            this.dialogStepVisible = false
          })
        }else{
          let stepData = {
            projId:this.projInfo1.projId,
            planName: this.insertStepForm.planName,
            preStartDate:this.insertStepForm.preStartDate,
            preEndDate:this.insertStepForm.preEndDate,
            actualStartDate:this.insertStepForm.actualStartDate,
            actualEndDate:this.insertStepForm.actualEndDate,
            description: this.insertStepForm.description,
            planState: this.insertStepForm.planState
          }
          // this.stepItems.push(stepData)
          insertProjPlanInfo(stepData).then( () =>{
            this.initProjPlan()
            //传到后台存入数据库
            this.dialogStepVisible = false
          })
        }
      },
      //加载项目计划数据
      initProjPlan(){
        if(this.projInfo1.projId){
          let paramData = {}
          paramData.projId = this.projInfo1.projId;
          this.active = 0
          fetchProjPlan(paramData).then(res =>{
            this.stepItems = res.data
            this.stepItems.forEach( item => {
              if(item.planState === '0002'){
                this.active ++;
              }
            })
            if(this.active>this.stepItems.length){
              this.active = 0;
            }
          })
        }
      },
      //项目完成状态
      planStateFormatter(state){
        let returnData = '';
        switch (state) {
          case '0000':
            returnData = '未执行';
            break;
          case '0001':
            returnData = '执行中';
            break;
          case '0002':
            returnData = '已完成';
            break;
        }
        return returnData
      },
      stepClick(item){
        this.insertStepForm = item
        // this.dialogStepVisible = true
        this.stepOneShow = false
        // console.log(item);
      },
      modifyStep(){
        this.dialogStepVisible = true
      },
      removeStep(){
        console.log(this.insertStepForm)
      },
      closePlanDialog(){
        this.dialogStepVisible=false
        this.stepOneShow = true
        this.insertStepForm = {}
      },
      //负责人可输入查询
      querySearch(queryString, cb) {
        var restaurants = this.empIds;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      //客户可输入查询
      querySearchCust(queryString, cb){
        var restaurants = this.custList;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //根据客户id查询客户联系人
      fetchPerson(name){
        console.log(name.code)
        let data = {}
        data.corpId = name.code
        fetchCustCard(data).then(res => {
          this.custCardList = res.data
        })
      },
      //上传文件
      exportModalShow() {
        this.exportModal = true
      },
      fileChange(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.fileList = fileList.slice(1, 1);
          return;
        }
        let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
        let extension = testmsg === 'xls'
        let extension2 = testmsg === 'xlsx'
        if(!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          });
          this.fileList = fileList.slice(1, 1);
          return;
        }
        this.fileList = fileList.slice(-1);
      },
      submitEmpUpload(){
        let path = '\\projInfo';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push("项目导入文件");
        }

        // 没有上传文件时
        if (!isHaveFiles) {
          this.$message({
            type: 'warning',
            message: '请至少上传1个文件!'
          });
          return;
        }
        //传递当前用户id  ==  manageUser
        let data = {
          fileSource: fileSource,
          manageUser: 'admin',
          path: path
        };
        importEmpInfoExcel(file, data).then(ret => {
          //上传文件成功  返回文件id  插入数据
          if (ret.data.retCode === '0000') {
            //获取文件id  上传文件中的数据
            let data1 = {}
            data1.fileId = ret.data.fileId
            importProjFunction(data1).then(res => {
              // 隐藏版本弹窗
              this.exportModal = false;
              this.$message({
                type: res.data.level,
                message: res.data.retMsg
              });
              //清除上传的文件
              this.$refs.uploadFile.clearFiles()
            })
          }
        }).catch(() => {
          console.log('上传失败')
          this.$refs.uploadFile.clearFiles()
        });
      },
      //关闭上传文件弹窗
      exportModalCancle(){
        this.exportModal = false
        this.$refs.uploadFile.clearFiles()
      }
    }
  }
</script>

<style>
  .step{
    width: 80%;
  }
  .step-row{
    min-width:500px;
    margin-bottom:30px;
    margin-top:12px;
  }
</style>
