<script setup lang="ts">
import SmallPostComponent from "@/components/Post/SmallPostCard.vue"; // Post component
import { fetchy } from "@/utils/fetchy"; // Fetch utility
import { onMounted, ref } from "vue";

const searchKeyword = ref(""); // Store search input
const posts = ref<Array<{ _id: string; author: string; content: string }>>([]); // Posts state

// Load all posts from the collection
const loadAllPosts = async () => {
  try {
    const postResults = await fetchy("/api/collections/671e76ffed05bc24b857840f/posts", "GET");
    const detailedPosts = await Promise.all(postResults.map((id: string) => fetchy(`/api/posts/${id}`, "GET")));
    posts.value = detailedPosts;
  } catch (err) {
    console.error("Failed to load posts:", err);
  }
};

const reloadAllPosts = async (postlist: string[]) => {
  try {
    const detailedPosts = await Promise.all(postlist.map((postId: string) => fetchy(`/api/posts/${postId}`, "GET")));
    posts.value = detailedPosts;
  } catch (err) {
    console.error("Failed to load posts:", err);
  }
};

// Search posts using the keyword
const searchPosts = async () => {
  try {
    if (searchKeyword.value) {
      const keyword = searchKeyword.value;
      const searchResults = await fetchy(`/api/GlobalExerciseLibrary/search/${encodeURIComponent(keyword)}`, "GET");
      await reloadAllPosts(searchResults);
    } else {
      await loadAllPosts(); // Reset to all posts if search is cleared
    }
  } catch (err) {
    console.error("Failed to search posts:", err);
  }
};

// Handle "Enter" key press for search
async function handleEnter() {
  await searchPosts();
}

// Load all posts on component mount
onMounted(loadAllPosts);
</script>

<template>
  <main class="exercise-library">
    <h1>Global Exercise Library</h1>
    <p>Explore exercises that anyone can contribute to!</p>

    <!-- Search Bar -->
    <input v-model="searchKeyword" @keyup.enter="handleEnter" type="text" placeholder="Search for exercises..." class="search-bar" />

    <section class="post-list">
      <SmallPostComponent v-for="post in posts" :key="post._id" :post="post" />
      <p v-if="!posts.length" class="no-results">No exercises found.</p>
    </section>
  </main>
</template>

<style scoped>
.exercise-library {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 2em;
}

.search-bar {
  width: 100%;
  max-width: 500px;
  padding: 0.75em;
  font-size: 1em;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.post-list {
  width: 100%;
  max-width: 800px;
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.no-results {
  text-align: center;
  color: #888;
}
</style>
