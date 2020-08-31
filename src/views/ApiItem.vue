<template>
  <div class="api__item__wrapper" :id="data['Title']" ref="item">
    <div class="api__item__container">
      <el-card>
        <div slot="header" class="card__header">
          <span style="font-size:20px">
            <strong>{{ data['Title'] }}</strong>
          </span>
          <div style="float: right">
            <el-button style="margin-right: 20px" type="text"
                       @click="showTestAreaState = true">
              Test
            </el-button>
            <el-button type="text"
                       @click="showDefaultTestValBox">
              默认测试值
            </el-button>
          </div>
        </div>

        <div class="card__body">
          <p class="body__item">
            <span class="item__1">
              Url
              <strong>:</strong>
            </span>
            <span class="item__2">{{ data['Url'] }}</span>
          </p>
          <p class="body__item">
            <span class="item__1">
              Header
              <strong>:</strong>
            </span>
            <span class="item__2">{{ data['Header'] }}</span>
          </p>
          <p class="body__item">
            <span class="item__1">
              Method
              <strong>:</strong>
            </span>
            <span class="item__2">{{ data["Method"] }}</span>
          </p>
          <!--     参数     -->
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

          <p class="body__item">
            <span class="item__1">
              Return
              <strong>:</strong>
            </span>
            <span class="item__2">Empty</span>
          </p>
        </div>
      </el-card>

      <!--  保存默认值   -->
      <div class="set__default__test"
           v-show="showDefaultTestValBoxState">
        <div class="set__default__test__box">
          <span class="box__header">
            <i class="el-icon-circle-close"
               @click="showDefaultTestValBoxState = false"></i>
          </span>
          <ul style="padding: 30px 0 0 0">
            <li v-for="(p, index) in testDefaultVal"
                :key="index">
              <span>
                <an-input :label="p.label" v-model="p.value"/>
              </span>
            </li>
          </ul>
          <an-button @click="saveTestValues">保存</an-button>
        </div>
      </div>

      <!--      -->
      <div class="test__area"
           :style="showTestAreaState?`opacity: 1;width:40%; height: 100%`:'opacity: 0'">
        <div class="test__area__body">
          <div class="test__area__left" @click="showTestAreaState = false ">
            <i class="el-icon-close"></i>
          </div>
          <div class="test__area__right">
            <ul class="area__input">
              <li v-for="(p, index) in data['Params']" :key="index">
                <el-popover
                    placement="right"
                    title="标题"
                    width="200"
                    trigger="click">
                  <div class="auto-insert-box">
                    <div v-for="(item, index) in defaultValues" :key="index">
                <span style="display: block">
                  key:
                  <span>{{ item.label }}</span>
                </span>
                      <span style="display: block">
                  Val:
                  <span>{{ item.value }}</span>
                </span>
                      <an-button @click="p['value'] = item.value">填充</an-button>
                    </div>
                  </div>
                  <an-input
                      :default-val="p['value']"
                      slot="reference"
                      :label="`${p['name']}`"
                      v-model="p['value']"
                      v-if="p['type'] === 'string'"
                  />
                </el-popover>
              </li>
            </ul>
            <an-button @click="startTest">开始测试</an-button>
            <div class="test_result">
              <pre>{{ data["Result"] }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localStorage from './../api/localStorage'

export default {
  name: "ApiItem",
  props: {
    data: Object,
    collectError: Array,
    startAutoTest: Boolean,
    defaultValues: Array,
    testDefaultValue: Object,
    index: Number,
  },
  data() {
    return {
      showTestAreaState: false,
      showDefaultTestValBoxState: false,
      defaultTestBoxStyle: '',
      testDefaultVal: [],
      testName: '',
    }
  },
  created() {
    this.startAutoTest && this.startTest();
    let key = `${this.data['Url']}__${this.data['Method']}`;
    this.testName = key;
    this.testDefaultValue[key] = {};
    let paramsLen = this.data["Params"].length;
    for (let i = 0; i < paramsLen; i++) {
      let name = this.data['Params'][i].name;
      this.testDefaultValue[key][name] = '';
      this.testDefaultVal.push({
        label: name,
        value: '',
      })
    }
  },

  methods: {

    saveTestValues(){
      let len = this.testDefaultVal.length;
      for(let i = 0; i < len; i++) {
        this.testDefaultValue[this.testName][this.testDefaultVal[i].label]
            = this.testDefaultVal[i].value;
      }
      localStorage.set("defaultTestValues", JSON.stringify(this.testDefaultValue));
     },

    showDefaultTestValBox(){
      this.showDefaultTestValBoxState = true;
    },

    handleError(err){
      this.data["Result"] = err;
      this.collectError.push({
        status: err.response.status,
        statusText: err.response.statusText,
        relativePath: this.data['Url'],
        title: this.data['Title'],
      });
    },

    startTest() {
      this.data['Result'] = '';
      let params = {};
      this.data["Params"].forEach((p) => {
        params[`${p["name"]}`] = p["value"];
      });
      let requestInfo = {
        url: `http://${this.data['Server']}/${this.data["Url"]}`,
        method: this.data["Method"],
        headers: {
          "Content-Type": this.data["Header"],
        },
        params: params,
      };
      this.file && (requestInfo["data"] = this.formData)
      this.$http(requestInfo)
          .then((res) => {
            this.data["Result"] = res.data;
          })
          .catch((err) => {
            this.handleError(err);
          });
    }
  }
}
</script>

<style scoped>

/*
  测试默认值
 */
.set__default__test{
  position: absolute;
  z-index: 5;
  right: 20px;
  top: 80px;
  background-color: #ffffff;
  width: 30%;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2),
    0 2px 2px 0 rgba(0, 0, 0, .14),
  0 1px 5px 0 rgba(0, 0, 0, .12);
  overflow: hidden;
  border-radius: 6px;
}

