<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["post", "onCommentAdded"]);
const emit = defineEmits(["commentAdded"]);

const { currentUsername } = storeToRefs(useUserStore());
const newComment = ref("");

// Function to handle comment submission
const submitComment = async () => {
  if (newComment.value.trim() === "") return; // Prevent empty comments

  try {
    const response = await fetchy(`/api/comments`, "POST", {
      body: {
        targetId: props.post._id,
        content: newComment.value,
        author: currentUsername.value, // Assuming you want to include the author's username
      },
    });

    emit("commentAdded", response); // Emit an event with the new comment
    emptyForm(); // Clear the input
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
};

// const createPost = async (content: string) => {
//   try {
//     await fetchy("/api/posts", "POST", {
//       body: { content },
//     });
//   } catch (_) {
//     return;
//   }
//   emit("refreshPosts");
//   emptyForm();
// };

// Function to clear the input
const emptyForm = () => {
  newComment.value = "";
};
</script>

<template>
  <form @submit.prevent="submitComment">
    <label for="commentContent">Add a comment:</label>
    <textarea id="commentContent" v-model="newComment" placeholder="Add a comment..." required></textarea>
    <button type="submit" class="pure-button-primary pure-button">Submit</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 4em; /* Smaller height for comments */
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  border: 1px solid #ccc; /* Add border for better visibility */
}

button {
  align-self: flex-end; /* Align button to the right */
}
</style>
