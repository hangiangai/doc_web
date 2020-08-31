<template>
  <div id="testShow">
    <Badge v-model="t01">
      12345
    </Badge>

    <el-badge
      :value="2"
      class="item"
    >
      12345
    </el-badge>
  </div>
</template>

<script>
import Badge from "./../components/Badge";
export default {
  name: "testShow",
  data() {
    return {
      t01: 14,
    };
  },
  components: {
    Badge,
  },
};
</script>

<style scoped>
#testShow {
  margin: 90px;
}
</style>