<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(["post"]);
const router = useRouter();

// Navigate to the single post page on click
const navigateToPost = async () => {
  await router.push(`/posts/${props.post._id}`);
};
</script>

<template>
  <div class="post" @click="navigateToPost">
    <!-- Add click event for navigation -->
    <p class="author">{{ props.post.author }}</p>
    <p class="content">{{ props.post.content }}</p>
  </div>
</template>

<style scoped>
.post {
  background-color: var(--base-bg);
  border-radius: 0.5em;
  padding: 1em;
  margin-bottom: 1em;
  cursor: pointer; /* Change cursor to pointer to indicate clickable item */
  transition: transform 0.2s;
  width: 800px;
}

.post:hover {
  transform: scale(1.05);
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.1em; /* Slightly smaller than the original */
}

.content {
  font-size: 1em; /* Adjusted for smaller display */
  margin: 0.5em 0; /* Space between author and content */
}

.timestamp {
  font-size: 0.85em;
  font-style: italic;
  display: flex;
  justify-content: flex-end;
}
</style>
