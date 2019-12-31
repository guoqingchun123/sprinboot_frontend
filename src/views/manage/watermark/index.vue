<template>
  <div>
    <bv-form>
      <bv-row :layout="4">
        <bv-col v-for="el in items" :key="el.id">
          <bv-form-item class="form-item-center" label-width="100%">
            <div slot="label">
              {{ el.name }}
              <bv-button view="remove" @click="removeWatermark($event, el)">删除</bv-button>
            </div>
            <el-image :src="el.url" />
          </bv-form-item>
        </bv-col>
      </bv-row>
    </bv-form>
    <bv-button @click="dialogVisible = true">维护水印</bv-button>
    <bv-dialog title="维护水印" :visible.sync="dialogVisible" @close="onDialogClose">
      <bv-form ref="form" :model="item" :rules="rules">
        <bv-row :layout="1">
          <bv-col>
            <bv-form-item prop="name" label="水印名称">
              <bv-input v-model="item.name" />
            </bv-form-item>
          </bv-col>
          <bv-col>
            <bv-form-item label="水印文件">
              <bv-upload
                class="avatar-uploader"
                :auto-upload="false"
                :on-change="onFileChange"
              >
                <el-avatar v-if="imageUrl" shape="square" :size="174" :src="imageUrl">
                  <img :src="defaultAvatar">
                </el-avatar>
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </bv-upload>
            </bv-form-item>
          </bv-col>
        </bv-row>
      </bv-form>
      <div slot="footer">
        <bv-button view="save" @click="confirm">保存</bv-button>
        <bv-button view="cancel" @click="reset">取消</bv-button>
      </div>
    </bv-dialog>
  </div>
</template>
<script>
  import { Avatar, Image } from 'element-ui'
  import { getCacheBlob, createCache, removeCache } from '@bestvike/utils/lib'
  import { Upload } from '@bestvike/components'
  import defaultAvatar from '@/assets/avatar.png'
  import { fetchWatermarks, uploadWatermark, removeWatermarks } from '@/api/manage/watermark'

  export default {
    name: 'ManageWatermark',
    components: {
      ElAvatar: Avatar,
      ElImage: Image,
      BvUpload: Upload
    },
    data() {
      return {
        defaultAvatar,

        dialogVisible: false,

        items: [],
        imageUrl: null,
        file: null,
        item: {
          name: null
        },

        rules: {
          name: [
            { required: true, message: '请输入水印名称', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      fetchWatermarks().then(async res => {
        try {
          let items = []
          if (res.data && res.data.length > 0) {
            for (let item of res.data) {
              if (item.content) {
                let blob = await getCacheBlob('data:image/jpg;base64,' + item.content)
                item.url = createCache(blob)
              }
              items.push(item)
            }
          }
          this.items = items
        } catch (e) {
          console.log(e)
        }
      }).catch(() => {})
    },
    beforeDestroy() {
      if (this.items && this.items.length > 0) {
        for (let item of this.items) {
          if (item.url) {
            removeCache(item.url)
          }
        }
      }
    },
    methods: {
      onFileChange(file) {
        this.imageUrl = createCache(file.raw)
        this.file = file.raw
      },
      confirm(event) {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false
          }
          const loading = this.$loading(event)
          uploadWatermark([this.file], this.item).then(() => {
            this.dialogVisible = false
            this.items.push({
              name: this.item.name,
              url: this.imageUrl
            })
            this.imageUrl = null
            this.$refs.form.resetFields()
            loading.close()
          }).catch(() => loading.close())
        })
      },
      removeWatermark(event, watermark) {
        this.$confirm('此操作将删除该水印, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading()
          removeWatermarks(watermark.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.items.splice(item => item.id === watermark.id, 1)
            removeCache(watermark.url)
            loading.close()
          }).catch(() => loading.close())
        }).catch(() => {
          /*this.$message({
            message: '取消删除',
            type: 'warning'
          })*/
        })
      },
      reset() {
        this.dialogVisible = false
        this.$refs.form.resetFields()
      },
      onDialogClose() {
        if (this.imageUrl) {
          removeCache(this.imageUrl)
        }
      }
    }
  }
</script>
<style scoped>
  .el-image {
    width: 400px;
  }
</style>