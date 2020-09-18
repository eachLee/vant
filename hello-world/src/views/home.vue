<template>
  <div class="hello">
    <van-search
      placeholder="点击选择搜索项"
      readonly
      v-model="value"
      @click="showSearchContent = true"
    />
    <div
      v-if='showSearchContent'
      class="searchContent"
    >
      <form
        action=""
        :model="formInline"
      >
        <van-cell-group>
          <van-cell>
            <van-field
              label="关键字"
              v-model="formInline.input"
              placeholder="请输入关键字"
            />
          </van-cell>
          <van-cell>
            <van-field
              v-model="formInline.follower"
              clearable
              label="跟进人"
              placeholder="请输入用户名"
            />
          </van-cell>
          <van-cell class="">
            <van-field
              readonly
              clickable
              v-model="formInline.timeBegin"
              :value="formInline.timeBegin"
              :key="formInline.timeBegin"
              label="签回开始日期"
              placeholder="请选择"
              @click="formInline.timeBegincli = true"
            ></van-field>
            <van-popup
              v-model="formInline.timeBegincli"
              position="bottom"
            >
              <van-datetime-picker
                v-model="currentDate"
                show-toolbar
                type="date"
                :formatter="formatter"
                title="选择开始日期"
                @cancel="formInline.timeBegincli = false"
                @confirm="timeBeginFn"
              />
            </van-popup>
          </van-cell>
          <van-cell class="">
            <van-field
              readonly
              clickable
              v-model="formInline.timeEnd"
              :value="formInline.timeEnd"
              :key="formInline.timeEnd"
              label="签回结束日期"
              placeholder="请选择"
              @click="formInline.timeEndcli = true"
            ></van-field>
            <van-popup
              v-model="formInline.timeEndcli"
              position="bottom"
            >
              <van-datetime-picker
                v-model="currentDate"
                show-toolbar
                type="date"
                :formatter="formatter"
                title="选择结束日期"
                :min-date="new Date(formInline.timeBegin||'2009/01/01')"
                @cancel="formInline.timeEndcli = false"
                @confirm="timeEndFn"
              />
            </van-popup>
          </van-cell>
        </van-cell-group>
      </form>
      <div class="tc step-btn footer">
        <van-button
          size="large"
          color="#666"
          @click="clearSearchFn"
        >清空</van-button>
        <van-button
          type="info"
          size="large"
          @click="searchFn"
        >筛选</van-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      height="570"
    >
      <el-table-column
        prop="createTime"
        label="签回日期"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="contractTypeName"
        label="签约类型"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="ContractName"
        label="合同名称"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="BusinessDept"
        label="事业部"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="拓展组别"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="leaderName"
        label="组长"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="chargerName"
        label="组员"
        width="70"
      >
      </el-table-column>
      <el-table-column
        prop="regionName"
        label="片区"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="businessScale"
        label="物业类型"
        width="100"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="businessScale"
        label="住宅规模（万方）"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="businessScale"
        label="商业规模（万方）"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="officeScale"
        label="写字楼规模（万方）"
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="othersScale"
        label="其他（公寓、车位、酒店）规模（万方）"
        width="280"
      >
      </el-table-column>
      <el-table-column
        prop="serviceMode"
        label="服务模式"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="startRate"
        label="起点代理费率"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="highRate"
        label="最高代理费率"
        width="140"
      >
      </el-table-column>
      <el-table-column
        prop="rangeRate"
        label="平均代理费率"
        width="140"
      >
      </el-table-column> -->
      <el-table-column
        prop="developerName"
        label="开发商"
        width="100"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="majorClient"
        label="大客户名称"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="developer"
        label="入市时间"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="developer"
        label="项目预估价"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="developer"
        label="预计应收佣金（人民币）"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="developer"
        label="项目销售周期"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="developer"
        label="合同期限"
        width="100"
      >
      </el-table-column> -->
    </el-table>
    <van-pagination
      v-model="currentPage"
      :total-items="125"
      :show-page-size="3"
      force-ellipses
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSearchContent: false,
      value: '',
      currentPage: 1,
      formInline: {
        input: "",
        follower: '',
        timeBegin: '',
        timeEnd: '',
        timeBegincli: false,
        timeEndcli: false,
        options: []
      },
      currentDate: new Date(),
      tableData: [],
      active: 0
    };
  },
  name: 'home',
  components: {
  },
  methods: {
    timeBeginFn(value) {
      this.formInline.timeBegincli = false
      this.formInline.timeBegin = value.getFullYear() +
        "-" +
        (value.getMonth() + 1) +
        "-" +
        value.getDate();
    },
    timeEndFn(value) {
      this.formInline.timeEndcli = false
      this.formInline.timeEnd = value.getFullYear() +
        "-" +
        (value.getMonth() + 1) +
        "-" +
        value.getDate();
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return `${value}日`;
    },
    searchContent() {
      if (this.disableInput) {
        return void 0;
      }
      this.estateNames = "";
      this.propertyParamPedestal = "";
      this.propertyParamHints = "";
      this.searchContentSwitch = true;
      setTimeout(() => {
        document.getElementsByClassName("focus-input")[0].focus();
      }, 10);
    },
    clearSearchFn() {
      this.formInline = {
        input: "",
        follower: '',
        timeBegin: '',
        timeEnd: '',
        timeBegincli: false,
        timeEndcli: false,
        options: []
      }
    },
    searchFn() {
      this.showSearchContent = false
      var params = {
        seachName: this.formInline.input,
        followNo: this.formInline.follower,
        signedStartTime: this.formInline.signedStartTime ? this.formInline.signedStartTime.toGMTString() : '',
        signedEndTime: this.formInline.signedEndTime ? this.formInline.signedEndTime.toGMTString() : ''

      }
      this.$axios({
        url: 'http://10.5.4.42:9090/get-signedPY-notice',
        method: 'get',
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        },
        data: JSON.stringify(params),
      }).then((res) => {
        this.tableData = res.data.result;
        console.log(res.data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .searchContent {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: #fff;
  }
</style>
