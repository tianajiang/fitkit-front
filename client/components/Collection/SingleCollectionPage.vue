<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchy } from "../../utils/fetchy";
import SmallPostComponent from "../Post/SmallPostCard.vue";

const route = useRoute();
const router = useRouter();
const collectionId = route.params.id as string;
const posts = ref<Array<{ _id: string; author: string; content: string }>>([]);

// Fetch posts in the specified collection
const loadPosts = async () => {
  if (!collectionId) return;

  try {
    let postResults = await fetchy(`/api/collections/${collectionId}/posts`, "GET");
    console.log("Post results:", postResults);
    const promises = postResults.map((id: string) => fetchy(`/api/posts/${id}`, "GET"));
    postResults = await Promise.all(promises);
    posts.value = postResults;
  } catch (error) {
    console.error("Failed to load posts:", error);
  }
};

// Get the collection ID from the route
onMounted(async () => {
  await loadPosts();
});
</script>

<template>
  <div class="collection-page">
    <h1>Posts in Collection</h1>
    <div class="posts">
      <SmallPostComponent v-for="post in posts" :key="post._id" :post="post" />
      <p v-if="posts.length === 0">No posts available in this collection.</p>
    </div>
  </div>
</template>

<style scoped>
.collection-page {
  padding: 1em;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 1em; /* Space between posts */
}
</style>
