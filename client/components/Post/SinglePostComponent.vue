<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const { isLoggedIn } = storeToRefs(useUserStore());
const route = useRoute();
const postId = route.params.id as string; // Get post ID from route parameters

const loaded = ref(false);
const post = ref<Record<string, string> | null>(null); // Single post data
let editing = ref(""); // Track if editing mode is active

async function getPost() {
  try {
    const postData = await fetchy(`/api/posts/${postId}`, "GET");
    post.value = postData;
  } catch (error) {
    console.error("Failed to load post:", error);
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPost();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Post Details</h2>
    <div class="post-container" v-if="loaded && post">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPost" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPost" @editPost="updateEditing" />
    </div>
    <p v-else-if="loaded">This post doesn't exist.</p>
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 0 auto;
  max-width: 60em;
}

.post-container {
  background-color: var(--base-bg);
  border-radius: 1em;
  padding: 1em;
  margin-top: 1em;
}
</style>
