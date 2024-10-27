<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy"; // Ensure you have a utility to handle API requests
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import bookmark from "@/assets/images/bookmark.png";
import bookmarkFilled from "@/assets/images/bookmarkFilled.png";

const props = defineProps<{
  postId: string;
}>();

const { userId } = storeToRefs(useUserStore());

const isSaved = ref(false);
const isModalOpen = ref(false);
const collections = ref<any[]>([]);
const selectedCollections = ref<string[]>([]); // Store the selected collection IDs

// Check if the post is saved in any collection
const checkIfSaved = async () => {
  try {
    const user = userId.value;
    const collectionsResponse = await fetchy(`/api/collections/user/${user}/post/${props.postId}`, "GET");
    isSaved.value = collectionsResponse.length > 0;
    selectedCollections.value = collectionsResponse.map((col: any) => col._id);
  } catch (err) {
    console.error("Failed to check save status", err);
  }
};

// Fetch all collections for the user
const loadCollections = async () => {
  try {
    const id = userId.value;
    collections.value = await fetchy(`/api/collections/user/${id}`, "GET");
  } catch (err) {
    console.error("Failed to load collections", err);
  }
};

// Open the modal
const toggleModal = async () => {
  isModalOpen.value = !isModalOpen.value;
  if (isModalOpen.value) {
    await loadCollections();
    await checkIfSaved();
  }
};

// Toggle selection of a collection
const toggleCollection = (collectionId: string) => {
  if (selectedCollections.value.includes(collectionId)) {
    selectedCollections.value = selectedCollections.value.filter((id) => id !== collectionId); // Deselect
  } else {
    selectedCollections.value.push(collectionId); // Select
  }
};

// Save the post to the selected collections
const savePostToCollections = async () => {
  try {
    // remove post from all collections not in selectedCollections
    const collectionsToRemove = collections.value.filter((collection) => !selectedCollections.value.includes(collection._id));
    await Promise.all(collectionsToRemove.map((collection) => fetchy(`/api/collections/${collection._id}/removePost/${props.postId}`, "PATCH")));
    await Promise.all(selectedCollections.value.map((collectionId) => fetchy(`/api/collections/${collectionId}/addPost/${props.postId}`, "PATCH")));
    await checkIfSaved(); // Update local state
    closeModal();
  } catch (err) {
    console.error("Failed to save post to collections", err);
  }
};

// Close the modal
const closeModal = () => {
  isModalOpen.value = false;
};

onMounted(checkIfSaved);
</script>

<template>
  <div>
    <button @click="toggleModal" class="save-button">
      <img :src="isSaved ? bookmarkFilled : bookmark" alt="Save Post" />
    </button>
    <div v-if="isModalOpen" class="modal">
      <h4>Select Collections</h4>
      <div class="collection-list">
        <div
          v-for="collection in collections"
          :key="collection._id"
          class="collection-item"
          @click="toggleCollection(collection._id)"
          :class="{ selected: selectedCollections.includes(collection._id) }"
        >
          {{ collection.name }}
        </div>
      </div>
      <div class="buttons">
        <button @click="savePostToCollections" class="save-selection-button">Save</button>
        <button @click="closeModal" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.save-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0; /* Adjust padding as needed */
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.save-button img {
  width: 24px; /* Adjust size as needed */
  height: 24px; /* Adjust size as needed */
}

.modal {
  position: absolute; /* Adjust positioning as needed */
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  z-index: 10;
}

.collection-list {
  max-height: 200px; /* Limit height of the collection list */
  overflow-y: auto; /* Enable scrolling if needed */
}

.collection-item {
  padding: 8px;
  cursor: pointer;
}

.collection-item.selected {
  background-color: #e0f7fa; /* Highlight selected item */
}

.cancel-button {
  margin-top: 8px;
  background-color: #f44336; /* Red color for cancel button */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-selection-button {
  margin-top: 8px;
  background-color: #4caf50; /* Red color for cancel button */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