.set__default__test__box{
  position: relative;
  width: 100%;
  text-align: center;
}

.set__default__test__box .box__header {
  position: absolute;
  height: 30px;
  width: 100%;
  top: 0;
  right: 0;
  background-color: #5d6d75;
  display: flex;
  align-items: center;
}

.box__header i {
  margin-left: 4px;
  font-size: 1.1rem;
  color: #F56C6C;
  font-weight: 600;
}

.set__default__test li {
  list-style: none;
  padding: 10px 0;
  border-style: none;
  border-bottom: 1.4rem;
  width: 100%;
  font-size: 1rem;
}

.set__default__test li span:first-child {
  display: inline-block;
  text-align: right;
  font-size: 1rem;
}

.set__default__test li span:last-child{
  padding: 0 10px;
}


.set__default__test li span input {
  border-style: none;
  border-bottom: 1.4px solid slategray;
  outline: none;
}



.api__item__container {
  margin: 6px 0;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
}

.card__body {
  position: relative;
}

.card__body .body__item {
  padding: 10px 8px;
}

.body__item .item__1 {
  font-size: 1.2rem;
  font-weight: 600;
  padding-right: 6px;
}

.body__item .item__2 {
  font-size: 1rem;
  font-weight: 600;
  padding: 4px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.06);
}

.test__area {
  top: 10px;
  right: 10px;
  width: 0;
  height: 0;
  position: absolute;
  overflow: scroll;
  z-index: 5;
  opacity: 0;
  transition: 0.26s;
  background-color: #ffffff;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
  text-align: center;
  display: flex;
  flex-direction: row;
  border-radius: 7px;
}

.test__area__body {
  width: 100%;
}

.test__area__left {
  background-color: #67C23A;
  width: 16px;
  height: 16px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  z-index: 100000;
}

.test__area__left i {
  font-size: 11px;
}

.test__area__right {
  width: 100%;
}

.area__input {
  list-style: none;
  padding: 10px 10px;
}

.area__input li {
  padding: 4px 0;
}

.test_result {
  background-color: #f5f7fa;
  min-height: 200px;
  border-radius: 3px;
  text-align: left;
  overflow: scroll;
  width: 100%;
}
</style>