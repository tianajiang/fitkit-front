<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import CommentComponent from "./CommentComponent.vue";
import { ref, onMounted } from "vue";
import CreateCommentForm from "./CreateCommentForm.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const comments = ref<Array<Record<string, string>>>([]);

async function getComments(targetId?: string) {
  let commentResults;
  let query: Record<string, string> = targetId ? { targetId } : {};
  try {
    commentResults = await fetchy(`/api/comments/`, "GET", { query });
  } catch {
    return;
  }
  comments.value = commentResults;
}

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

function handleCommentAdded(newComment) {
  console.log("adding comment", newComment);
  comments.value.push(newComment);
}

function handleCommentDeleted(commentId) {
  comments.value = comments.value.filter((comment) => comment._id !== commentId); // Remove the deleted comment
}

onMounted(async () => {
  await getComments(props.post._id);
});
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
  <div class="comments">
    <CommentComponent v-for="comment in comments" :key="comment._id" :comment="comment" @commentDeleted="handleCommentDeleted" />
  </div>
  <CreateCommentForm :post="props.post" @commentAdded="handleCommentAdded" />
</template>

<style scoped>
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
