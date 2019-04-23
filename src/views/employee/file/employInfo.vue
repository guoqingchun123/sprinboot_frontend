<template>
  <div class="app-container">
    <bv-table ref="table"
              title="用户信息列表"
              :fetch-api="fetchEmpInfo"
              :filter.sync="filter"
              :pagination="true"
              @on-mounted="(table) => tableInstance = table">
      <div slot="operates">
        <bv-button show="none"
                   view="add"
                   @click="insertEleInfo">新增
        </bv-button>
        <!--<bv-button show="oneShow && (notAccount || openAccount)"
                   view="modify"
                   @click="editEleInfo">修改
        </bv-button>-->
        <bv-button show="one"
                   type="warning"
                   @click="editEleInfo">修改
        </bv-button>
        <bv-button v-show="oneShow && notAccount"
                   @click="openEmpAccount">员工开户
        </bv-button>
        <bv-button v-show="oneShow && openAccount"
                   @click="cacleEmpAccount">员工销户
        </bv-button>
        <bv-button v-show="oneShow && (notAccount || openAccount)"
                   @click="modifyContract">续签合同
        </bv-button>
        <bv-button type="primary"
                   @click="importEmpInfo">导入数据
        </bv-button>
      </div>
      <div slot="search">
        <bv-col>
          <el-form-item label="员工姓名">
            <el-input v-model="filter.empName"/>
          </el-form-item>
        </bv-col>
      </div>
      <el-table-column type="selection"
                       width="55"/>
      <el-table-column label="序号"
                       type="index"/>
      <el-table-column align="center"
                       label="员工代码"
                       prop="empId"
                       sortable="empId"/>
      <el-table-column align="center"
                       label="员工姓名"
                       prop="empName"/>
      <el-table-column align="center"
                       label="员工状态"
                       prop="empState"/>
      <el-table-column align="center"
                       label="合同结束日期"
                       prop="contractEndDate"/>
      <el-table-column align="center"
                       label="岗位代码"
                       prop="postId"/>
      <el-table-column align="center"
                       label="联系电话"
                       prop="phoneNo"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small"
                     type="text"
                     @click="handleClick(scope.row)">查看详情
          </el-button>
        </template>
      </el-table-column>
    </bv-table>
    <el-dialog v-if="dialogVisible"
               title="添加新员工"
               top="5vh"
               width="60%"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogVisible">
      <!--<bv-dialog title="添加新员工" :visible.sync="dialogVisible" top="5vh" style="width: 100%;">-->
      <bv-scrollbar>
        <el-form status-icon
                 class="dialog-form"
                 label-position="right"
                 label-width="120px"
                 ref="insertForm"
                 style="width: 95%"
                 :model="insertForm"
                 :rules="rules"
        >
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="员工姓名:"
                            prop="empName">
                <el-input v-model="insertForm.empName"
                          placeholder="请输入员工姓名"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="身份证号码:"
                            prop="certNo">
                <el-input v-model="insertForm.certNo"
                          placeholder="请输入身份证号码"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="政治面貌:">
                <el-select clearable
                           v-model="insertForm.politicalStatus"
                           placeholder="请选择政治面貌">
                  <el-option v-for="(item, index) in politics"
                             :key="index"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="出生日期:">
                <el-input v-model="insertForm.birthday"
                          placeholder=""
                          :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="性别:">
                <el-select clearable
                           v-model="insertForm.sex"
                           placeholder=""
                           :disabled="true">
                  <el-option label="男"
                             value="0"/>
                  <el-option label="女"
                             value="1"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="年龄:">
                <el-input v-model="insertForm.age"
                          placeholder=""
                          :disabled="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="籍贯:">
                <el-input v-model="insertForm.domicile"
                          placeholder="请输入籍贯"
                          type="textarea"
                          :rows="1"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="$CONST.row.gutter">
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="学历:">
                <el-input v-model="insertForm.educational"
                          placeholder="请输入学历"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="毕业院校:">
                <el-input v-model="insertForm.univId"
                          placeholder="请输入毕业院校"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="学校级别:">
                <el-select v-model="insertForm.uniyLevel"
                           placeholder="请选择学校级别">
                  <el-option v-for="(item, index) in uniyLevel"
                             :key="index"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="所学专业:">
                <el-input v-model="insertForm.learnProfessional"
                          placeholder="请输入所学专业"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="类别:">
                <el-input v-model="insertForm.category"
                          placeholder="请输入专业类别"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="是否相关专业:"
                            style="white-space: nowrap;">
                <el-select v-model="insertForm.relevantType">
                  <el-option label="是"
                             value="0"/>
                  <el-option label="否"
                             value="1"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="毕业日期:">
                <el-date-picker v-model="insertForm.graduationYear"
                                format="yyyy-MM-dd"
                                placeholder="请输入毕业日期"
                                style="width: auto"
                                type="date"
                                value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="外语水平:">
                <el-input v-model="insertForm.foreignLangu"
                          placeholder="请输入外语水平"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="从业日期:">
                <el-date-picker v-model="insertForm.employedDate"
                                format="yyyy-MM-dd"
                                placeholder="请输入从业日期"
                                style="width: auto"
                                type="date"
                                value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="到职日期:"
                            prop="registeredDate">
                <el-date-picker v-model="insertForm.registeredDate"
                                format="yyyy-MM-dd"
                                placeholder="请输入到职日期"
                                style="width: auto"
                                type="date"
                                value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="部门名称:"
                            prop="deptIds">
                <el-select multiple
                           v-model="insertForm.deptIds"
                           @change="fetchSuperPerson($event)">
                  <el-option v-for="(item, index) in sysDept"
                             :key="index"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="岗位代码:"
                            prop="postId">
                <el-select v-model="insertForm.postId">
                  <el-option v-for="(item, index) in postIds"
                             :key="index"
                             :label="item.value"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="岗位名称:">
                <el-input v-model="insertForm.postName"
                          placeholder="请输入岗位名称"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="所属区域:">
                <el-cascader v-model="insertForm.areaId"
                             expand-trigger="hover"
                             :clearable="true"
                             :options="belongArea"
                             :show-all-levels="false"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="招聘来源:">
                <el-input v-model="insertForm.recruitsSource"
                          placeholder="请输入招聘来源"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="入职定薪:">
                <el-input v-model="insertForm.entrySalary"
                          placeholder="请输入入职定薪"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="督导人:">
                <el-cascader v-model="insertForm.supervisorId"
                             expand-trigger="hover"
                             :clearable="true"
                             :options="superPerson"
                             :show-all-levels="false"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="转正日期:">
                <el-date-picker v-model="insertForm.positiveDate"
                                format="yyyy-MM-dd"
                                style="width: auto"
                                type="date"
                                value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="合同类型:">
                <el-select v-model="insertForm.contractTypes">
                  <el-option v-for="(item, index) in contractType"
                             :key="index"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="合同开始日期:"
                            style="white-space: nowrap;">
                <el-date-picker v-model="insertForm.contractBeginDate"
                                format="yyyy-MM-dd"
                                style="width: auto"
                                type="date"
                                value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="合同结束日期:"
                            style="white-space: nowrap;">
                <el-date-picker v-model="insertForm.contractEndDate"
                                format="yyyy-MM-dd"
                                style="width: auto"
                                type="date"
                                value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="QQ:">
                <el-input v-model="insertForm.qq"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="email:">
                <el-input v-model="insertForm.email"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="联系电话:">
                <el-input v-model="insertForm.phoneNo"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="特殊项目标识:"
                            style="white-space: nowrap;">
                <el-input v-model="insertForm.specialProj"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="特殊技能说明:"
                            style="white-space: nowrap;">
                <el-input v-model="insertForm.specialSkill"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="紧急联系人:">
                <el-input v-model="insertForm.urgContactPerson"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="紧急联系人电话:"
                            style="white-space: nowrap;">
                <el-input v-model="insertForm.urgContactPhone"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="紧急联系人关系:"
                            style="white-space: nowrap;">
                <el-input v-model="insertForm.urgContactRelation"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1"
                    v-show="insertForm.empId">
              <el-form-item label="离职日期:">
                <el-date-picker v-model="insertForm.departureDate"
                                format="yyyy-MM-dd"
                                style="width: auto"
                                value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="通讯地址:">
                <el-input v-model="insertForm.address"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </bv-scrollbar>
      <div slot="footer">
        <bv-button view="save"
                   @click="confirmSave">保存
        </bv-button>
        <bv-button view="cancel"
                   @click="dialogVisible = false">取消
        </bv-button>
      </div>
    </el-dialog>
    <bv-dialog title="员工信息详情"
               top="5vh"
               :visible.sync="dialogShowVisible">
      <bv-scrollbar>
        <el-form status-icon
                 class="dialog-form"
                 label-position="right"
                 label-width="120px"
                 ref="showEmpForm"
                 :model="showEmpForm"
        >
          <el-row>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="员工姓名:"
                            prop="empName">{{ showEmpForm.empName }}
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="性别:">
                <span v-text="stateFormatter"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="年龄:">{{ showEmpForm.age }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="出生日期:">{{ showEmpForm.birthday }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="政治面貌:">
                <el-select clearable
                           v-model="showEmpForm.politicalStatus"
                           placeholder="请选择政治面貌">
                  <el-option v-for="(item, index) in politics"
                             :key="index"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="身份证号码:">{{ showEmpForm.certNo }}</el-form-item>
            </el-col>
          </el-row>
          <el-col v-bind="$CONST.col.layout3">
            <el-form-item label="籍贯:">{{ showEmpForm.domicile }}</el-form-item>
          </el-col>
          <el-row>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="学历:">{{ showEmpForm.educational }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="毕业院校:">{{ showEmpForm.univId }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="学校级别:">
                <el-select v-model="showEmpForm.uniyLevel"
                           placeholder="请选择学校级别">
                  <el-option v-for="(item, index) in uniyLevel"
                             :key="index"
                             :label="item.label"
                             :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="所学专业:">{{ showEmpForm.learnProfessional }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="类别:">{{ showEmpForm.category }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="是否相关专业:">
                <el-select v-model="showEmpForm.relevantType">
                  <el-option label="是"
                             value="0"/>
                  <el-option label="否"
                             value="1"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="毕业日期:">{{ showEmpForm.graduationYear }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="外语水平:">{{ showEmpForm.foreignLangu }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="从业日期:">{{ showEmpForm.employedDate }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="到职日期:">{{ showEmpForm.registeredDate }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="部门名称:">
                <!--<span v-text="deptNameForma"></span>-->
                <!--{{ showEmpForm.deptIds }}-->
                <span v-for="dept in showEmpForm.deptIds"
                      v-text="dept + ' '"
                      :key="dept"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="岗位代码:">
                <span v-text="postIdFormatter"/>
              </el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="岗位名称:">{{ showEmpForm.postName }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="所属区域:">{{ showEmpForm.areaId }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="招聘来源:">{{ showEmpForm.recruitsSource }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="入职定薪:">{{ showEmpForm.entrySalary }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="督导人:">{{ showEmpForm.supervisorId }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="转正日期:">{{ showEmpForm.positiveDate }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="合同类型:">{{ showEmpForm.contractTypes }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="合同开始日期:">{{ showEmpForm.contractBeginDate }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="合同结束日期:">{{ showEmpForm.contractEndDate }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="QQ:">{{ showEmpForm.qq }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="email:">{{ showEmpForm.email }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="联系电话:">{{ showEmpForm.phoneNo }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="特殊项目标识:">{{ showEmpForm.specialProj }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="特殊技能说明:">{{ showEmpForm.specialSkill }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="紧急联系人:">{{ showEmpForm.urgContactPerson }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="紧急联系人电话:">{{ showEmpForm.urgContactPhone }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="紧急联系人关系:">{{ showEmpForm.urgContactRelation }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout1">
              <el-form-item label="离职日期:">{{ showEmpForm.departureDate }}</el-form-item>
            </el-col>
            <el-col v-bind="$CONST.col.layout3">
              <el-form-item label="通讯地址:">{{ showEmpForm.address }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </bv-scrollbar>
      <div slot="footer">
        <bv-button view="cancel"
                   @click="dialogShowVisible = false">关闭
        </bv-button>
      </div>
    </bv-dialog>
    <el-dialog title="续签合同"
               width="60%"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="dialogContractVisible">
      <el-form v-model="contractForm"
               label-position="right"
               label-width="120px"
               ref="contractForm"
               :rules="rules">
        <el-row :gutter="$CONST.row.gutter">
          <el-col v-bind="$CONST.col.layout1">
            <el-form-item label="姓名:"
                          prop="empName">
              <el-input v-model="contractForm.empName"/>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout1">
            <el-form-item label="合同类型:">
              <el-select v-model="contractForm.contractTypes">
                <el-option v-for="(item, index) in contractType"
                           :key="index"
                           :label="item.label"
                           :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout1">
            <el-form-item label="合同开始日期:">
              <el-date-picker v-model="contractForm.actualStartDate"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout1">
            <el-form-item v-show="contractForm.contractTypes != 'B'"
                          label="合同结束日期:">
              <el-date-picker v-model="contractForm.actualEndDateA"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"/>
            </el-form-item>
          </el-col>
          <el-col v-bind="$CONST.col.layout1">
            <el-form-item v-show="contractForm.contractTypes == 'B'"
                          label="合同结束日期:">
              <el-input v-model="contractForm.actualEndDateB"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <bv-button view="save"
                   @click="contractSave">确认
        </bv-button>
        <bv-button view="cancel"
                   @click="dialogContractVisible = false">取消
        </bv-button>
      </div>
    </el-dialog>
    <el-dialog title="员工明细导入"
               width="30%"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :visible.sync="exportEmpModal">
      <el-upload drag
                 class="upload-demo"
                 ref="uploadFile"
                 :action="upload_url"
                 :auto-upload="false"
                 :file-list="fileList"
                 :on-change="fileChange"
      >
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip"
             slot="tip">只能上传xls/xlsx文件
        </div>
      </el-upload>
      <span class="dialog-footer"
            slot="footer">
        <bv-button size="small"
                   type="success"
                   @click="submitEmpUpload">上传并导入</bv-button>
        <bv-button size="small"
                   type="success"
                   @click="empExcelDownload">模板下载</bv-button>
        <bv-button @click="exportEmpModal = false">取 消</bv-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    downloadTemplate,
    fetchDepts,
    fetchDictInfo,
    fetchEmpInfo,
    fetchTableInfo,
    fetchUserByDept,
    importEmpInfoExcel,
    importEmpInfoFunction,
    modifyAccount,
    modifyEmp,
    modifyEmpContract,
    removeAccount,
    fetchUserByIdCard
  } from '@/api/employee/empInfo';

  const supervisors = [];

  const maxFileSize = 20;

  export default {
    name: 'EmployInfo',
    data() {
      var checkAge = (rule, value, callback) => {
        if (!/^\d{17}(\d|x)$/i.test(value)) {
          this.insertForm.sex = '';
          this.insertForm.birthday = '';
          this.insertForm.age = '';
          return callback(new Error('请输入正确的身份证号'));
        } else {
          let param = {};
          param.idCard = value;
          fetchUserByIdCard(param).then( res => {
            let flag = res.data;
            debugger
            if(flag == true){
              this.$message({
                message: '该身份证号已经被录入',
                type: 'error'
              });
              return callback(new Error('该身份证号已经被录入'));
            }
            this.insertForm.sex = value[16] % 2 == 0 ? '1' : '0';
            let birthYear = value.substring(6, 10);
            let birthMonth = value.substring(10, 12);
            let birthDay = value.substring(12, 14);
            this.insertForm.birthday = birthYear + '-' + birthMonth + '-' + birthDay;
            let nowYear = new Date().getFullYear();
            this.insertForm.age = Number(nowYear) - Number(birthYear);
          })
        }
      };
      return {
        // 过滤条件
        filter: {
          empName: ''
        },
        //新增弹窗是否显示
        dialogVisible: false,
        //导入数据弹窗是否显示
        exportModal: false,
        //选择部门  岗位代码  区域
        sysDept: [],
        postIds: [],
        areas: [],
        restaurants: [],
        dictInfo: {
          'politicalStatus': 'politicalStatus',
          'empPosition': 'empPosition',
          'collegeLevel': 'collegeLevel',
          'contractType': 'contractType'
        },
        superPerson: [],
        belongArea: [],
        //政治面貌
        politics: [],
        //学校级别
        uniyLevel: [],
        //合同类型
        contractType: [],
        //弹窗显示内容
        insertForm: {
          empId: '',
          empName: '',
          sex: '',
          age: '',
          birthday: '',
          politicalStatus: '',
          certNo: '',
          domicile: '',
          educational: '',
          univId: '',
          uniyLevel: '',
          learnProfessional: '',
          category: '',
          relevantType: '',
          graduationYear: '',
          foreignLangu: '',
          employedDate: '',
          registeredDate: '',
          deptIds: [],
          postId: '',
          postName: '',
          areaId: '',
          recruitsSource: '',
          entrySalary: '',
          supervisorId: '',
          positiveDate: '',
          contractTypes: '',
          contractBeginDate: '',
          contractEndDate: '',
          qq: '',
          email: '',
          phoneNo: '',
          specialProj: '',
          specialSkill: '',
          urgContactPerson: '',
          urgContactPhone: '',
          urgContactRelation: '',
          address: '',
          departureDate: ''
        },
        //弹窗头部信息
        modalTitle: '添加新员工',
        //弹窗校验规则
        rules: {
          empName: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
          registeredDate: [{required: true, message: '请输入到职日期', trigger: 'blur'}],
          deptIds: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
          postId: [{required: true, message: '请输入岗位代码', trigger: 'blur'}],
          certNo: [{required: true, validator:checkAge, message: '请输入正确的身份证号', trigger: 'blur'}]
        },
        showEmpForm: {},
        //展示弹窗的显示
        dialogShowVisible: false,
        //判断是新增还是修改
        modifyType: '',
        //续签合同
        dialogContractVisible: false,
        contractForm: {
          empName: '',
          contractTypes: '',
          actualStartDate: '',
          actualEndDateA: '',
          actualEndDateB: ''
        },
        //员工导入
        exportEmpModal: false,
        //上传的文件列表
        fileList: [],
        upload_url: 'url',
        tableInstance: {},
        fetchEmpInfo,
        selection: []
      };
    },

    computed: {
      stateFormatter() {
        let sex;
        switch (this.showEmpForm.sex) {
          case '0':
            sex = '男';
            break;
          case '1':
            sex = '女';
            break;
          default:
            sex = '';
            break;
        }
        return sex;
      },
      postIdFormatter() {
        if (this.showEmpForm.postId) {
          var returnData;
          for (let i = 0; i < this.postIds.length; i++) {
            if (this.postIds[i].label == this.showEmpForm.postId) {
              returnData = this.postIds[i].value;
              break;
            }
          }
          return returnData;
        } else {
          return '';
        }
      },
      //不选中的时候显示
      noShow() {
        debugger
        return this.selection.length === 0;
      },
      //选中一个时显示
      oneShow() {
        debugger;
        return this.selection.length === 1;
      },
      //用户状态为 未开户_1111 显示
      notAccount() {
        debugger;
        return this.selection[0].empState === '1111';
      },
      //用户状态为 正常_0000 显示
      openAccount() {
        return this.selection[0].empState === '0000';

      }
    },

    created() {
      //表格内需要的所有数据
      this.initData();
    },
    methods: {
      //获取表格内需要的数据
      initData() {
        fetchDictInfo(this.dictInfo).then(res => {
          this.politics = res.data.politicalStatus;
          this.uniyLevel = res.data.collegeLevel;
          this.postIds = res.data.empPosition;
          this.sysDept = res.data.deptList;
          this.contractType = res.data.contractType;
          //所属区域多级下拉框
          //this.areas = res.data.areaList;
          // createBelongArea(res.data.oneArea,res.data.twoArea,res.data.threeArea);
          for (let i = 0; i < res.data.oneArea.length; i++) {
            //一级节点
            let obj = {};
            obj.value = res.data.oneArea[i].value;
            obj.label = res.data.oneArea[i].label;

            //二级节点
            for (let j = 0; j < res.data.twoArea.length; j++) {
              if (obj.value == res.data.twoArea[j].parentArea) {
                if (!obj.children) {
                  obj.children = [];
                }
                let obj2 = {};
                obj2.value = res.data.twoArea[j].value;
                obj2.label = res.data.twoArea[j].label;
                obj.children.push(obj2);
                //三级节点
                for (let k = 0; k < res.data.threeArea.length; k++) {
                  if (obj2.value == res.data.threeArea[k].parentArea) {
                    if (!obj2.children) {
                      obj2.children = [];
                    }
                    let obj3 = {};
                    obj3.value = res.data.threeArea[k].value;
                    obj3.label = res.data.threeArea[k].label;
                    obj2.children.push(obj3);
                  }
                }

              }
            }
            this.belongArea.push(obj);
          }

        }).catch({});
        this.restaurants = supervisors;
      },
      /* //点击选择框时将所有选中的数据(selection)
       checkboxSelect(selection) {
         debugger
         this.selection=selection
       },*/
      initEmp() {
        this.insertForm = {
          empId: '',
          empName: '',
          sex: '',
          age: '',
          birthday: '',
          politicalStatus: '',
          certNo: '',
          domicile: '',
          educational: '',
          univId: '',
          uniyLevel: '',
          learnProfessional: '',
          category: '',
          relevantType: '',
          graduationYear: '',
          foreignLangu: '',
          employedDate: '',
          registeredDate: '',
          deptIds: [],
          postId: '',
          postName: '',
          areaId: '',
          recruitsSource: '',
          entrySalary: '',
          supervisorId: '',
          positiveDate: '',
          contractTypes: '',
          contractBeginDate: '',
          contractEndDate: '',
          qq: '',
          email: '',
          phoneNo: '',
          specialProj: '',
          specialSkill: '',
          urgContactPerson: '',
          urgContactPhone: '',
          urgContactRelation: '',
          address: '',
          departureDate: ''
        };
      },
      //新增员工按钮
      insertEleInfo() {
        this.modifyType = 'create';
        //点击新增时，清空form表单验证
        if (this.$refs['insertForm']) {
          this.$refs['insertForm'].resetFields();
        }
        this.initEmp();
        this.dialogVisible = true;
      },
      //编辑员工信息按钮
      editEleInfo() {
        var _that = this;
        _that.modifyType = 'modify';
        let data = {};
        data.empId = this.tableInstance.table.selection[0].empId;
        //获取当前员工的depts
        fetchDepts(data).then(res => {
          this.insertForm = {...this.tableInstance.table.selection[0]};
          this.insertForm.deptIds = res.data;
          this.dialogVisible = true;
        });
      },
      //弹窗保存方法
      confirmSave() {
        debugger;
        //督导人
        if (this.$refs.insertForm.model.supervisorId.length != 0) {
          let index = this.$refs.insertForm.model.supervisorId.length;
          let arr = this.$refs.insertForm.model.supervisorId;
          this.$refs.insertForm.model.supervisorId = arr[index - 1];
        }

        //所属区域
        if (this.$refs.insertForm.model.areaId.length != 0) {
          let indexArea = this.$refs.insertForm.model.areaId.length;
          let arrArea = this.$refs.insertForm.model.areaId;
          this.$refs.insertForm.model.areaId = arrArea[indexArea - 1];
        }


        this.$refs.insertForm.validate(valid => {
          if (valid) {
            this.insertForm.manageUser = '管理员';
            if (this.modifyType == 'modify') {
              //编辑保存
              modifyEmp(this.insertForm).then(() => {
                this.tableInstance.table.cleanSelection();
                this.afterModify();
              });
            } else {
              //新增保存
              modifyEmp(this.insertForm).then(() => {
                this.afterModify();
              });
            }
          } else {
            return false;
          }
        });
      },
      afterModify() {
        this.initEmp();
        this.$refs.insertForm.clearValidate();
        this.dialogVisible = false;
        this.modifyType = null;
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      },
      //弹窗关闭的方法
      insertModalClose: function() {
        this.$refs.insertForm.resetFields();
      },
      //查看详情
      handleClick: function(row) {
        let data = {};
        data.empId = row.empId;
        data.supervisorId = row.supervisorId;
        data.areaId = row.areaId;
        fetchTableInfo(data).then(res => {
          debugger;
          // row.areaId = res.data.belongArea.length == 0 ? "" : res.data.belongArea[0].name;
          // row.contractTypes = res.data.contractType.length == 0 ? "" : res.data.contractType[0].contractTypes;
          this.showEmpForm = {...row};
          this.showEmpForm.deptIds = res.data.depts ? res.data.depts : [];
          this.showEmpForm.supervisorId = res.data.superPerson.length == 0 ? '' : res.data.superPerson[0].empName;
          this.showEmpForm.contractTypes = res.data.contractType.length == 0 ? '' : res.data.contractType[0].contractTypes;
          this.showEmpForm.areaId = res.data.belongArea.length == 0 ? '' : res.data.belongArea[0].name;
          this.dialogShowVisible = true;
        });

      },
      //员工开户
      openEmpAccount() {
        let _that = this;
        _that.$confirm('确定为此员工开户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let data = {};
          data.empId = _that.tableInstance.table.selection[0].empId;
          modifyAccount(data).then(res => {
            _that.$message({
              message: res.data.retMsg,
              type: 'success'
            });
            //重新加载table
          });
        });
      },
      //员工销户
      cacleEmpAccount() {
        let _that = this;
        if (_that.tableInstance.table.selection[0].departureDate) {
          _that.$confirm('确定为此员工销户吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            let data = {};
            data.empId = _that.tableInstance.table.selection[0].empId;
            data.departureDate = _that.tableInstance.table.selection[0].departureDate;
            removeAccount(data).then(res => {
              _that.$message({
                message: res.data.retMsg,
                type: 'success'
              });
            });
          });
        } else {
          _that.$message({
            message: '请编辑员工离职日期',
            type: 'info'
          });
        }
      },
      //续签合同
      modifyContract() {
        this.dialogContractVisible = true;
        var selection = {...this.tableInstance.table.selection};
        this.contractForm.empName = selection[0].empName;
        this.contractForm.contractTypes = selection[0].contractTypes;
        this.contractForm.actualStartDate = selection[0].contractBeginDate;
        if (selection[0].contractTypes == 'A') {
          this.contractForm.actualEndDateA = selection[0].contractEndDate;
        } else if (selection[0].contractTypes == 'B') {
          this.contractForm.actualEndDateB = selection[0].contractEndDate;
        }
      },
      contractSave() {
        let data = {};
        if (this.contractForm.contractTypes == 'A') {
          data.actualEndDate = this.contractForm.actualEndDateA;
        } else {
          data.actualEndDate = this.contractForm.actualEndDateB;
        }
        data.empId = this.tableInstance.table.selection[0].empId;
        data.contractTypes = this.contractForm.contractTypes;
        data.actualStartDate = this.contractForm.actualStartDate;
        modifyEmpContract(data).then(res => {
          this.dialogContractVisible = false;
          this.$message({
            message: res.data.retMsg,
            type: 'success'
          });
        });
      },
      //导入数据
      importEmpInfo() {
        this.exportEmpModal = true;
      },
      fileChange(file, fileList) {
        let isLt = file.size / 1024 / 1024 < 20;
        if (!isLt) {
          this.$message.error('上传文件大小不能超过' + maxFileSize + 'MB!');
          this.fileList = fileList.slice(1, 1);
          return;
        }
        this.fileList = fileList.slice(-1);
      },
      submitEmpUpload() {
        let fileName = this.$refs.uploadFile.uploadFiles[0].raw.name;
        let arrFileName = fileName.split('.');
        if (arrFileName[arrFileName.length - 1] != 'xls'
          && arrFileName[arrFileName.length - 1] != 'xlsx') {
          this.$message({
            message: '请导入xls或slsx文件',
            type: 'error'
          });
          return;
        }
        let path = '\\empInfo';
        let isHaveFiles = false;
        let file = [];
        let fileSource = [];
        if (this.$refs.uploadFile.uploadFiles.length > 0) {
          isHaveFiles = true;
          file.push(this.$refs.uploadFile.uploadFiles[0].raw);
          fileSource.push('员工明细文件');
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
            let data1 = {};
            data1.fileId = ret.data.fileId;
            importEmpInfoFunction(data1).then(res => {
              // 隐藏版本弹窗
              this.exportEmpModal = false;
              this.$message({
                type: res.data.level,
                message: res.data.retMsg
              });
              //清除上传的文件
              this.$refs.uploadFile.clearFiles();
            });
          }
        }).catch(() => {
          console.log('上传失败');
          this.$refs.uploadFile.clearFiles();
        });
      },
      //模板文件下载
      empExcelDownload() {
        var data = {};
        data.fileName = 'importEmpInfo.xlsx';

        downloadTemplate(data).then(res => {
          let blob = new Blob([res.data]);
          let url = this.getObjectURL(blob);
          let link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          // 获取文件名
          link.download = 'importEmpInfo.xlsx';
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href);
        });
      },
      getObjectURL(file) {
        let url = null;
        if (window.createObjectURL !== undefined) {
          url = window.createObjectURL(file);
        } else if (window.webkitURL !== undefined) {
          url = window.webkitURL.createObjectURL(file);
        } else if (window.URL !== undefined) {
          url = window.URL.createObjectURL(file);
        }
        return url;
      },
      //督导人查询
      querySearch(queryString, cb) {
        debugger;
        var restaurants = this.restaurants;
        var results = queryString
          ? restaurants.filter(this.createFilter(queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      //根据身份证号自动补充出生日期和性别
      certNoBlur() {
        let certCard = this.insertForm.certNo;
        if (certCard == '' || certCard == null) {
          return;
        }

        if (!/^\d{17}(\d|x)$/i.test(this.insertForm.certNo)) {
          // this.rules.certNo[0].required=true;
          // postId: [{ required: true, trigger: "blur" }]
          this.$message({
            message: '你输入的身份证长度或格式错误',
            type: 'warning'
          });
        } else {
          let idCard = this.insertForm.certNo;
          this.insertForm.sex = idCard[16] % 2 == 0 ? '1' : '0';
          let birthYear = idCard.substring(6, 10);
          let birthMonth = idCard.substring(10, 12);
          let birthDay = idCard.substring(12, 14);
          this.insertForm.birthday = birthYear + '-' + birthMonth + '-' + birthDay;

        }
      },

      //根据部门获取督导人
      fetchSuperPerson(e) {
        debugger;
        if (!e || e.length == 0) {
          this.superPerson = [];
          return;
        }
        let param = {};
        this.superPerson = [];
        param.deptStr = '';
        for (let i = 0; i < e.length; i++) {
          param.deptStr = param.deptStr + '\'' + e[i] + '\',';
        }
        fetchUserByDept(param).then(res => {
          debugger;
          //设置一级级联下拉框
          for (let i = 0; i < res.data.dept.length; i++) {
            let obj = {};
            obj.value = res.data.dept[i].deptId;
            obj.label = res.data.dept[i].deptName;
            obj.children = [];
            //设置二级级联下拉框
            for (let j = 0; j < res.data.superPerson.length; j++) {
              if (obj.label == res.data.superPerson[j].remark) {
                let obj2 = {};
                obj2.value = res.data.superPerson[j].empId;
                obj2.label = res.data.superPerson[j].name;
                obj.children.push(obj2);
              } else {
                if (!obj.children) {
                  obj.children = [];
                }
              }
            }
            this.superPerson.push(obj);
          }


        });
      }

    }
  };
</script>
<style>
  .el-upload.el-upload--text {
    width: 100%;
  }

  .el-upload-dragger {
    width: 100%;
  }
</style>
