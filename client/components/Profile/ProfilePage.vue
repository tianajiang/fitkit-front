<script setup lang="ts">
import { fetchy } from "@/utils/fetchy"; // Ensure you have this utility for fetching
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import CollectionCardComponent from "../Collection/CollectionCardComponent.vue";

const route = useRoute();
const profileId = route.params.id as string;
const collections = ref<Array<{ _id: string; name: string; description: string }>>([]);
const username = ref<string>("");

// Fetch user details and collections
const loadUserAndCollections = async () => {
  try {
    const userResponse = await fetchy(`/api/users/${profileId}`, "GET");
    username.value = userResponse.username; // Assuming the user object has a `username` field

    const collectionsResponse = await fetchy(`/api/collections/user/${profileId}`, "GET");
    collections.value = collectionsResponse;
  } catch (error) {
    console.error("Failed to load user or collections:", error);
  }
};

onMounted(loadUserAndCollections);
</script>

<template>
  <div class="profile-page">
    <h1>{{ username }}'s Profile</h1>
    <div class="collection-list">
      <CollectionCardComponent v-for="collection in collections" :key="collection._id" :collection="collection" />
      <p v-if="collections.length === 0">No collections yet!</p>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 2em;
  text-align: center; /* Center the text */
}

.collection-list {
  display: flex; /* Use Flexbox */
  flex-wrap: wrap; /* Allow wrapping */
  justify-content: center; /* Center the items */
  margin-top: 2em;
}

.collection-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 1em; /* Add margin to create space between cards */
  background-color: white;
  flex: 1 1 calc(30% - 2em); /* Responsive size; 3 cards per row */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional shadow for aesthetics */
}

.collection-card h3 {
  margin: 0;
}

.collection-card button {
  margin-top: 1em;
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  background-color: #7243ff;
  color: white;
  cursor: pointer;
}

.collection-card button:hover {
  background-color: #541fff;
}
</style>
