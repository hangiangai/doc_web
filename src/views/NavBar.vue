<template>
  <div class="navbar">
    <div class="navbar__wrapper">
      <div class="navbar__container">
        <span class="menu__item"
              @click="chatDrawer = true">
          消息
          <i class="el-icon-chat-line-round"></i>
        </span>
        <span class="menu__item"
              @click="dialogVisible.setting = true">
          设置
          <i class="el-icon-setting"></i>
        </span>
        <span class="menu__item"
              @click="dialogVisible.testDetails = true">
          测试报告
          <i class="el-icon-tickets"></i>
        </span>
        <span class="menu__item"
              @click="dialogVisible.fillValues = true">
          默认值
          <i class="el-icon-finished"></i>
        </span>

        <span class="menu__item">
          <Badge pos="right" :value="searchList.length">API</Badge>
        </span>

        <span class="menu__item">
          <el-popover
              placement="bottom"
              title="搜索结果"
              width="300"
              trigger="click">
          <div class="show__search__result">
            <ul style="max-height: 300px; overflow: scroll">
              <li class="search__item" v-for="(item, index) in searchResult" :key="index">
                <a class="mark" :href="`#${item.label}`">{{ item.label }}</a>
                <span style="border-color: #409EFF;" v-if="item.method === 'GET'">
                  {{ item.method }}
                </span>
                <span style="border-color: #67C23A;" v-if="item.method === 'POST'">
                  {{ item.method }}
                </span>
                <span style="border-color: #F56C6C;" v-if="item.method === 'DELETE'">
                  {{ item.method }}
                </span>
                <span style="border-color: #E6A23C;" v-if="item.method === 'PUT'">
                  {{ item.method }}
                </span>
              </li>
            </ul>
          </div>
          <el-input
              slot="reference"
              placeholder="请输入内容"
              clearable
              prefix-icon="el-icon-search"
              @input="handlerSearch"
              v-model="searchValue">
          </el-input>
        </el-popover>
        </span>
      </div>
    </div>

    <el-dialog title="测试详情"
               width="64%"
               :visible.sync="dialogVisible.testDetails">
      <ul class="test__err__details default__show__style">
        <li>
          <span>Title</span>
          <span>Url</span>
          <span>Status</span>
          <span>StatusText</span>
        </li>
        <li v-for="(item, index) in collectError"
            :key="index">
          <span>{{ item.title }}</span>
          <span>{{ item.relativePath }}</span>
          <span>{{ item.status }}</span>
          <span>{{ item.statusText }}</span>
        </li>
      </ul>
    </el-dialog>
    <el-dialog title="设置"
               :visible.sync="dialogVisible.setting">
      <ul class="setting default__show__style">
        <li>
          <span>服务访问地址</span>
          <span v-if="!showEditBox.apiServer">{{ apiServer }}</span>
          <span v-else>
            <input type="text"
                   style="border: none; border-bottom: 1.6px solid slategray; outline: none"
                   v-model='apiServer'>
          </span>
          <span>
            <i v-if="!showEditBox.apiServer" class="el-icon-edit-outline"
               @click="showEditBox.apiServer = true"></i>
            <i v-else class="el-icon-circle-check"
               @click="saveSetting('apiServer')"></i>
          </span>
        </li>
        <li>
          <span>自动填充</span>
          <span>
            <el-switch
                v-model="startAutoFillValues"
                active-color="#13ce66"
                inactive-color="#ff4949">
            </el-switch>
          </span>
        </li>
        <li>
          <span>自动测试</span>
          <span>
            <el-switch @change="saveSetting('autoTest')"
                       v-model="startAutoTest"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </span>
        </li>
      </ul>
    </el-dialog>
    <el-dialog title="设置默认值"
               :visible.sync="dialogVisible.fillValues">
      <ul class="setting__default__value default__show__style">
        <li>
          <span>Key</span>
          <span>Value</span>
          <span>Action</span>
        </li>
        <li v-for="(item, index) in defaultValues" :key="index">
          <span>{{ item.label }}</span>
          <span>{{ item.value }}</span>
          <span>
            <i class="el-icon-edit-outline"
               @click="modifyDefaultValue(index)"></i>
            <i class="el-icon-delete"
               @click="removeDefaultValue(index)"></i>
          </span>
        </li>
      </ul>
      <div class="auto__setting__box">
        <span>
          <span>Key</span>
          <input type="text" v-model="defaultValue.key">
        </span>
        <span>
          <span>Value</span>
          <input type="text" v-model="defaultValue.val">
        </span>
        <button @click="saveDefaultValues">save</button>
      </div>
    </el-dialog>
    <el-drawer title="我是标题"
               size="400px"
               wrapperClosable
               :visible.sync="chatDrawer">
      <span>我来啦!</span>
    </el-drawer>

  </div>
</template>

<script>
import Badge from "./../components/Badge";

