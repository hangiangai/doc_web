<template>
  <div
      id="index"
      ref='card'
  >
    <div class="wrapper">
      <div class="index-container">

        <el-card
            class="box-card"
            :id="data['Title']"
            shadow="never"
        >
          <!-- header -->
          <div slot="header" class="clearfix">
            <span style="font-size:20px"><strong>{{ data['Title'] }}</strong></span>
            <span style="padding: 0 20px;" @click="showChangeBox=true">
              <strong style="font-size: 1.2rem">
                <i class="el-icon-refresh"></i>
              </strong>
            </span>
            <el-dialog :visible.sync="showChangeBox">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="changeModel.params">
              </el-input>
              <button @click="toChange">Click!!!</button>
            </el-dialog>
          </div>

          <div class="i-con">
            <p class="i-item">
              <span class="i-item-1">
                Url
                <strong>:</strong>
              </span>
              <span class="i-item-2">{{ data['Url'] }}</span>
            </p>

            <p class="i-item">
              <span class="i-item-1">
                Header
                <strong>:</strong>
              </span>
              <span class="i-item-2">{{ data['Header'] }}</span>
            </p>

            <p class="i-item">
              <span class="i-item-1">
                Method
                <strong>:</strong>
              </span>
              <span class="i-item-2">{{ data['Method'] }}</span>
            </p>

            <p class="i-item" v-if="data['ResHint']">
              <span class="i-item-1">
                Response Value Hint
                <strong>:</strong>
              </span>
              <span class="i-item-2">{{ data['ResHint'] }}</span>
            </p>
            <!-- 请求参数 -->
            <el-table
                :data="data['Params']"
                style="width: 100%; font-size:18px"
            >
              <el-table-column
                  prop="name"
                  label="name"
              >
              </el-table-column>
              <el-table-column
                  prop="type"
                  label="type"
              >
              </el-table-column>
              <el-table-column
                  prop="explain"
                  label="explain"
              >
              </el-table-column>
              <el-table-column
                  test-container
                  prop="remark"
                  label="remark"
              >
              </el-table-column>
              <el-table-column
                  prop="other"
                  label="other"
              >
              </el-table-column>
            </el-table>

            <div
                class="divider"
                @click="showTestAreaState=!showTestAreaState"
                :style="{'background-color':showTestAreaState?'#90929833':''}"
            >
              Test
            </div>
            <!-- 测试区 -->
            <div
                class="test-container"
                :style="{'height':showTestAreaState?this.$refs.testArea.scrollHeight+'px':''}"
            >
              <!-- 参数输入框 -->
              <div
                  class="test-area"
                  ref="testArea"
              >
                <div
                    class="t-area-item"
                    v-for="(p,index) in data['Params']"
                    :key="index"
                >

                  <el-popover
                      placement="right"
                      title="标题"
                      width="200"
                      trigger="click">
                    <div class="auto-insert-box">
                      <div v-for="(item, index) in autoFillValues" :key="index">
                        <span style="display: block">
                          key:
                          <span>{{ item.label }}</span>
                        </span>
                        <span style="display: block">
                          Val:
                          <span>{{ item.value }}</span>
                        </span>
                        <el-button @click="p['value'] = item.value">填充</el-button>
                      </div>
                    </div>
                    <Input
                        :default-val="p['value']"
                        slot="reference"
                        :label="p['name']"
                        v-model="p['value']"
                        v-if="p['type'] === 'string'"
                    />
                  </el-popover>

                  <Input
                      :label="p['name']"
                      v-model="p['value']"
                      v-if="p['type'] === 'bool'"
                  />

                  <Input
                      :label="p['name']"
                      v-model="p['value']"
                      v-if="p['type'] === 'int'"
                  />

                  <Input
                      :label="p['name']"
                      v-model="p['value']"
                      v-if="p['type'] === 'float'"
                  />
                  <input
                      type="file"
                      v-if="p['type'] === 'file'"
                      @change="handleFileChange"
                      ref="uploadFile"
                  >
                </div>
                <button
                    class="t-btn"
                    @click="startTest()">测试
                </button>
              </div>
              <!-- 测试结果区 -->
              <pre class="t-res-area">{{ data['Result'] }}</pre>
            </div>

          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "index",
  props: {
    data: Object,
    autoFillValues: Array,
  },
  data() {
    return {
      file: "",
      formData: {},
      showTestAreaState: false,
      showChangeBox: false,
      changeModel: {
        url: '',
        header: '',
        method: '',
        params: '',
      }
    }
  },
  mounted() {

  }
  ,
  methods: {


    replaceData(tp) {
      let str = ""
      switch (tp) {
        case "${Url}":
          str = this.data.Url;
          break;
        case "${Header}":
          str = this.data.Header;
          break;
        case "${Method}":
          str = this.data.Method;
          break;
        case "${Title}":
          str = this.data.Title;
          break;
      }
      return str
    },

    matchParamValue(k, idx) {
      let returnRes = "";
      switch (k) {
        case '${name}':
          returnRes = this.data.Params[idx].name;
          break;
        case '${type}':
          returnRes = this.data.Params[idx].type;
          break
        case '${explain}':
          returnRes = this.data.Params[idx].explain;
          break
        case '${other}':
          returnRes = this.data.Params[idx].other;
          break
        case '${remark}':
          returnRes = this.data.Params[idx].remark;
          break
      }
      return returnRes;
    },

    toChange(args, tp) {

      // %${数据} => []%
      //
      let format = "{ url:'${Url}',";
      format += "method:'${Method}',";
      format += "headers: { 'Content-Type':'${Header}'},";
      format += "params01:{ %${Params}=>[${name}:`option.${name}`]% } }"

      let f01 = "### ${Title}\n"
      f01 += "**Url:**`${Url}`\n"
      f01 += "**Method:**`${Method}`\n"
      f01 += "**Header:**`${Header}`\n"
      f01 += "|name|type|explain|remark|other|\n"
      f01 += "|----|----|-------|------|-----|\n"
      f01 += "%${Params} => [|${name}|${type}|${explain}|${remark}|${other}|]%"

      format = f01
      // 提取所有关键字
      let keywords = format.match(/\${[a-zA-Z]+?}/g)
      // 处理循环函数模板模板
      let loop = format.match(/%.+?%/g)
      for (let i = 0; i < loop.length; i++) {
        let params = loop[i].match(/\${[a-zA-Z]+}/g);
        let template = loop[i].match(/\[.+]/g);
        let tempStr = [];
        for (let k = 0; k < this.data.Params.length; k++) {
          let temp = template[0];
          for (let h = 1; h < params.length; h++) {
            temp = temp.replace(params[h], this.matchParamValue(params[h], k));
          }
          tempStr.push(temp.substring(1, temp.length - 1));
        }
        format = format.replace(loop[i], tempStr.join('\n'));
      }
      //处理其他关键字
      for (let i = 0; i < keywords.length; i++) {
        format = format.replace(keywords[i], this.replaceData(keywords[i]))
      }
      console.log(format)

      function fakeClick(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        obj.dispatchEvent(ev);
      }

      let urlObject = window.URL || window.webkitURL || window;
      let export_blob = new Blob(format.split(''))
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = 'test.md';
      fakeClick(save_link);
    },
    // 处理文件上传
    handleFileChange() {
      let fileDom = this.$refs.uploadFile[0];
      this.file = fileDom.files[0];
      let formData = new FormData();
      formData.append("file", this.file);
      this.formData = formData;
    },

    startTest() {
      this.data['Result'] = '';
      // 处理请求参数
      let params = {};
      this.data["Params"].forEach((p) => {
        params[`${p["name"]}`] = p["value"];
      });
      let apiServer = this.$cookie.getCookie('apiServer')
      // 请求信息
      let requestInfo = {
        url: `http://${apiServer}/${this.data["Url"]}`,
        method: this.data["Method"],
        headers: {
          "Content-Type": this.data["Header"],
        },
        params: params,
      };
      // 当没有文件传输时 不添加data属性
      if (this.file !== "") {
        requestInfo["data"] = this.formData;
      }
      // 发起请求
      this.$http(requestInfo)
          .then((res) => {
            console.log(res);
            this.data["Result"] = res.data;
          })
          .catch((err) => (this.data["Result"] = err));
    },
  }
  ,
};
</script>

