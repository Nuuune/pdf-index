<template>
  <div id="app">
    <el-container >
      <el-aside style='width:auto;height:950px'>
        <el-card v-if="opinion_show">
          <el-row>审查意见录入</el-row>
          <el-form
            ref="opinionForm"
            style="text-align: left;"
            label-width="110px"
            :model="opinionForm"
            size="small"
            >
            <el-form-item prop="problemType" label="违反类别" :rules='{required:true,message:"该项必填"}'>
              <el-select v-model="opinionForm.problemType" placeholder="请选择" style='width:100%'>
                <el-option
                  v-for="item in problemTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="problemSubMajor" label="强标强条类型" :rules='{required:true,message:"该项必填"}'>
              <el-select v-model="opinionForm.problemSubMajor" placeholder="请选择" style='width:100%'>
                <el-option
                  v-for="item in problemSubMajorOptions"
                  :key="item.id"
                  :label="item.subProfession"
                  :value="item.subProfession">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="isHiddenDanger" label="安全隐患">
              <el-checkbox v-model="opinionForm.isHiddenDanger" :true-label='1' :false-label='0'>是</el-checkbox>
            </el-form-item>

            <el-form-item v-if="opinionForm.isHiddenDanger" prop="dangerType" label="严重程度"  :rules='{required:true,message:"该项必填"}'>
              <el-select v-model="opinionForm.dangerType" placeholder="请选择" style='width:100%'>
                <el-option
                  v-for="item in dangerTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="hiddenDangerReason" label="安全说明" v-if='opinionForm.isHiddenDanger&&opinionForm.dangerType=="严重"'  :rules='{required:true,message:"该项必填"}'>
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="opinionForm.hiddenDangerReason">
              </el-input>
            </el-form-item>
            <el-form-item prop="gbdescription" label="违反条目"  :rules='{required:true,message:"该项必填"}'>
              <el-input
                type="textarea"
                :autosize="{minRows: 2, maxRows: 2}"
                resize="none"
                placeholder="请输入内容"
                v-model="opinionForm.gbdescription">
              </el-input>
              <span>{{opinionForm.gbcaption}}</span>
            </el-form-item>

            <!-- <el-row
              :gutter="5"
              style="margin-bottom: 10px;">
              <el-col :offset="3" :span="3"><el-button type="primary" size="mini" @click="">1</el-button></el-col>
              <el-col :span="3"><el-button type="primary" size="mini" @click="">2</el-button></el-col>
              <el-col :span="3"><el-button type="primary" size="mini" @click="">3</el-button></el-col>
              <el-col :span="3"><el-button type="primary" size="mini" @click="">4</el-button></el-col>
              <el-col :span="3"><el-button type="primary" size="mini" @click="">5</el-button></el-col>
              <el-col :span="3"><el-button type="primary" size="mini" @click="">6</el-button></el-col>
            </el-row> -->

            <el-form-item prop="problemDescription" label="问题描述" >
              <el-input
                type="textarea"
                resize="none"
                :autosize="{minRows: 3, maxRows: 3}"
                placeholder="请输入内容"
                v-model="opinionForm.problemDescription">
              </el-input>
            </el-form-item>

          </el-form>




          <el-row :gutter="20" style="text-align: center;">
            <el-col :span="6"><el-button type="primary" size="mini" @click="submitProblem_handle">保存意见</el-button></el-col>
            <el-col :span="6"><el-button type="primary" size="mini" @click="criterion_show=true">查询标准</el-button></el-col>
            <el-col :span="6"><el-button type="primary" size="mini" @click="common_show=true">常用意见</el-button></el-col>
          </el-row>
          <el-row :gutter="20" style="text-align: center; margin-top: 10px">
            <el-col :span="6"><el-button type="primary" size="mini" @click="resetForm('opinionForm')">清空表单</el-button></el-col>
            <el-col :span="6"><el-button type="primary" size="mini" @click="opinion_show=false">返回目录</el-button></el-col>
          </el-row>

        </el-card>
        <el-tabs v-else v-model="activeName" type="card">
          <el-tab-pane
            name="tuzhi"
						>
            <span slot="label">图纸信息</span>
						<div style="height: 400px;overflow-y: auto;">
            <el-tree
              :data="tree.data"
              :expand-on-click-node="false"
							:default-expanded-keys='[tree.data[0].name]'
              node-key="name"
              ref="tree"
              @node-click="selectTreeID"
              highlight-current
              :props="defaultProps">
              <span class="el-tree-node__label" :title="slotProps.data.name" slot-scope="slotProps" @dblclick.stop="dbselect(slotProps.data)">
                  <i :class="[slotProps.data.type != 'drawing' ? 'el-icon-tem-wenjianjia' : 'el-icon-tem-wenben']"></i>{{slotProps.data.name}}
                  <span
                    v-if="slotProps.data.type == 'archive'"
                    :class="[slotProps.data.checkOn > 0 ? 'font-green' : slotProps.data.status == '已退回' ? 'font-red' : '']">
                    ({{slotProps.data.status}}){{slotProps.data.archiveStatus==2?'('+'缺图纸'+')':''}}</span>
              </span>
            </el-tree>
						</div>

						<template v-if='showexport'>
						    <!-- 图纸操作部分 S -->
								<template v-if='showpost'>
						       <div class="info-op" v-if="showInfo">
						          <el-row
						            type="flex"
						            justify="space-around"
						            align="center">
						            <el-col :span="6" style="line-height: 32px;">
						              当前图纸：
						            </el-col>
						            <el-col :span="14">
						              <el-input :disabled="disabled" v-model="currpdf_name" size="small" placeholder="请输入内容"></el-input>
						            </el-col>
						          </el-row>
						          <el-row
						            type="flex"
						            justify="space-around"
						            align="center">
						            <el-col :span="10"><el-button :disabled="pdf_show_read" size="small" @click="paf_back(true)" type="primary">图纸退回</el-button></el-col>
						            <el-col :span="10"><el-button :disabled="pdf_show_read" size="small" @click="paf_back(false)" type="primary">图纸作废</el-button></el-col>
						          </el-row>
						     <!--     <el-row
						            type="flex"
						            justify="space-around"
						            align="center">
						            <el-col :span="10"><el-button :disabled="disabled" size="small" @click="" type="primary">无审查意见</el-button></el-col>
						            <el-col :span="10"><el-button :disabled="disabled" size="small" @click="" type="primary">添加审查意见</el-button></el-col>
						          </el-row> -->
						          <el-row
						            type="flex"
						            justify="space-around"
						            align="center">
	<!-- 					            <el-col :span="10"><el-button size="small" @click="" type="primary">上一张</el-button></el-col>
						            <el-col :span="10"><el-button size="small" @click="" type="primary">下一张</el-button></el-col> -->
						          </el-row>
						       </div>
						        <!-- 图纸操作部分 E -->
						        <!-- 保存操作块 S -->
						       <div class="save-op" v-else>
						          <el-form
						            label-width="80px"
						            :model="saveForm"
						            size="small"
						            :disabled="disabled">

						       <!--     <el-form-item label="设计人">
						              <el-select v-model="saveForm.designer" placeholder="请选择"></el-select>
						            </el-form-item>

						            <el-form-item label="负责人">
						              <el-select v-model="saveForm.leader" placeholder="请选择"></el-select>
						            </el-form-item>

						            <el-form-item label="审核人">
						              <el-select v-model="saveForm.auditor" placeholder="请选择"></el-select>
						            </el-form-item>


						            <el-form-item label="注册师">
						              <el-select v-model="saveForm.register" placeholder="请选择"></el-select>
						            </el-form-item>

						            <el-form-item label="印章号">
						              <el-input v-model="saveForm.seal" size="small" placeholder="请输入内容"></el-input>
						            </el-form-item> -->

						            <el-form-item label="审查日期">
						              <el-date-picker
						                v-model="saveForm.date"
						                readonly
						                :editable="false"
						                :clearable="false"
						                size="small"
						                format="yyyy-MM-dd"
						                ></el-date-picker>
						            </el-form-item>

						          </el-form>

						          <el-row
						            type="flex"
						            justify="space-around"
						            align="center">
			<!-- 			            <el-col :span="10"><el-button size="small" @click="" type="primary">保存</el-button></el-col> -->
						            <el-col :span="10"><el-button size="small" :disabled="isSubmit" @click="this.opinionComplete" type="primary">审查完成</el-button></el-col>
						          </el-row>
						          <el-row v-if="clickedNodeData.checkOnReson">
						            <el-col style="text-align:left;">
						              <span class="font-red">上次退回原因：{{clickedNodeData.checkOnReson}}</span>
						            </el-col>
						          </el-row>
						        </div>
										</template>
										<template v-if='noDrawing'>
												<el-row>
													<el-button type='primary' @click='no_drawing'>缺图纸</el-button>
												</el-row>
										</template>
										</template>
          </el-tab-pane>
					<el-tab-pane label='审查意见'>
						<el-row style='overflow: auto;max-height:800px'>
							<div style='width:400px;'>
							<el-table :data='self_work'
							@cell-dblclick='pdfset'
							@select='self_wens'
							@select-all='self_wens'>
								<el-table-column type='selection' width='40' ></el-table-column>
								<el-table-column label='审查问题' prop='problemDescription' align='center'></el-table-column>
								<el-table-column label='问题类别' prop='problemType' align='center' width='100'></el-table-column>
								<el-table-column label='问题子专业' prop='problemSubMajor' align='center' width='100'></el-table-column>
							</el-table>
							</div>

						</el-row>
						<el-row style='margin-top:10px'>
							<el-button type='danger' :disabled='!self_wensdata.length' @click='self_all_del("self")'>删除</el-button>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label='其他专家意见' v-if='showexport'>
						<el-row style='overflow: auto;max-height:800px'>
							<div style='width:400px'>
							<el-table :data='other_work'
							@cell-dblclick='pdfset'
							@select='other_wens'
							@select-all='other_wens'>
								<el-table-column type='selection' width='40' ></el-table-column>
								<el-table-column label='审查问题' prop='problemDescription' align='center'></el-table-column>
								<el-table-column label='问题类别' prop='problemType' align='center' width='100'></el-table-column>
								<el-table-column label='问题子专业' prop='problemSubMajor' align='center' width='100'></el-table-column>
							</el-table>
							</div>
						</el-row>
				<!-- 		<el-row style='margin-top:10px'>
							<el-button type='danger' :disabled='!other_wensdata.length' @click='self_all_del("other")'>删除</el-button>
						</el-row> -->
					</el-tab-pane>
        </el-tabs>


        <!-- 保存操作块 E -->
      </el-aside>
      <el-main style="padding: 0 20px;margin-left:2px">
        <el-row style="text-align: left;"><el-col style='height:40px;line-height: 40px;font-size: 18px;' :span='20'>{{currpdf_name}}</el-col>
			<!-- 	<el-col :span='2' :push='2'>
					<el-button type='primary' size='small'>意见汇总</el-button>
				</el-col> -->
				</el-row>
        <el-row >
					<!-- <template v-if="pdf_show">
							<tablea4 :formdata="pdfdetail" ref='box5'></tablea4>
					</template> -->
					<!-- <template v-show="pdfPanel_show"> -->
            <div style="width:100%; height: 700px; background: #2b2d26">
              <object v-if="PDFReader_show" id="PDFReader" ref="PDFReader" align='middle' style="left: 0px; width: 100%; top: 0px; height: 100%" classid=clsid:3BCB99FC-44E6-407A-ACE8-9E20BFAA1A0F></object>
            </div>
					<!-- </template> -->
        </el-row>
      </el-main>
    </el-container>

		<el-dialog @close='common_show=false' :visible='common_show' width='50%' title='常用标准'>
			<el-form :model='common_form' size='small'>
				<el-form-item prop='search'>
					<el-row>
						<el-col :span='10'>
							<el-select>
								<el-option></el-option>
							</el-select>
						</el-col>
						<el-col :span='10'>
							<el-input></el-input>
						</el-col>
						<el-col :span='4'>
							<el-button>查询</el-button>
						</el-col>
					</el-row>
				</el-form-item>w
			</el-form>
			<el-row v-for='item in standard_data' :key="item" class='common_list'>
				<el-col :span='18'>{{item}}</el-col>
				<el-col :span='5' :push='1'>{{item}}</el-col>
			</el-row>
		</el-dialog>

		<el-dialog :visible='criterion_show' @close='criterion_show=false' width='70%' title='标准查询'>
			<el-form :model='criterion_form' label-width='100px' size='small' >
				<el-form-item prop='' label='选择专业:'>
					<el-row>
						<el-col :span='7'>
							<el-select style='width:100%' v-model='standard'>
								<el-option v-for='item in standard_data' :value='item' :key='item' :label='item'></el-option>
							</el-select>
						</el-col>
						<el-col :span='12'>
							<el-col :span='19'>
								<el-form-item label='结果搜索' >
									<span @keydown.enter='getstandData'>
									<el-input v-model='stand_search' :disabled='!stdid'></el-input>
									</span>
								</el-form-item>
							</el-col>
							<el-col :span='4' :push='1'>
								<el-button size='small' @click='getstandData' :disabled='!stdid'>搜索</el-button>
							</el-col>
						</el-col>
					</el-row>
				</el-form-item>
				<el-row style='height:600px'>
					<el-col :span='6' style='height: 100%;'>
						<div  class='criterion_item' >
							<div v-for="item in common_list"
							:class="{'active':stdid==item.stdid}"
							@click="stdid=item.stdid">{{item.caption}}
								<div>({{item.stdid}})</div>
							</div>
						</div>
					</el-col>
					<el-col :span='18' style='height: 100%;'>
						<div  class='criterion_item'>
							<div v-for="item in stand_contant"
							style="font-size: 16px;color: #303030;"
							@dblclick="selectDrp(item)"><span style="margin-right: 10px;">{{item.chapter}}</span><span v-html="item.content"></span></div>
						</div>
					</el-col>
				</el-row>
			</el-form>

		</el-dialog>

  </div>
