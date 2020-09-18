<template>
  <div class="main">
    <div
      v-show="isShow"
      id="container"
    ></div>
    <van-tabs
      v-show="isShow"
      v-model="active"
      @change="changeType"
      id="resultsBox"
    >
      <van-tab
        class="result-tabs"
        v-for="(item,index) in typeList"
        :key="index"
        :title="item"
      >
        <van-list
          v-if="item!=='教育'"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="(item,index) in results"
            :key="item.uid"
            class="result-item clearfix"
            :class="{'active-item':activeIndex===index}"
            @click="resultsClick(item,index)"
          >
            <span class="result-title">{{item.title}}</span>
            <span class="distance">{{getDistance(item.point)}}</span>
            <van-cell
              class="result-details"
              :title="item.address"
            />
          </div>
        </van-list>
        <van-tabs
          v-else
          v-model="schoolActive"
          @change="changeType"
        >
          <van-tab
            v-for="(item,index) in schoolList"
            :key="index"
            :title="item"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div
                v-for="(item,index) in results"
                :key="item.uid"
                class="result-item clearfix"
                :class="{'active-item':activeIndex===index}"
                @click="resultsClick(item,index)"
              >
                <span class="result-title">{{item.title}}</span>
                <span class="distance">{{getDistance(item.point)}}</span>
                <van-cell
                  class="result-details"
                  :title="item.address"
                />
              </div>
            </van-list>
          </van-tab>
        </van-tabs>
      </van-tab>
    </van-tabs>
    <div
      ref="infoWindows"
      class="info-window"
    >
      <div class="info-title">{{addressDetails.title}}</div>
      <div class="info-details">{{addressDetails.address}}</div>
      <div
        class="info-icon"
        @click="gotoNavigation"
      >点击导航</div>
    </div>
    <div
      v-show="!isShow"
      id='navigationMap'
    ></div>
    <div
      v-show="!isShow"
      id="results"
    ></div>
  </div>
</template>

