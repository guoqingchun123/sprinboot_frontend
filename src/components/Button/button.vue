<!-- eslint-disable -->
<template>
  <button
    class="el-button"
    v-show="isButtonShow"
    v-if="isButtonCreate"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type__ ? 'el-button--' + type__ : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon__" v-if="icon__ && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  /* eslint-disable */
  // 来自ElButton，做调整
  export default {
    name: 'BvButton',

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      },
      /// by lihua,仅用于bv-table
      tableInstance: {
        default: null
      }
    },

    props: {
      type: {
        type: String,
        default: 'default'
      },
      /// 显示判定
      show: {
        type: String,
        default: null
      },
      ///
      view: {
        type: String,
        default: null
      },
      // 授权
      authority: {
        type: String,
        default: null
      },
      ///
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean
    },
    //////////////
    data() {
      return {
        type__: this.type,
        icon__: this.icon
      }
    },
    //////////////

    computed: {
      //////////////
      // 检查授权
      isButtonShow() {
        if (!this.show) {
          return true
        }
        if (!this.tableInstance || !this.tableInstance.table) {
          return false
        }
        switch (this.show) {
          case 'one': {
            return this.tableInstance.table.selection && this.tableInstance.table.selection.length === 1
          }
          case 'oneOrMore': {
            return this.tableInstance.table.selection && this.tableInstance.table.selection.length >= 1
          }
          case 'none': {
            return !this.tableInstance.table.selection || this.tableInstance.table.selection.length === 0
          }
        }
        return false
      },
      isButtonCreate() {
        if (process.env.VUE_APP_AUTHORITY === 'false' || !this.authority) {
          return true
        }
        if (!this.$route.meta || !this.$route.meta.authoritiedOperates__ || !this.$route.meta.authoritiedOperates__.length === 0) {
          return false
        }
        return this.$route.meta.authoritiedOperates__.indexOf(this.authority) >= 0
      },
      //////////////
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      buttonDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      }
    },
    created() {
      //////////////////////
      let type = null
      let icon = null
      switch(this.view) {
        case 'add':
          type = 'success'
          icon = 'el-icon-edit'
          break;
        case 'modify':
          type = 'primary'
          icon = 'el-icon-edit'
          break;
        case 'remove':
          type = 'danger'
          icon = 'el-icon-refresh'
          break;
        case 'save':
          type = 'primary'
          icon = 'el-icon-save'
          break;
        case 'cancel':
          type = 'default'
          icon = 'el-icon-cancel'
          break;
        case 'fetch':
          type = 'info'
          icon = 'el-icon-query'
          break;
        case 'grant':
          type = 'warning'
          icon = 'el-icon-edit'
          break;
        case 'search':
          icon = 'el-icon-search'
          break;
      }
      this.type__ = type || this.type
      this.icon__ = icon
    },

    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