export default {
  name: "NavBar",
  components: {
    Badge,
  },
  props: {
    listData: Array,
    searchList: Array,
    collectError: Array,
    startAutoTest: Boolean,
    defaultValues: Array,
    apiServer: String,
  },
  data() {
    return {
      dialogVisible: {
        fillValues: false,
        setting: false,
        testDetails: false,
      },

      showEditBox: {
        apiServer: false,
      },
      defaultValue: {
        key: '',
        val: ''
      },
      autoValues: {},
      chatDrawer: false,
      searchValue: '',
      searchValueCopy: '',
      searchResult: [],
      startAutoFillValues: false
    }
  },
  created() {

  },

  methods: {

    handlerSearch() {
      if (this.searchValue !== this.searchValueCopy) {
        this.searchResult = [];
        if (this.searchValue !== '') {
          for (let i = 0; i < this.searchList.length; i++) {
            if (this.searchList[i].label.indexOf(this.searchValue) >= 0) {
              this.searchResult.push({
                label: this.searchList[i].label,
                method: this.searchList[i].method,
              });
            }
          }
        }
      }
      this.searchValueCopy = this.searchValue;
    },

    removeDefaultValue(idx) {
      this.defaultValues.splice(idx, 1);
      let toStr = JSON.stringify(this.defaultValues);
      this.$cookie.setCookie('defaultValues', toStr);
    },

    modifyDefaultValue(idx) {
      console.log(idx);
    },

    saveDefaultValues() {
      let defaultValuesLen = this.defaultValues.length;
      for (let i = 0; i < defaultValuesLen; i++) {
        if (this.defaultValues[i].label === this.defaultValue.key) {
          return
        }
      }
      this.defaultValues.push({
        label: this.defaultValue.key,
        value: this.defaultValue.val,
      })
      console.log(this.defaultValues);
      this.$cookie.setCookie('defaultValues', JSON.stringify(this.defaultValues));
    },


    saveSetting(type) {
      let saveValue = '';
      switch (type) {
        case 'apiServer':
          this.showEditBox.apiServer = false;
          saveValue = this.apiServer;
          break;
        case 'autoTest':
          saveValue = this.startAutoTest;
          break;
      }
      this.$cookie.setCookie(type, saveValue);
    },

    sendMsgHandler() {
      this.sendDataArr.push({
        identity: this.$cookie.getCookie("identity"),
        data: this.sendData,
      });
      this.$ws.send(
          JSON.stringify({
            type: 2,
            data: this.sendData,
            identity: this.$cookie.getCookie("identity"),
            status: 0,
          })
      );
    },
  }
}
</script>

<style>

.el-input__inner {
  width: 400px;
  border-radius: 20px;
  height: 36px;
  border-style: none;
  background-color: #eee !important;
  border-color: #eee !important;
  color: rgba(0, 0, 0, .6);
  z-index: 1;
}

.el-dialog__wrapper {
  z-index: 1000000;
}
</style>

<style scoped>

.navbar__wrapper {
  width: 100%;
  top: 0;
  z-index: 5;
  height: 64px;
  position: fixed;
  border-bottom: 1px solid black;
  border-bottom-color: rgba(0, 0, 0, .12) !important;
  font-family: Roboto, sans-serif;
  background-color: #fff;
}

.navbar .navbar__container {
  height: inherit;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

.navbar .navbar__container .menu__item {
  padding: 0 16px;
  font-size: 1rem;
  color: #515a6e;
  cursor: pointer;
}

.navbar .navbar__container .menu__item i {
  font-size: 1.1rem;
  margin-left: 8px;
  color: rgba(0, 0, 0, .87);
  font-weight: 600;
}

.search__item {
  border-bottom: 1px solid #DCDFE6;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 4px;
  transition: 0.4s;
}

.search__item:hover {
  background-color: #F2F6FC;
}

.search__item span {
  font-size: 12px;
  padding: 4px;
  border-radius: 3px;
  color: #515a6e;
  border: 1.2px solid black;
}

.search__item a {
  text-decoration: none;
  color: rgba(0, 0, 0, .87);
  padding: 8px 0;
}

/* 公共样式 */
.default__show__style {
  padding: 0 10px;
  transition: 0.4s;
}

.default__show__style li {
  width: 100%;
  border-bottom: 1.4px solid slategray;
  padding: 14px 0;
  list-style: none;
}

.default__show__style li span {
  display: inline-block;
  width: 33%;
  font-size: 1rem;
}

.default__show__style li:first-child {
  font-weight: 600;
  color: #303133;
}

/* 设置 */
.setting li span {
  width: 40%;
}

.setting li span:last-child {
  width: 20%;
  text-align: center;
}

.setting li span i {
  font-size: 1.4rem;
}

/* 测试报告 */
.test__err__details li span {
  width: 22%;
}

.test__err__details li span:first-child {
  width: 34%;
}

/* 默认值 */
.setting__default__value li span {
  width: 50%;
}

.setting__default__value li span:first-child {
  width: 30%;
}

.setting__default__value li span:last-child {
  width: 20%;
  text-align: center;
}

.setting__default__value li span i {
  padding: 0 5px;
  cursor: pointer;
}

</style>