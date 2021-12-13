<template>
  <h4 class="text-h4">Listing Day Data</h4>
</template>

<script setup>
  import { ref  } from 'vue' 

  const props = defineProps({
    IpoId: String
  })
  const ipoId = ref(props.IpoId)


</script>