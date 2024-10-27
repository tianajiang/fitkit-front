<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const communityName = ref("");
const description = ref("");

// Handler to create a new community
const createCommunity = async () => {
  if (!communityName.value || !description.value) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    await fetchy("/api/communities", "POST", {
      body: {
        name: communityName.value,
        description: description.value,
      },
    });
    await router.push("/communities"); // Redirect to communities list or specific community
  } catch (err) {
    console.error("Failed to create community:", err);
    alert("Failed to create community. Please try again.");
  }
};

// Cancel the creation and navigate back to the community list
const cancelCreation = async () => {
  await router.push("/communities");
};
</script>

<template>
  <main>
    <h1>Create New Community</h1>
    <form @submit.prevent="createCommunity" class="community-form">
      <div class="form-group">
        <label for="communityName">Community Name</label>
        <input id="communityName" v-model="communityName" type="text" placeholder="Enter community name" required />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="description" placeholder="Enter a description for the community" required></textarea>
      </div>

      <div class="button-group">
        <button type="button" class="cancel-button" @click="cancelCreation">Cancel</button>
        <button type="submit" class="save-button">Create Community</button>
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

input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
  height: 100px;
}

input::placeholder,
textarea::placeholder {
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
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
}
</style>
