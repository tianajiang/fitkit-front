<script setup lang="ts">
import CommunityCardComponent from "@/components/Community/CommunityCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const { userId } = storeToRefs(useUserStore());
const communities = ref<Array<{ _id: string; name: string; description: string }>>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

async function loadCommunities() {
  try {
    const response = await fetchy(`/api/communities/user/${userId.value}`, "GET");
    communities.value = response;
  } catch (err) {
    error.value = "Failed to load communities.";
  } finally {
    loading.value = false;
  }
}

// Fetch the communities on mount
onMounted(loadCommunities);

async function goToFindCommunities() {
  await router.push("/communities/find");
}

async function goToCreateCommunity() {
  await router.push("/communities/new");
}
</script>

<template>
  <div class="community-list">
    <div class="buttons">
      <button @click="goToFindCommunities" class="find-button">Find New Communities</button>
      <button @click="goToCreateCommunity" class="find-button">Create New Community</button>
    </div>
    <p v-if="loading">Loading communities...</p>
    <p v-else-if="error">{{ error }}</p>
    <div v-else class="community-grid">
      <div v-if="communities.length === 0">You have not joined any communities. Join communities to create posts and see what your peers are up to!</div>
      <CommunityCardComponent v-for="community in communities" :key="community._id" :community="community" />
    </div>
  </div>
</template>

<style scoped>
.buttons {
  display: flex;
  gap: 1em;
}
.community-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.community-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
}

.find-button {
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
