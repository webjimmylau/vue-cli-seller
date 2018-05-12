<template>
  <tree-folder
    :node="data"
    :showCategoryCode="showCategoryCode"
    :activeID="activeID"
    :setActive="setActive">
  </tree-folder>
</template>

<script>
import TreeFolder from './folder';
export default {
  props: ['data', 'activeID', 'setActive', 'showCategoryCode'],
  components: { TreeFolder }
};
</script>
