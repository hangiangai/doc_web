<template>
  <div id="tag">
    <div class="tag-container" :style="tagStyle">
      123
    </div>
  </div>
</template>

<script>
export default {
  name: "Tag",
  data(){
    return {
      tagStyle: `left:${this.left}px;top:${this.top}px`,
    }
  },
  props: {
    top: Number,
    left: Number,
  }
}
</script>

<style scoped>
.tag-container{
  width: 100px;
  height: 100px;
  background-color: #F56C6C;
  position: absolute !important;
  z-index: 100000;
}
</style>