<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { useRouter } from "vue-router";

// Props to receive the community data.
const props = defineProps({
  community: {
    type: Object as () => { name: string; description: string; _id: string },
    required: true,
  },
});
const router = useRouter();

// Emits a custom event when the card is clicked.
const emit = defineEmits(["selectCommunity"]);

// Triggers the event to notify parent components that this card was clicked.
async function handleClick() {
  console.log("Clicked community card:", props.community);
  await router.push(`/communities/${props.community._id}`);
}
</script>

<template>
  <div class="community-card" @click="handleClick">
    <h3 class="community-name">{{ props.community.name }}</h3>
    <p class="community-description">
      {{ props.community.description }}
    </p>
  </div>
</template>

<style scoped>
.community-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  width: 300px;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.community-card:hover {
  transform: scale(1.05);
  background-color: #e0e0e0;
}

.community-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.community-description {
  font-size: 0.9em;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
