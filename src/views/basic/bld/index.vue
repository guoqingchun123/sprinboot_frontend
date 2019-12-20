<template>
  <div>
    <div v-if="listFloorShow">
      <list-floor :region="region" :bld="bld" @on-maintain-floor="maintainFloor"></list-floor>
    </div>
    <div v-if="cellMaintainShow">
      <bld-maintain :region="region" :bld="bld" :floor="floor" @on-return="returnPre"></bld-maintain>
    </div>
  </div>
</template>

<script>
  import ListFloor from './child/listFloor'
  import BldMaintain from './child/bldMaintain'

  export default {
    name: 'BldFloors',
    components: {
      ListFloor,
      BldMaintain
    },
    data() {
      return {
        listFloorShow: true,
        cellMaintainShow: false,
        region: JSON.parse(sessionStorage.getItem('regionByBld')),
        bld: JSON.parse(sessionStorage.getItem('currBld')),
        floor: {}
      }
    },
    methods: {
      maintainFloor(floor) {
        this.floor = floor;
        this.listFloorShow = false;
        this.cellMaintainShow = true
      },
      returnPre() {
        this.listFloorShow = true;
        this.cellMaintainShow = false
      }
    }
  }
</script>