<script>
import { Tab, Tabs, List, Cell } from 'vant';
export default {
  name: 'NEWPAROPERTY_NEARBY',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [Cell.name]: Cell
  },
  data() {
    return {
      typeList: ["附近楼盘", "地铁", "公交", "教育", "医疗", "银行", "购物", "餐饮"],
      schoolList: ["全部学校", "幼儿园", "小学", "中学", "高等学校"],
      isShow: true,
      map: {},
      navigationMap: {},
      point: {},
      circle: {},
      local: {},
      range: 1200,
      results: [],
      loading: true,
      page: 1,
      finished: false,
      active: '',
      prevItem: null,
      resultsPages: 0,
      schoolActive: '',
      addressDetails: {},
      mainMarker: null,
      infoWindow: null,
      activeIndex: undefined,
    };
  },
  mounted() {
    this.baiduMap(116.404, 39.915)
  },
  created() {
  },
  methods: {
    //百度地图
    baiduMap(x, y) {
      this.map = new BMap.Map('container', { enableMapClick: false });
      this.point = new BMap.Point(x, y)
      let positionIcon = new BMap.Icon("http://api.map.baidu.com/images/markers_hd.png", new BMap.Size(22, 31), {
        anchor: new BMap.Size(11, 31),
        imageSize: new BMap.Size(85, 477),
        imageOffset: new BMap.Size(0, 0 - 11 * 32) // 设置图片偏移  
      });
      // 初始化地图，设置中心点坐标和地图级别
      this.map.centerAndZoom(this.point, 15)
      this.marker = new BMap.Marker(this.point, {
        icon: positionIcon,
        enableMassClear: false,
      }) // 创建标注
      //创建信息窗口
      this.infoWindow = new BMap.InfoWindow(this.$refs['infoWindows']);
      this.map.enableScrollWheelZoom(true) ////启用滚轮放大缩小
      // marker.setIcon()
      this.map.addOverlay(this.marker) //创建标注
      this.marker.openInfoWindow(this.infoWindow)

      let geoc = new BMap.Geocoder();
      geoc.getLocation(this.point, (res) => {
        if (res && res.surroundingPois) {
          this.addressDetails = res.surroundingPois[0];
        }
      })
      this.marker.addEventListener("click", (e) => {
        this.marker.openInfoWindow(this.infoWindow)
      });
      this.local = new BMap.LocalSearch(this.map,
        { renderOptions: { autoViewport: true } });
      this.local.searchNearby("楼盘", this.point, this.range);
      this.local.setSearchCompleteCallback(res => {
        console.log(res);
        if (res) {
          this.resultsPages = res.getNumPages()
          let displayIconRes = res.Hr.map(item => {
            this.addMarker(item.point, item)
            return item;
          })
          this.results.push(...displayIconRes);
          this.loading = false;
        } else {
          this.resultsPages = 0;
          this.finished = true;
        }
        console.log(this.resultsPages);
      })
      this.local.disableFirstResultSelection()
    },
    addMarker(point, item) {
      let activeIcon = new BMap.Icon("http://api.map.baidu.com/images/markers_hd.png", new BMap.Size(22, 31), {
        anchor: new BMap.Size(11, 31),
        imageSize: new BMap.Size(85, 477),
        imageOffset: new BMap.Size(0, 0 - 12 * 32) // 设置图片偏移  
      });
      let marker = new BMap.Marker(point, {
        icon: activeIcon
      });
      item.marker = marker;
      marker.addEventListener("click", (ev) => {
        console.log(ev);
        this.marker.closeInfoWindow()
      });
      this.map.addOverlay(marker);
    },
    //计算两点之间的距离
    getDistance(point) {
      return this.map.getDistance(this.point, point).toFixed(2) + 'm'
    },
    resultsClick(item, index) {
      this.activeIndex = index;
      console.log(index);
      // let marker = new BMap.Marker(item.point)
      let imageOffsetHeight = item.marker.getIcon().imageOffset.height;
      let activeIcon = new BMap.Icon("http://api.map.baidu.com/images/markers_hd.png", new BMap.Size(22, 31), {
        anchor: new BMap.Size(11, 31),
        imageSize: new BMap.Size(85, 477),
        imageOffset: new BMap.Size(-29, 0 - 11 * 32) // 设置图片偏移  
      });
      if (this.prevItem) {
        activeIcon.imageOffset = new BMap.Size(0, 0 - 12 * 32)
        this.prevItem.marker.setIcon(activeIcon)
      }
      this.prevItem = item;
      activeIcon.imageOffset = new BMap.Size(-29, 0 - 11 * 32)
      item.marker.setTop(true)
      item.marker.setIcon(activeIcon)
    },
    changeType(key, title) {
      this.map.clearOverlays()
      this.results = [];
      this.loading = true;
      this.page = 1;
      this.finished = false;
      this.local.searchNearby(title, this.point, this.range, {
        onSearchComplete(res) {
          if (res) {
            this.resultsPages = res.getNumPages()
            let displayIconRes = res.Hr.map(item => {
              // item.marker.setIcon(activeIcon)
              this.addMarker(item.point, item)
              return item;
            })
            this.results = displayIconRes;
            this.loading = false
          } else {
            this.resultsPages = 0;
            this.finished = true;
          }
        }
      })
    },
    gotoNavigation() {
      this.isShow = false
      this.navigationMap = new BMap.Map("navigationMap");
      this.navigationMap.centerAndZoom(new BMap.Point(116.404, 39.915), 14);

      var driving = new BMap.DrivingRoute(this.navigationMap, {
        renderOptions: {
          map: this.navigationMap,
          panel: "results",
          autoViewport: true
        },
        // onSearchComplete: function (results) {
        //   console.log(driving.getStatus());
        //   // if (driving.getStatus() == 'BMAP_STATUS_SUCCESS') {
        //   if (results) {
        //     // 获取第一条方案   
        //     let plan = results.getPlan(0);
        //     let planDistance = plan.getDistance()
        //     let planDuration = plan.getDuration()
        //     console.log(planDistance, planDuration);
        //     // 获取方案的驾车线路   
        //     let route = plan.getRoute(0);
        //     // 获取每个关键步骤，并输出到页面   
        //     let s = [];
        //     for (let i = 0; i < route.getNumSteps(); i++) {
        //       let step = route.getStep(i);
        //       console.log(step);
        //       s.push((i + 1) + ". " + step.getDescription());
        //     }
        //     document.getElementById("results").innerHTML = s.join("<br>");
        //   }
        // }
      });
      var start = new BMap.Point(116.310791, 40.003419);
      var end = new BMap.Point(116.486419, 39.877282);
      driving.search(start, end);

    },
    onLoad() {
      if (this.resultsPages > this.page) {
        this.page++
        this.local.gotoPage(this.page)
      } else {
        this.finished = true;
      }
    }
  },
}

</script>
<style scoped lang="scss">
  .main {
    height: 100%;
  }
  #container {
    height: 70%;
  }
  #navigationMap {
    height: 70%;
  }
  #resultsBox {
    max-height: 30%;
    padding-top: 36px;
    overflow-y: auto;
    /deep/.van-tabs__wrap--scrollable {
      position: fixed;
      top: 69%;
      z-index: 999;
    }
  }
  #results {
    max-height: 30%;
    overflow-y: auto;
  }
  .result-item {
    margin: 0 10px;
    padding: 10px;
  }
  .active-item {
    background-color: #f6f6f6;
    * {
      background-color: #f6f6f6;
    }
  }
  .result-title {
    font-size: 14px;
    color: #f73343;
    padding: 0;
    float: left;
    width: 84%;
  }
  .result-details {
    padding: 0;
    font-size: 12px;
    border-bottom: 1px solid #eee;
  }
  .distance {
    float: right;
    line-height: 20px;
  }
</style>
<style>
  .navtrans-view.expand a {
    display: none;
  }
  .navtrans-arrow {
    display: none;
  }
</style>