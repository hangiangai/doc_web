<template>
  <div class="sidebar">
    <div class="sidebar__container" ref="sidebar" @scroll="handlerScroll">
      <div :style="{height: scrollHeight + 'px'}">
        <ul class="list_box" :style="`transform:translateY(${offSetY}px)`">
          <li class="list__item" v-for="(item, index) in showList" :key="index">
            <span v-if="item.method === 'GET'"
                class="mark" style="border-color:#409EFF">
              <i class="el-icon-search" style="color: #409EFF;"></i>
            </span>
            <span v-if="item.method === 'POST'"
                  class="mark" style="border-color:#67C23A">
              <i class="el-icon-plus" style="color: #67C23A;"></i>
            </span>
            <span v-if="item.method === 'PUT'"
                  class="mark" style="border-color:#E6A23C;">
              <i class="el-icon-edit" style="color: #E6A23C;"></i>
            </span>
            <span v-if="item.method === 'DELETE'"
                  class="mark" style="border-color:#F56C6C">
              <i class="el-icon-delete" style="color: #F56C6C;"></i>
            </span>
            <a :href="`#${item.label}`">{{ item.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    listItem: Array,
    itemHeight: Number,
  },
  data() {
    return {
      showList: [],
      viewHeight: 0,
      lastScrollTime: '',
      offSetY: 0,
      scrollHeight: 0,
      showItems: 0,
    }
  },
  created() {
    console.log(this.listItem);
  },
  watch: {
    listItem(val) {
      this.updatedView();
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updatedView();
    })
  },
  methods: {
    updatedView(){
      this.scrollHeight = (this.itemHeight + 1) * this.listItem.length;
      this.viewHeight = this.$refs.sidebar.offsetHeight;
      this.showItems = this.viewHeight / this.itemHeight;
      this.showList = this.listItem.slice(0, this.showItems);
      this.lastScrollTime = new Date().getTime();
    },

    handlerScroll(e) {
      if (new Date().getTime() - this.lastScrollTime > 10) {
        this.offSetY = e.target.scrollTop - (e.target.scrollTop % this.itemHeight);
        this.showList = this.listItem.slice(
            Math.floor(e.target.scrollTop / this.itemHeight),
            Math.floor(e.target.scrollTop / this.itemHeight) + this.showItems
        );
        this.lastScrollTime = new Date().getTime();
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
  position: fixed;
  height: 100vh;
  width: 270px;
  z-index: 4;
  max-height: calc(100% - 64);
  top: 64px;
  border-right: 1px solid black;
  border-right-color: rgba(0, 0, 0, .12) !important;
  background-color: #fff;
}

.sidebar__container{
  height: inherit;
  width: 270px;
  overflow: scroll;
}

.list__item {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: list-item;
  line-height: 1.5;
}

.list__item a {
  text-decoration: none;
  color: #515a6e;
  padding: 0 0 0 8px;
  transition: all .2s ease-in-out;
}

.list__item .mark {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  color: #eeeeee;
  border: 1.2px solid black;
}
.list__item .mark i {
  font-size: 11px;
  font-weight: 800;
}
</style>