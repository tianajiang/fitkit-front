<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
// import { ref } from "vue";

const props = defineProps(["comment", "postId"]);
const emit = defineEmits(["editComment", "commentDeleted"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteComment = async () => {
  try {
    await fetchy(`/api/comments/${props.comment._id}`, "DELETE");
    emit("commentDeleted", props.comment._id);
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};
</script>

<template>
  <div class="comment-container">
    <p class="author">{{ props.comment.author }}</p>
    <p class="commentContent">{{ props.comment.content }}</p>
    <div class="comment-actions">
      <menu v-if="props.comment.author === currentUsername">
        <li>
          <button class="button-error btn-small pure-button small-button" @click="deleteComment">Delete</button>
        </li>
      </menu>
      <div class="timestamp">Posted on: {{ formatDate(props.comment.dateCreated) }}</div>
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  border-top: 1px solid #ddd;
  padding: 0.5em 1em;
}

.author {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 0.1em;
}

.commentContent {
  font-size: 0.9em;
  margin-bottom: 0.1em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  padding: 0;
  margin: 0;
}

.small-button {
  margin-top: 0.5em;
  padding: 0.4em 1em; /* Smaller padding */
  font-size: 0.9rem; /* Smaller font size */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.button-error {
  background-color: #f44336; /* Red color for delete button */
  color: white;
  border: none;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  font-size: 0.65em;
  font-style: italic;
  margin-left: auto;
}

.timestamp p {
  margin: 0;
}
</style>
