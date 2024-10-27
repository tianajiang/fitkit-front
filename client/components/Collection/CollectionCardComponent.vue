<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

async function handleClick() {
  await router.push(`/collections/${props.collection._id}`);
}
</script>

<template class="center">
  <div class="collection-card" @click="handleClick">
    <h3 class="collection-name">{{ props.collection.name }}</h3>
  </div>
</template>

<style scoped>
.collection-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 300px;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  text-align: center;
}

.collection-card:hover {
  transform: scale(1.05);
  background-color: #e0e0e0;
}

.collection-name {
  font-weight: bold;
  margin: 0;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
