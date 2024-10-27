<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { content: content } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(content)">
    <p class="author">{{ props.post.author }}</p>
    <textarea id="content" v-model="content" placeholder="Edit your post!" required></textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small create-button" type="submit">Save</button></li>
        <li><button class="btn-small cancel-button" type="button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.create-button {
  background-color: #7243ff; /* Blue color */
  color: white;
  border: none;
  padding: 0.4em 1em; /* Smaller padding */
  font-size: 0.9rem; /* Smaller font size */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.create-button:hover {
  background-color: #541fff; /* Darker blue on hover */
}

.cancel-button {
  background-color: transparent; /* Default button style */
  color: #7243ff; /* Blue text */
  border: 1px solid #7243ff; /* Blue border */
  padding: 0.4em 1em; /* Smaller padding */
  font-size: 0.9rem; /* Smaller font size */
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.cancel-button:hover {
  background-color: #cac9c9; /* Blue background on hover */
  color: white; /* White text on hover */
}
</style>
