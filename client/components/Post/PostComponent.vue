<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router
import { fetchy } from "../../utils/fetchy";
import SaveButtonComponent from "../Collection/SaveButtonComponent.vue";
import CommentComponent from "./CommentComponent.vue";
import CreateCommentForm from "./CreateCommentForm.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, userId } = storeToRefs(useUserStore());
const comments = ref<Array<Record<string, string>>>([]);
const router = useRouter(); // Initialize router

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
  await router.push("/");
};

async function handleCommentAdded() {
  await getComments(props.post._id); // Refresh the comments
}

function handleCommentDeleted(commentId: string) {
  comments.value = comments.value.filter((comment) => comment._id !== commentId); // Remove the deleted comment
}

onMounted(async () => {
  await getComments(props.post._id);
});

// Function to navigate to the author's profile
const navigateToAuthorProfile = async () => {
  const authorId = await fetchy(`/api/users/username/${props.post.author}`, "GET"); // Fetch the author's ID
  await router.push(`/profile/${authorId._id}`); // Assuming authorId is available in the post object
};
</script>

<template>
  <div class="header">
    <p class="author" @click="navigateToAuthorProfile">{{ props.post.author }}</p>
    <SaveButtonComponent :postId="props.post._id" />
  </div>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li>
        <button class="edit-button small-button" @click="emit('editPost', props.post._id)">Edit</button>
      </li>
      <li>
        <button class="button-error small-button" @click="deletePost">Delete</button>
      </li>
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
  cursor: pointer; /* Change cursor to pointer for clickability */
}

.author:hover {
  text-decoration: underline; /* Optional: underline on hover to indicate it's clickable */
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

.header {
  display: flex;
  justify-content: space-between; /* Space out the author and save button */
  align-items: center;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.small-button {
  padding: 0.4em 1em; /* Smaller padding */
  font-size: 0.9rem; /* Smaller font size */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.edit-button {
  background-color: #ff9800; /* Orange color for edit button */
  color: white;
  border: none;
}

.edit-button:hover {
  background-color: #fb8c00; /* Darker orange on hover */
}

.button-error {
  background-color: #f85d52; /* Red color for delete button */
  color: white;
  border: none;
}

.button-error:hover {
  background-color: #d32f2f;
}
</style>
