<template>
	<div style="width:975px">
	<div style='width:1240px;height:1754px;box-sizing: border-box;padding:50px 70px 0;background: #fff;transform: scale(0.8,0.8);transform-origin: left top;' ref='boxa4' v-if="pdf_show">
		<div style="width:100%;height:90px;text-align: right;padding-bottom: 20px;">
			<img src="" alt="" style="height: 100%;">
		</div>
		
		<div style="text-align: center;font-size:45px;padding-bottom: 20px;font-weight: bold;">审查意见稿</div>
		
		<div style="text-align: right;font-size: 30px;">编号：</div>
		
		<table border="3" style="border-collapse: collapse;width: 100%;height:1270px;border:1px solid #000000;height:50px;line-height: 50px;">
			<tr style="text-align: center;font-size: 30px;">
				<td width="140">建设单位</td>
				<td width="540">{{formdata.task.constructCorp}}</td>
				<td width="190">初审日期</td>
				<td>{{formdata.task.deliverDate}}</td>
			</tr>
			<tr style="text-align: center;font-size: 30px;">
				<td >工程名称</td>
				<td >{{formdata.task.displayProjectName}}</td>
				<td >专业</td>
				<td>{{formdata.opinion.profession}}</td>
			</tr>
			<tr style="text-align: center;font-size: 30px;">
				<td >设计单位</td>
				<td >{{formdata.task.designCorp}}</td>
				<td >建筑面积</td>
				<td>{{formdata.project.areas}}</td>
				<td></td>
			</tr>
			<tr style="width: 100%;height:1130px;font-size: 30px;">
				<td  >
					<div style="text-align: center;display:flex;flex-flow: column nowrap;justify-content: center;align-items: center;line-height: 40px;width: 100%;height: 100%;">
						<p>审</p>
						<p>查</p>
						<p>内</p>
						<p>容</p>
					</div>
				</td>
				<td colspan="3">
					<div style="width: 100%;height: 100%;text-align: left;">
						<h4 style="margin: 20px 0;text-indent: 10px;">审查意见：</h4>
						<template v-for='(item,index) in formdata.problems'>
							<p style="font-size:35px;line-height: 40px;text-indent:10px;margin:10px 0">{{index+1}}.{{item.gbdescription}}</p>
							<p style="font-size: 30px;color: #303030;line-height: 30px;text-indent: 50px;margin:10px 0 20px">{{item.problemDescription}}</p>
						</template>
						
					</div>
				</td>
			</tr>
		</table>
		<div style="width:100%;font-size: 30px;display: flex;text-align: left;">
			<div style="width: 33%;">审查人:{{formdata.opinion.masterCensorName}}</div>
			<div style="width: 33%;">日期:{{formdata.opinion.censorDate}}</div>
			<div style="width: 33%;">签字:</div>
		</div>
	</div>
	</div>
</template>
<script>
	export default{
		name:'tablea4',
		// props:[valuedata],
		data(){
			return {
				formdata:{},
				pdf_show:false,
				url:{
					getpdf:'draw/opinions/pdf/'
				}
			}
		},
// 		props:{
// 			formdata:Object
// 		},
		created(){
			if(this.$route.query.pdfid){
				this.getpdfdetail(this.$route.query.pdfid)
			}
		},
		methods:{
			getpdf(){
				return this.$refs.boxa4
			},
			getpdfdetail(id){
				this.$http.get(this.url.getpdf+id).then(res=>{
					this.formdata = res.body.result
					this.pdf_show = true;
				})
			},
		}
	}
</script>

<style>
	
</style>