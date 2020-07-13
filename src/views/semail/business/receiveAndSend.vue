<template>
  <div>
    <div id="smailBoxs"></div>
    <div id="pieboxs"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {

      var myChart = this.echarts.init(document.getElementById("smailBoxs"));
      myChart.setOption({
        title: {
          text: "报务统计",
          textStyle:{
            fontWeight:"normal",
            fontSize:16
          }
        },
        tooltip: {},
        legend:{
          data:['明电','秘密','机密','绝密']
        },
        xAxis: {
          data: [
            "2019-0701",
            "2019-07-02",
            "2019-07-03",
            "2019-07-04",
            "2019-07-05"
          ]
        },
        yAxis: {},
        series: [
          {
            name: "明电",
            type: "bar",
            data: [5, 10, 15, 12, 4]
          },
           {
            name: "秘密",
            type: "bar",
            data: [2, 3, 5, 2, 3]
          },
          {
            name: "机密",
            type: "bar",
            data: [4, 3, 6, 7, 5]
          },
          {
            name: "绝密",
            type: "bar",
            data: [8, 9, 5, 3, 4]
          }
          
        ]
      });
       var pieboxs = this.echarts.init(document.getElementById("pieboxs"));
       pieboxs.setOption({
         color:['#3c8dbc','#E6A23C'],
          tooltip: {},
         legend:{
          data:['收件数','发件数']
        },
         series:{
           name:'收发统计',
           type:'pie',
           radius:'50%',
           data:[
             {
               value:38,name:'收件数'
             },
             {
               value:64,name:'发件数'
             }
           ]
         }
       })
    }
  }
};
</script>
<style lang="scss" scoped>
#smailBoxs{
  width:600px;
  height:400px;
  display: inline-block;
}
#pieboxs{
 width:300px;
  height:400px;
  display: inline-block;
}
</style>


