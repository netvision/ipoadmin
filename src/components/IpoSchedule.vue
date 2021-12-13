<template>
  <h4 class="text-h4">Tentative Schedule</h4>
</template>

<script setup>
  import { ref  } from 'vue' 

  const props = defineProps({
    IpoId: String
  })
  const ipoId = ref(props.IpoId)


</script>