<template>
  <div>
    <div v-if="listBldShow">
      <list-bld :region="region" @on-bld-floor="bldFloor"></list-bld>
    </div>
    <div v-if="listFloorShow">
      <list-floor :region="region" :bld="bld" @on-maintain-floor="maintainFloor" @on-bld-return="returnListBld"></list-floor>
    </div>
    <div v-if="cellMaintainShow">
      <bld-maintain :region="region" :bld="bld" :floor="floor" @on-return="returnPre"></bld-maintain>
    </div>
  </div>
</template>

<script>
  import ListFloor from './child/listFloor'
  import BldMaintain from './child/bldMaintain'
  import listBld from './child/listBld'

  export default {
    name: 'BldIndex',
    props: {
      region: {
        type: Object,
        default: null
      }
    },
    components: {
      ListFloor,
      BldMaintain,
      listBld
    },
    data() {
      return {
        listBldShow: true,
        listFloorShow: false,
        cellMaintainShow: false,
        bld: {},
        floor: {}
      }
    },
    methods: {
      bldFloor(bld) {
        this.bld = bld;
        this.listFloorShow = true;
        this.listBldShow = false;
        this.cellMaintainShow = false
      },
      maintainFloor(floor) {
        this.floor = floor;
        this.listFloorShow = false;
        this.cellMaintainShow = true
      },
      returnPre() {
        this.listFloorShow = true;
        this.cellMaintainShow = false
      },
      returnListBld() {
        this.listBldShow = true;
        this.listFloorShow = false;
        this.cellMaintainShow = false
      }
    }
  }
</script>