<style>
.el-card__body {
  padding: 8px 20px;
}
</style>
<style scoped>

.c-tag {
  font-size: 1.4rem;
  width: 100px;
  text-align: right;
  padding: 0 20px 0 0;
}

.c-tag-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
}

.c-tag-input {
  width: 500px;
  font-size: 1.4rem;
}


#index {
  width: 100%;
  height: 100%;
  position: relative;
}

#index .wrapper {
  width: 100%;
  height: 100%;
}

.index-container {
  width: inherit;
  height: inherit;
  background-color: inherit;
}

.box-card {
  width: 100%;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
}

.i-con {
  width: 100%;
}

.i-item {
  width: inherit;
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.i-item-1 {
  padding: 0 10px;
  font-weight: 900;
  font-size: 1.1rem;
}

.i-item-2 {
  background-color: #eee;
  border-radius: 3px;
  padding: 1px;
}

.divider {
  width: 100%;
  height: 30px;
  margin: 20px 0;
  text-align: center;
  line-height: 30px;
  border-style: none;
  border-bottom: 1px solid #90929833;
  border-top: 1px solid rgba(144, 147, 153, 0.2);
  transition: 0.4s;
  background-color: #e4e7ed;
}

.divider i {
  transform: rotate(90deg);
  font-size: 12px;
  color: rgba(144, 147, 153, 0.8);
  /* background-color: royalblue; */
}

/* 测试代码块样式 */
.test-container {
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  transition: 0.16s;
  /*opacity: 0;*/
}

/* 测试用例输入框 */
.test-area {
  width: 40%;
  padding-right: 10%;
  min-height: 300px;
}

.t-area-item {
  padding: 6px 0;
}

.t-btn {
  margin: 10px 0;
  width: 150px;
  height: 32px;
  border-style: none;
  background-color: #7571f9 !important;
  border-radius: 3px;
  color: #f5f7fa;
  outline: none;
  font-size: 16px;
  transition: 0.55s;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
}

.t-btn:hover {
  background-color: rgba(83, 168, 255, 1);
}

/* 测试结果展示框 */
.t-res-area {
  width: 50%;
  border-radius: 6px;
  font-weight: 650;
  background-color: #f5f7fa;
  overflow: scroll;
}
</style>