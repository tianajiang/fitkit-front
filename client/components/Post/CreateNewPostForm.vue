<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const { userId, currentUsername } = storeToRefs(useUserStore());
const selectedCommunity = ref<string | null>(null); // Holds selected community
const communities = ref<Array<{ _id: string; name: string }>>([]); // User's communities
const addToLibrary = ref(false); // Toggle for adding post to library
const emit = defineEmits(["refreshPosts"]);

const props = defineProps<{
  communityId?: string;
}>();

// Fetch communities on component mount
const loadCommunities = async () => {
  try {
    const result = await fetchy(`/api/communities/user/${userId.value}`, "GET");
    console.log("Communities:", result);
    communities.value = result;
    if (communities.value.length > 0) {
      selectedCommunity.value = props.communityId || communities.value[0]._id;
    }
  } catch (err) {
    console.error("Failed to load communities:", err);
  }
};

// Create the post with content, community, and library toggle
const createPost = async (content: string, communityId: string | null, addToLibrary: boolean) => {
  if (!communityId && !props.communityId) {
    alert("Please select a community to post to. If you don't have any communities, join one or create your own!");
    return;
  } else if (!communityId && props.communityId) {
    communityId = props.communityId;
  }

  try {
    await fetchy("/api/posts", "POST", {
      body: {
        content,
        communityId,
        addToLibrary,
      },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

// Clear the form inputs
const emptyForm = () => {
  content.value = "";
  selectedCommunity.value = props.communityId || communities.value[0]._id;
  addToLibrary.value = false;
};

onMounted(loadCommunities);
</script>

<template>
  <form @submit.prevent="createPost(content, selectedCommunity, addToLibrary)">
    <label for="content">Post Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a post!" required></textarea>

    <section v-if="props.communityId === undefined">
      <label for="community">Select Community: </label>
      <select id="community" v-model="selectedCommunity">
        <option v-for="community in communities" :key="community._id" :value="community._id">
          {{ community.name }}
        </option>
      </select>
    </section>

    <label for="library-toggle">Add to Global Exercise Library?</label>
    <input id="library-toggle" type="checkbox" v-model="addToLibrary" />

    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
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
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

select {
  padding: 0.5em;
  font-size: inherit;
  border-radius: 4px;
}

input[type="checkbox"] {
  width: 1.2em;
  height: 1.2em;
}
</style>
