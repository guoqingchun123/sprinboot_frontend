<template>
  <div class="app-container">
    <bv-row layout="table-header">
      <bv-col>
        {{title}}
        <el-button view="details" @click="refreshBldView">刷新</el-button>
        <el-button view="details" @click="backToBldList">返回</el-button>
      </bv-col>
    </bv-row>
    <bv-building
      v-bind="config"
      :legends="legends"
      :properties="properties"
      :show-house="showHouse"
    />
  </div>
</template>
<style type="text/css">
.noSaled {
  background-color: #00dd02;
}

.mortgage {
  background-color: #ddb400;
}

.close {
  background-color: #dd8800;
}

.frozen {
  background-color: #dd6600;
}

.sell {
  background-color: #ff0000;
}

.noSale {
  background-color: #959595;
}
</style>
<script>
import { queryBldView } from "@/api/basic";
import { Building } from "@bestvike/components";

export default {
  name: "BldView",
  props: {
    bld: {
      type: Object
    }
  },
  components: {
    BvBuilding: Building
  },
  data() {
    return {
      filter: {},
      tableInstance: {},
      item: {},
      queryBldView,
      config: {
        badge: false,
        showConfig: true,
        hideCell: true,
        select: false
      },
      title: "",
      legends: [
        {
          className: "noSaled",
          head: "未售",
          title: null
        },
        {
          className: "sell",
          head: "已售",
          title: null
        },
        {
          className: "mortgage",
          head: "抵押",
          title: null
        },
        {
          className: "close",
          head: "查封",
          title: null
        },
        {
          className: "frozen",
          head: "关闭",
          title: null
        },
        {
          className: "noSale",
          head: "自留/非卖",
          title: null
        }
      ],
      properties: [],
      showHouse(house, viewType) {
        if (house && house.skipNum !== -1) {
          if (!viewType || viewType === "summary") {
            return house.showName;
          }
          return (
            "房号：" + house.showName + "<br/>面积：" + house.area.toFixed(3)
          );
        }
      }
    };
  },
  async created() {
    this.title = this.bld.bldName + "#楼盘视图";
    this.refreshBldView();
  },
  methods: {
    showBldView() {},
    refreshBldView() {
      queryBldView(this.bld.projectId, this.bld.bldNo)
        .then(response => {
          const { data } = response;
          this.properties = data;
        })
        .catch(() => {});
    },
    backToBldList() {
      this.$emit("on-bld-view-return");
    }
  }
};
</script>
