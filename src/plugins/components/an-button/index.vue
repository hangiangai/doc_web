<template>
  <div id="an-button">
    <div class="an-button-container">
      <button class="btn" @click="handleClickEvent">
        <slot></slot>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "an-button",
  props: {
    color: String,
    backgroundColor: String,
    click: Function
  },
  created() {

  },
  methods: {
    handleClickEvent(data){
      this.$emit('click', data);
    }
  }
}
</script>

<style scoped>
.btn {
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
</style>