</template>
<script>

  import {
    PROBLEM_TYPE_OPTIONS,
    PROBLEM_SUBMAJOR_OPTIONS,
    DANGER_TYPE_OPTIONS
  } from './constants.js'
	import tablea4 from './temp.vue';
  export default {
    data() {
      return {
        problemMap: {},
        PDFReader_show: true,
        opinion_show: false,
        pdfPanel_show: true,
        activeName: 'tuzhi',
				noDrawing:false,
        url:{
          tasks:'/draw/tasks/opinion-tree',
          opinionComplete: '/draw/opinions/complete-profession',
          problemSubmit: '/draw/problem/submit',
					problemSave: '/draw/problem/save/',
          upload:'/design/att/uploadatt',
          getProblems: '/draw/problem/no-paging',
					selfdata:'/draw/problem/self',
					otherdata:'/draw/problem/other',
					alldelete:'/draw/problem/batch-delete',
					getpdf:'draw/opinions/pdf/',
					getProfession:'draw/subprofession/no-paging',
					repulse:'draw/drawing/reject/',
					cancellation:'draw/drawing/trash/',
					standard:'/draw/standard/profession',
					stand_list:'draw/standard/std?profession=',
					standardData:'draw/standard/no-paging?stdid=',
					noDrawing:'draw/opinions/no-drawing'
        },
        nodeData:{},
        disabled:true,
        tree:{
          data:[{name:''}]
        },
        taskID:'',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
				showpost:false,
				common_show:false,
				common_form:{},
				common_list:[],
				stand_search:'',
				stand_contant:[],
				stdid:'',
				standard_data:[],
				standard:'',
				criterion_show:false,
				criterion_form:{},
				iframe_url:'',
				pdf_show_read:false,
        currpdf_name: '暂无图纸',
        currpdf_parentid: '',
				pdfdetail:{},
				pdf_show:false,
        saveForm: {
          designer: '',
          leader: '',
          auditor: '',
          register: '',
          seal: '',
          date: new Date()
        },
        opinionForm: {
          problemType: '',
          problemSubMajor: '',
          isHiddenDanger: 0,
          dangerType: '',
          gbdescription: '',
          problemDescription: '',
          drawingNumber: null,
					projectId:'',
					hiddenDangerReason:''
        },
        problemTypeOptions: PROBLEM_TYPE_OPTIONS,
        problemSubMajorOptions: [],
        dangerTypeOptions: DANGER_TYPE_OPTIONS,
        dialogVisible: false,
        clickedNodeData: null,
        showInfo: true,
				self_work:[],
				other_work:[],
				showexport:false,
				self_wensdata:[],
				other_wensdata:[]
      };
    },
		components:{
			tablea4
		},
    computed: {
      isSubmit() {
        return this.clickedNodeData.readOnly===undefined||this.clickedNodeData.readOnly
      }
    },
    created() {
      // 初始化请求id
      this.query_id = this.PDFURL().query.id
      document.cookie=`JSESSIONID=${this.PDFURL().query.session}`;
      if (this.query_id) {
        this.getParams()
        this.getzhengd()
        this.getstand()
      }
      window.AZTBrowser.sendStatus(0, 'load');
    },
    mounted(){
      this.$nextTick(() => {
        this.initPDFComponent()
      })
    },
		watch:{
			standard(){
				this.getstandList()
			},
			stdid(){
				this.stand_search = '';
				this.getstandData()
			},
      common_show(cv) {
        this.PDFReader_show = !cv
      },
      criterion_show(cv) {
        this.PDFReader_show = !cv
      }
		},
    methods: {
      initPDFComponent () {

        this.pr = this.$refs.PDFReader;
        const pr = this.pr;
        const AZTBrowser = window.AZTBrowser;

        // pr.SetAnnotPermission(1);

        pr.SetBorderColor(86,86,86);  //设置边框颜色值
        pr.SetTabShow(false);        //TAB是否显示

        pr.SetSidebarShow(false);    //左边侧栏
        // pr.SetToolboxShow(false);    //右边侧工具箱是否显示
        // pr.SetDocToolbarShow(false); //文档工具栏是否显示

        pr.SetAnnotTipWndShow(false,"");

        pr.SetDocToolbarButtonShow(1, false, "") // 隐藏文档工具栏不需要的按钮
        pr.SetDocToolbarButtonShow(2, false, "") // 隐藏文档工具栏不需要的按钮
        pr.SetDocToolbarButtonShow(3, false, "") // 隐藏文档工具栏不需要的按钮
        pr.SetDocToolbarButtonShow(4, false, "") // 隐藏文档工具栏不需要的按钮
        pr.SetDocToolbarButtonShow(5, false, "") // 隐藏文档工具栏不需要的按钮
        pr.SetToolboxButtonShow(1, 0, false, "") // 隐藏右边侧工具箱不需要的按钮
        pr.SetToolboxButtonShow(2, 0, false, "") // 隐藏右边侧工具箱不需要的按钮
        pr.SetToolboxButtonShow(4, 0, false, "") // 隐藏右边侧工具箱不需要的按钮
        pr.SetToolboxButtonShow(5, 0, false, "") // 隐藏右边侧工具箱不需要的按钮

        // pr.SetAnnotPermission(4)

      },
      PDF_onlyReader(bool) {
        if (bool) {
          this.pr.SetAnnotPermission(4)
        } else {
          this.pr.SetAnnotPermission(2)
        }
      },
      onPDF_openFile(IsSucceed, FilePath, PDFID, Extend) { // pdf 文件打开的回调

        if (IsSucceed) {
          this.getProblems(this.opinionForm.drawingNumber).then(
            (resp) => {
              if (resp.data && resp.data.status == 200) {
                // 初始化svg数组
                // alert(JSON.stringify(resp.data.result))

                const regx = /<GUID>(.*?)<\/GUID>/g;

                let xml_init = ''

                resp.data.result.forEach(item => {

                  xml_init += item.annotXml
                  let guid =  ''

                  item.annotXml.replace(regx, function(m, p) {
                    guid = p
                    return m
                  })

                  const { drawingX, drawingY, isHiddenDanger,
                    problemType, problemSubMajor, dangerType, gbdescription,
                    problemDescription, id,gbcaption,hiddenDangerReason
                  } = item;


                  this.problemMap[guid] = {
                    isHiddenDanger,
                    problemType, problemSubMajor, dangerType,  gbdescription,
                    problemDescription,projectId:item.id,gbcaption,hiddenDangerReason
                  }

                })

                xml_init = `<root>${xml_init}</root>`;
                this.pr.AddAnnot(3, xml_init, "");

              } else {
                alert('getProblems fail')
                console.log('getProblems fail');
              }
            },
            (err) => {
              alert('getProblems fail')
              console.log('getProblems fail');
              console.log(err);
            }
          );
        }
      },
      onPDF_selectAnnot(ZSGuid, ZSType, Extend) { // pdf 注释选择后的回调
        this.opinion_show = true;
        this.activeGUID = ZSGuid;
        let problem = this.problemMap[ZSGuid];
        if (problem) this.opinionForm = problem;
      },
      onPDF_addAnnot(ZSGuid, ZSType, Extend) { // pdf 添加标注后的回调
        this.pr.SetToolboxShow(false);
        this.opinion_show = true;
        this.activeGUID = ZSGuid;
        // this.PDF_onlyReader(true);
      },
      PDF_getCurrAnnot() { // 获取当前页面的所有标注
        let annotXml = this.pr.GetAllAnnotInfo("");
        const reg = /(<annot>(?:.*?)<\/annot>)/g;
        const regx = /<GUID>(.*?)<\/GUID>/g;
        annotXml = annotXml.replace(/\n|\t|\r/gm, '');
        let annotXmlMap = {};
        annotXml.replace(reg, function(match, p1){
          p1.replace(regx, function(m, p) {
            annotXmlMap[`${p}`] = p1;
            return m
          })
          return match;
        });
        return annotXmlMap;
      },
      PDFOpenFile ({pdfurl, pdfname}) { // 打开pdf文件
        const pr = this.pr;
        pr.CloseFile(-1) // 先关闭所有文件
        pr.OpenFile(2,`http://47.99.36.241/upload/${pdfurl}`,"","");
        pr.SetDocName(pdfname)
        pr.SetReadZoom(-1) // 设置适合宽度
      },
      PDFURL() {
  			const URL = window.location.href
  			const arr = URL.split('?')
  			const hash = arr[0]
  			let query = arr[1]?arr[1]:''
  			const qus = {}
  			if(query){
  				query = query.split('&');
  				for(let n=0; n<query.length; n++){
  					let hs = query[n].split('=');
  					qus[hs[0]]=hs[1]?hs[1]:'';
					}
				}
				return {
					query:qus,
					url:hash
				}
			},
			selectDrp(data){
				let list  = ['caption','chapter',	'content','contenttype','no','sdcno','stdid','topicaltype']
				let form = {};
				list.forEach(item=>{
					form['gb'+item]=data[item]
				});
				form.gbdescription=`${data.caption}(${data.stdid} ${data.chapter})`;
				this.opinionForm = Object.assign(this.opinionForm,form);
				this.criterion_show=false
			},
			getstandData(){
				let loading = this.$loading()
				this.$http.get(this.url.standardData+this.stdid).then(res=>{
					this.stand_contant = res.body.result.filter(item=>item.content.indexOf(this.stand_search)>-1||(item.chapter&&item.chapter.indexOf(this.stand_search)>-1))
					loading.close()
				})
			},
			getstandList(){
				let loading = this.$loading()
				this.stand_search = '';
				this.$http.get(this.url.stand_list+this.standard).then(res=>{
					this.common_list = res.body.result
					loading.close()
				})
			},
			getstand(){
				this.$http.get(this.url.standard).then(res=>{
					this.standard_data = res.body.result;
				})
			},
// 			getpdf(){
// 				console.log(this.$refs.getpdf.getpdf())
// 			},
			self_all_del(ty){
				let ids = []
				if(ty == 'self'){
					this.self_wensdata.forEach(item =>{
						ids.push(item.id)
					})
				}else{
					this.other_wensdata.forEach(item =>{
						ids.push(item.id)
					})
				}
				this.$confirm('您确定要删除所选的内容吗?','提示').then(re=>{
					this.$http.post(this.url.alldelete,ids).then(res=>{
						if(res.body.status == 200){
							this.$message({
								type:'success',
								message:'删除成功'
							})
							this.getzhengd()
						}else{
							this.$message({
								type:'warning',
								message:'错误:'+res.body.message,
								showClose:true
							})
						}
					})
				}).catch(re=>{})
			},
			self_wens(data){
				this.self_wensdata=data
			},
			other_wens(data){
				this.other_wensdata=data
			},
			pdfset(data){
        if (data.readOnly) {
          window.noDrawing = true;
        } else {
          window.noDrawing = false;
        }
				// window.noDrawing = false;

        this.opinionForm.drawingNumber = data.drawingNumber;
        this.currpdf_name = data.drawing.drawingName;


				const { drawingX, drawingY, isHiddenDanger,
					problemType, problemSubMajor, dangerType, gbdescription,
					problemDescription, id,gbcaption,hiddenDangerReason
				} = data;
			},
			getzhengd(){
				this.$http.get(this.url.selfdata+`/${this.query_id}`).then(res=>{
					if(res.body.status == 200){
						this.self_work = res.body.result
					}else{
						this.$message({
							type:'warning',
							message:'错误：'+res.body.message,
							showClose:true
						})
					}
				})
				this.$http.get(this.url.otherdata+`/${this.query_id}`).then(res=>{
					if(res.body.status == 200){
						this.other_work = res.body.result
						this.showexport=true
					}else{
						this.showexport=false
					}
				})
			},
			dbselect(data){
			if(data.url){
				let pdf = JSON.stringify(data)
				window.open(`/#/expertBlankpdf?id=${this.query_id}&pdfdata=${pdf}`)
			}
			},
      resetForm(formName) {
        this.opinionForm = {
          problemType: '',
          problemSubMajor: '',
          isHiddenDanger: 0,
          dangerType: '',
          gbdescription: '',
          problemDescription: '',
          drawingNumber: null,
					projectId:'',
					hiddenDangerReason:"",
					gbcaption:''
        }
      },
			closeForm(){
				if(!this.opinionForm.gbdescription){
					framename.window.delRect(window._dbID)
				}
			},
      showDialog() {
        let svg;
        for(let i = 0; i < window._svgArr.length; i++) {
          if (window._svgArr[i].id == window._dbID) {
            svg = window._svgArr[i];
            break;
          }
        }
				if(!svg.form){
					this.opinionForm = {
						problemType: '',
						problemSubMajor: '',
						isHiddenDanger: 0,
						dangerType: '',
						gbdescription: '',
						problemDescription: '',
						drawingNumber: null,
						projectId:'',
						hiddenDangerReason:"",
						gbcaption:''
					}
				}
        this.opinionForm = Object.assign({}, this.opinionForm, svg.form);
        this.dialogVisible = true;
      },
      submitProblem_handle() {
        const pr = this.pr
				this.$refs.opinionForm.validate((valid) =>{
					if(valid){
						let index;

				        const drawingData = {
				          annotXml: this.PDF_getCurrAnnot()[this.activeGUID]
				        }
				        const data = Object.assign({}, this.opinionForm, drawingData, {isHiddenDanger: this.opinionForm.isHiddenDanger ? 1 : 0});


								if(data.projectId){
									this.problemSave(data).then(
										(resp) => {
                      alert(JSON.stringify(resp))
											this.resetForm('opinionForm');
                      pr.SetToolboxShow(true);
                      this.opinion_show = false;
                      this.activeGUID = '';
                      // this.PDF_onlyReader(false);
											this.getzhengd();
										},
										(err) => {
                      alert(JSON.stringify(err))
                      pr.SetToolboxShow(true);
                      this.opinion_show = false;
                      this.activeGUID = '';
                      // this.PDF_onlyReader(false);
										}
									);
								}else{
									this.problemSubmit(data).then(
					          (resp) => {
                      alert(JSON.stringify(resp))
                      this.resetForm('opinionForm');
                      pr.SetToolboxShow(true);
                      this.opinion_show = false;
                      this.activeGUID = '';
                      // this.PDF_onlyReader(false);
					            this.getzhengd();
										},
										(err) => {
                      alert(JSON.stringify(err))
                      pr.SetToolboxShow(true);
                      this.opinion_show = false;
                      this.activeGUID = '';
                      // this.PDF_onlyReader(false);
										}
									);
								}
					}else{
						return false
					}
				})


      },
      findParentID(node) {
        if (node.parent.data.id) {
          return node.parent.data.id;
        } else {
          return this.findParentID(node.parent);
        }
      },
			getpdfdetail(id){
			this.pdf_show = true;
			this.$nextTick(()=>{
				this.$refs['box5'].getpdfdetail(id)
				})
			},
			getProfession(name){
				this.$http.get(this.url.getProfession+'?profession='+name).then(res=>{
					this.problemSubMajorOptions = res.body.result
				})
			},
			paf_back(ds){
				let id = this.clickedNodeData.id;
				let url = ds?'repulse':'cancellation';
				this.$confirm('请确认操作','提示').then(res=>{
					this.$http.post(this.url[url]+id).then(resp=>{
						this.$message.success('操作成功');
						this.query()
					})
				}).catch(er=>{})
			},
			no_drawing(){
				let form = {projectID:this.clickedNodeData.projectId,profession:this.clickedNodeData.profession}
				this.$confirm('确认标记为缺图纸吗？','提示').then(res=>{
					this.$http.post(this.url.noDrawing,form).then(resp=>{
						if(resp.body.status == 200){
							this.$message.success('操作成功');
							this.query()
						}else{
							this.$message({
								type:'error',
								showClose:true,
								message:'错误'+resp.body.message
							})
						}
					})
				}).catch(()=>{})
			},
      selectTreeID(data, node, self){

				if(data.children&&data.children.length&&data.children[0].profession){
					this.getpdfdetail(data.children[0].id)
				}else{
					this.pdf_show = false
				};
        this.clickedNodeData = data;
				if(data.children && data.children.length && data.children[0].type == 'archive'){
					this.clickedNodeData.checkOnReson = data.children[0].checkOnReson
				}

				if(data.type&&data.type=='drawing'){
					this.getProfession(node.parent.parent.data.name)
					this.pdf_show_read = data.status===3?true:false;
				};
        // this.disabled = true;
        if(data.type&&data.type == "archive"){
					data.readOnly?this.noDrawing = false :this.noDrawing = true;
					this.showpost = false
          this.saveID = data.id;
        }else{
					this.showpost=true;
					this.noDrawing = false;
					if(data.readOnly!==undefined){
					this.showInfo = false
					}
				};
				if(data.reply||data.trash){
					this.showpost=false
				};
				if(data.url){ // pdf
          this.saveID = this.findParentID(node);
          this.currpdf_parentid = this.findParentID(node);
          if (node.parent.data.readOnly) {
            window.noDrawing = true;
          } else {
            window.noDrawing = false;
          }
					// window.noDrawing = false;

          this.opinionForm.drawingNumber = data.id;
          this.showInfo = true;

          this.currpdf_name = data.name;
          this.PDFOpenFile({pdfurl: window.encodeURIComponent(data.url), pdfname: this.currpdf_name})
				}
      },
      query(){
        this.$http.get(
          `${this.url.tasks}/${this.taskID}` ,
        ).then((res) => {
          if (res.ok) {
						res.data.result.reply=true;
            const datas = [];
            datas.push(res.data.result);
            this.tree.data = datas;console.log(datas)
          } else {
            alert(JSON.stringify(data))
            this.$message.error('查询失败，请联系管理员');
          }
        },(error)=>{
          alert(JSON.stringify(error))
          this.$message.error('查询失败，请联系管理员');
        })
      },
      beforeUpload(file) {
      },
      // 审查完成接口
      opinionComplete() {
				let _this = this;
				let data = this.clickedNodeData
        this.$http.post(
          `${this.url.opinionComplete}/${this.query_id}`,
					data.name
        ).then(
          (resp) => {
            if (resp.data && resp.data.status == 200) {
              this.$message({
                message: `审查完成`,
                type: `success`
              });
							_this.query()
//               this.clickedNodeData.checkOn = 1;
//               this.clickedNodeData.status = '已提交';
//               this.clickedNodeData = Object.assign({}, this.clickedNodeData);
            } else {
              this.$message({
                message: `审查失败`,
                type: `warning`
              })
            }
          },
          (err) => {
            this.$message({
              message: `审查失败`,
              type: `warning`
            })
          }
        )
      },
      // 图纸意见标注接口
      problemSubmit(data) {
        return this.$http.post(
          `${this.url.problemSubmit}/${this.currpdf_parentid}`,
          data
        )
      },
			problemSave(data){
				return this.$http.post(this.url.problemSave+data.projectId,data)
			},
      // 获取图纸意见标注接口
      getProblems(drawingNumber) {
        return this.$http.get(
          `${this.url.getProblems}`,
          {params: {drawingNumber}}
        )
      },
      //上传错误
      uploadFail(err, file, fileList) {
        this.url.upload="/design/att/uploadatt"
      },
      //上传成功
      uploadSuccess(response, file, fileList) {
        /*this.form.data.organizationImage = response.filePath;*/
        this.url.upload="/design/att/uploadatt";
        this.query();
      },
      loaded() {
        const vm = this.$refs.iframe.contentWindow.vm;
        console.log(vm)
        //vm.func1()
      },
      getParams () {
        // 取到路由带过来的参数
        let id = this.query_id;
        this.taskID = id;
        this.query();
      },
    },
  };
</script>
<style>
  html,body,#app{
    height: 100%;
  }
  .el-main {
    overflow: initial;
  }
  .info-op, .save-op {
    font-size: 14px;
  }
  .info-op .el-row {
    margin-top: 20px;
  }
  .info-op .el-row .el-button, .save-op .el-row .el-button {
    width: 100%;
  }
  span.el-tree-node__label {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .font-green {
    color: #73e64d;
  }
  .font-red {
    color: #e74141;
  }

	.common_list{
		padding: 10px 0 ;
		font-size: 14px;
		border-bottom:1px solid #EAEAEA;
		cursor: pointer;
	}
	.common_list:hover{
		background: #efefef;
	}

	.criterion_item{
		cursor: pointer;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		box-sizing: border-box;
		border-right: 1px solid #000;
	}
	.criterion_item>div{
		padding: 5px;
		text-align: left;
		border-bottom: 1px solid #EAEAEA;
	}
	.criterion_item .active{
		background: #eaeaea;
	}
	.criterion_item>div:active{
		background: #eaeaea;
	}
</style>
