<template>
  <div id="docMain">
    <div class="app-wrapper">
      <div class="app-container">
        <NavBar :api-server="apiServer"
                :collect-error="collectError"
                :search-list="sidebarList"
                :start-auto-test="startAutoTest"
                :default-values="defaultValues">
        </NavBar>
        <Sidebar v-if="sidebarList.length > 0"
                 :item-height="40"
                 :list-item="sidebarList">
        </Sidebar>
        <div class="content">
          <div class="content-container">
            <div class="index-content">
              <div v-for="(item, index) in docs" :key="index">
                <ApiItem v-for="(note, idx) in item.Notes"
                         :key="idx"
                         :data="note"
                         :index="index"
                         :test-default-value="testDefaultValue"
                         :collect-error="collectError"
                         :start-auto-test="startAutoTest"
                         :default-values="defaultValues">
                </ApiItem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Badge from "./../components/Badge";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import ApiItem from "@/views/ApiItem";

export default {
  name: "docMain",
  components: {
    Badge,
    NavBar,
    Sidebar,
    ApiItem,
  },
  data() {
    return {
      docs: [],
      sidebar: [],
      sendData: "",
      sendDataArr: [],
      identity: this.$identity,
      showChatBox: false,
      msgCount: 0,
      sidebarList: [],
      collectError: [],
      startAutoTest: false,
      apiServer: '',
      defaultValues: [],
      testDefaultValue: {},
    };
  },
  created() {
    this.$sites.forEach(site => {
      this.mountWsHandler(site, this.fetchUpdated);
      this.fetchDocData(site.addr, site.server);
    })
  },

  methods: {

    mountWsHandler(site, handler) {
      site.ws.onopen = function () {
        site.ws.onmessage = function (e) {
          handler(site, e);
        }
      }
    },

    /*
      2 表示聊天消息
      3 文档更新
      4 文档添加
     */
    fetchUpdated(site, e) {
      let _this = this;
      let msg = JSON.parse(e.data);
      switch (msg.Type) {
        case 2:
          break;
        case 3:
          _this.docUpdated(site.addr);
          break;
        case 4:
          _this.docAdded();
          break;
      }

    },

    docUpdated(addr) {
      this.$server.fetchUpdated(addr)
          .then((res) => {
            console.log(res);
            let result = res.data.updated;
            this.docs.map((ele) => {
              if (ele.Path === result.Path) {
                ele.Notes = this.toDoc(result.Notes);
              }
            });
          });
    },

    docAdded() {
      this.$server.fetchAddFiles()
          .then(res => {
            if (Array.isArray(res.data.added)) {
              res.data.added.map(ele => {
                ele.Notes = this.toDoc(ele.Notes)
              })
              this.docs.push(...res.data.added)
            }
          })
    },

    fetchDocData(addr, server) {
      this.$server
          .fetchDocs_(addr)
          .then((res) => {
            let docs = res.data.Docs;
            if (docs !== null && Array.isArray(docs)) {
              docs.forEach(ele => {
                ele.Notes = this.toDoc(ele.Notes, server,  (value) => {
                  this.sidebarList.push({
                    label: value['Title'],
                    method: value['Method'],
                  });
                });
              })
              this.docs.push(...docs)
            }
          });
    },

    toDoc(contents, server, fn) {
      for (let i = 0; i < contents.length; i++) {
        let value = contents[i];
        if (!value["Url"]) {
          contents.splice(i, 1);
          continue;
        }
        value["Server"] = server;
        value["ResHint"] = value["ResHint"];
        value["Method"] = value["Method"].toUpperCase();
        value["Params"] = this.handleParams(value["Params"]);
        value["Result"] = "";
        if (!value["Header"]) {
          value["Header"] = "multipart/form-data";
        }
        fn && fn(value);
      }
      return contents;
    },

    handleParams(params) {
      let ret = [];
      if (Array.isArray(params)) {
        for (let i = 0; i < params.length; i++) {
          let p = params[i];
          ret.push({
            name: p[0] || "",
            type: p[1] || "",
            explain: p[2] || "",
            remark: p[3] || "",
            other: p[4] || "",
            value: "",
          });
        }
      }
      return ret;
    },

  },
};
</script>

<style>

#docMain {
  width: 100%;
  height: 100%;
  position: relative;
}

.item-2 input {
  height: 30px;
  width: 250px;
  display: inline-block;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-right: none;
  outline: none;
  vertical-align: middle;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}


.app-wrapper {
  width: 100%;
  height: 100%;
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.content {
  margin-left: 270px;
  height: 100%;
  width: calc(100% - 270px);
}

.content-container {
  width: 100%;
  top: 64px;
  height: calc(100% - 64px);
  overflow-x: scroll;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: row;
}

.index-content {
  width: 98%;
  padding: 0 1%;
}

</style>