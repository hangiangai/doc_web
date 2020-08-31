<template>
  <div id="item">
    <span class="item__container">
      <span class="icon">
        <slot name="icon"></slot>
      </span>
      <div class="item__content">
        <span class="header">
          <slot name="header"></slot>
        </span>
        <span class="content">
          <slot></slot>
        </span>
      </div>
    </span>
  </div>
</template>

<script>
export default {
  name: "item",
  props: {
    color: String,
  },
}
</script>

<style scoped>
#item {
  width: 100%;
  padding: 16px 0;
  text-align: center;
  position: relative;
}

#item:hover .item__content {
  width: 230px;
  transition: 0.4s;
}

.icon {
  width: 100%;
  transition: 0.3s;
}

#item:hover .icon {
  font-size: 1.6rem;
  transition: 0.3s;
}

.item__container {
  font-size: 2rem;
  color: aliceblue;
  width: 100%;
}

.item__container .item__content {
  width: 0;
  top: -10px;
  left: 80px;
  position: absolute;
  font-size: 16px;
  transition: 0.4s;
  z-index: 10000 !important;
  border-radius: 6px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
}

.header {
  width: 230px;
  font-size: 20px;
  padding: 16px 0;
  background-color: #7571f9;
}

.content {
  padding: 10px 0;
  color: #303133;
  width: 230px;
}

</style>