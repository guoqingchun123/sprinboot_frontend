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
.wh {
  background-color: #246480;
}

.ws {
  background-color: #4e803b;
}

.lh {
  background-color: #805028;
}

.ls {
  background-color: #eecbe7;
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
      legends: [],
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
