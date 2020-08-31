<template>
  <div id="badge">
    <div class="badge__container">
      <span class="badge__content">
        <slot></slot>
      </span>
      <sup class="badge__count"
            :style="defaultStyle">{{value}}</sup>
    </div>
  </div>
</template>

<script>
export default {
  name: "badge",
  data(){
    return {
      defaultStyle: `left:-5px;top:-5px`
    }
  },
  created() {
    this.pos === 'right' && (this.defaultStyle = 'right:-5px;top:-5px')
  },
  model: {
    prop: "value",
  },
  props: {
    pos: String,
    value: Number,
  },
};
</script>

<style scoped>
#badge{
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
.badge__container {
  position: relative;
  border-radius: 4px;
  padding: 8px;
}
.badge__content{
  padding: 8px;
}
.badge__count {
  position: absolute;
  padding: 0 6px;
  background-color: #f56c6c;
  text-align: center;
  line-height: 18px;
  border-radius: 9px;
  font-size: 12px;
  color: #ffffff;
}
</style>