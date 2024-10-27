<script setup lang="ts">
import CollectionCardComponent from "@/components/Collection/CollectionCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy"; // Adjust the path as necessary
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { userId } = storeToRefs(useUserStore());
const collections = ref<Array<{ _id: string; name: string }>>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

async function loadCollections() {
  try {
    const response = await fetchy(`/api/collections/user/${userId.value}`, "GET");
    collections.value = response;
  } catch (err) {
    error.value = "Failed to load collections.";
  } finally {
    loading.value = false;
  }
}

// Fetch the collections on mount
onMounted(loadCollections);

async function goToCreateCollection() {
  await router.push("/collections/new");
}
</script>

<template>
  <div class="collection-list">
    <div class="buttons">
      <button @click="goToCreateCollection" class="create-button">Create New Collection</button>
    </div>
    <p v-if="loading">Loading collections...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else class="collection-grid">
      <div v-if="collections.length === 0">You have not created any collections. Create a collection to get started!</div>
      <CollectionCardComponent v-for="collection in collections" :key="collection._id" :collection="collection" />
    </div>
  </div>
</template>

<style scoped>
.buttons {
  display: flex;
  gap: 1em;
}
.collection-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.collection-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
}

.create-button {
  margin-top: 2em;
  padding: 0.8em 1.5em;
  font-size: 1rem;
  background-color: #fb7b90;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.find-button:hover {
  background-color: #f0577b;
}
</style>
