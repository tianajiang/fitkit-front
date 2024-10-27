<script setup lang="ts">
import { fetchy } from "@/utils/fetchy"; // Fetch utility
import { onMounted, ref } from "vue";
import CommunityCardComponent from "@/components/Community/CommunityCardComponent.vue";

const searchKeyword = ref(""); // Search input
const communities = ref<Array<{ name: string; description: string; _id: string }>>([]);

// Fetch all communities on page load
const loadAllCommunities = async () => {
  try {
    const result = await fetchy("/api/communities", "GET");
    communities.value = result;
  } catch (err) {
    console.error("Failed to load communities:", err);
  }
};

// Fetch communities by search keyword
const searchCommunities = async () => {
  try {
    if (searchKeyword.value) {
      const keyword = searchKeyword.value;
      //   console.log("Searching for communities with keyword:", keyword);
      //   let query: Record<string, string> = keyword !== undefined ? { keyword } : {};
      //   const result = await fetchy("/api/communities/search", "GET", { query });
      const result = await fetchy(`/api/communities/search/${keyword}`, "GET");
      communities.value = result;
    } else {
      await loadAllCommunities(); // Reset to all communities if no keyword
    }
  } catch (err) {
    console.error("Failed to search communities:", err);
  }
};

async function handleEnter() {
  await searchCommunities();
}

// Watch for changes in the search bar and update results
// watch(searchKeyword, async (newKeyword) => {
//   await searchCommunities(newKeyword);
// });

onMounted(loadAllCommunities); // Load all communities on mount
</script>

<template>
  <main class="find-communities">
    <h1>Find Communities</h1>

    <input v-model="searchKeyword" @keyup.enter="handleEnter" type="text" placeholder="Search for communities..." class="search-bar" />

    <section class="community-list">
      <CommunityCardComponent v-for="community in communities" :key="community._id" :community="community" />

      <p v-if="!communities.length" class="no-results">No communities found.</p>
    </section>
  </main>
</template>

<style scoped>
.find-communities {
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

.community-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  width: 800px;
  height: 100px;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.community-list {
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
