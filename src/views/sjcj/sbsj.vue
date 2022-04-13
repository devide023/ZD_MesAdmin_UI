<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="pageconfig.isgradequery"
      @query="query_handle"
      @gradequery="grade_query_handle"
    >
    </search-bar>
  </div>
</template>

<script>
import { basemixin } from "@/mixin/basemixin";
import SearchBar from "@/components/QueryBar/index.vue";
export default {
  name: "SbsjcjComponent",
  components: {
    SearchBar,
  },
  mixins: [basemixin],
  data() {
    return {
      
    };
  },
};
</script>

<style lang="scss" scoped>
</style>