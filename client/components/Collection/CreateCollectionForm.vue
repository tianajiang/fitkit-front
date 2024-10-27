<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// State for the collection name input
const collectionName = ref("");

// Handlers
const saveCollection = async () => {
  if (!collectionName.value) {
    alert("Please enter a collection name.");
    return;
  }

  try {
    await fetchy("/api/collections", "POST", {
      body: {
        name: collectionName.value,
      },
    });
    await router.push("/mycollections"); // Redirect to "My Collections" page
  } catch (err) {
    console.error("Failed to save collection:", err);
    alert("Failed to save collection. Please try again.");
  }
};

const cancelCollectionCreation = async () => {
  await router.push("/mycollections"); // Navigate back to "My Collections" page
};
</script>

<template>
  <main>
    <h1>Create New Collection</h1>
    <form @submit.prevent="saveCollection" class="collection-form">
      <div class="form-group">
        <label for="name">Collection Name</label>
        <input id="name" v-model="collectionName" type="text" placeholder="Enter collection name" required />
      </div>

      <div class="button-group">
        <button type="button" class="cancel-button" @click="cancelCollectionCreation">Cancel</button>
        <button type="submit" class="save-button">Save</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
main {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

input::placeholder {
  color: #a9a9a9;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.cancel-button,
.save-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #f85d52;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.save-button {
  background-color: #2bd14c;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
}
</style>
