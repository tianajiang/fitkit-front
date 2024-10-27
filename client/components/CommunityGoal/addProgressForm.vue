<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const goalId = route.params.id as string;

// State variables
const goalName = ref("");
const currentProgress = ref<number>(0);
const goalAmount = ref<number>(0);
const amount = ref<number | null>(null); // Input for additional progress

// Load the goal data on component mount
const loadGoal = async () => {
  try {
    const goal = await fetchy(`/api/goals/community/${goalId}`, "GET");
    goalName.value = goal.name;
    goalAmount.value = goal.amount;
    currentProgress.value = goal.progress;
  } catch (err) {
    console.error("Failed to load goal:", err);
    alert("Could not load the goal. Please try again.");
    await router.push("/goals");
  }
};

// Handler for saving progress
const saveProgress = async () => {
  if (amount.value === null || amount.value <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    await fetchy(`/api/goals/community/${goalId}/progress`, "PATCH", {
      body: {
        progress: amount.value,
      },
    });
    //check if goal is now complete. if so, route to congratulations page.
    if (currentProgress.value + amount.value >= goalAmount.value) {
      console.log("goal complete KSEJFKSDJFKJDHFKJDFHKJDFH");
      await router.push(`/goals/community/complete/${goalId}`);
    } else {
      console.log("NSEODFJLDSKJFLKD");
      await router.push(`/goals/community/${goalId}`);
    }
  } catch (err) {
    console.error("Failed to update progress:", err);
    alert("Failed to update progress. Please try again.");
  }
};

// Cancel and navigate back to the goal view
const cancel = async () => {
  await router.push(`/goals/${goalId}`);
};

onMounted(loadGoal);
</script>

<template>
  <main>
    <h1>Add Progress</h1>
    <p><strong>Goal:</strong> {{ goalName }}</p>
    <p><strong>Current Progress:</strong> {{ currentProgress }}</p>

    <form @submit.prevent="saveProgress" class="progress-form">
      <div class="form-group">
        <label for="amount">Add Progress</label>
        <input id="amount" v-model.number="amount" type="number" min="1" placeholder="Enter progress amount" required />
      </div>

      <div class="button-group">
        <button type="button" class="cancel-button" @click="cancel">Cancel</button>
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

p {
  text-align: center;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
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
