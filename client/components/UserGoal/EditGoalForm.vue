<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const goalId = route.params.id as string;

// State for form inputs
const goalName = ref("");
const amount = ref<number | null>(null);
const unit = ref("");
const targetCompletionDate = ref("");

// Load goal data on component mount
const loadGoal = async () => {
  try {
    const goal = await fetchy(`/api/goals/user/${goalId}`, "GET");
    goalName.value = goal.name;
    amount.value = goal.amount;
    unit.value = goal.unit;
    targetCompletionDate.value = goal.targetCompletionDate ? new Date(goal.targetCompletionDate).toLocaleDateString("en-US") : "";
  } catch (err) {
    console.error("Failed to load goal:", err);
    alert("Error loading goal. Please try again.");
  }
};

// Save the updated goal
const saveGoal = async () => {
  if (!goalName.value || !amount.value || !unit.value) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    await fetchy(`/api/goals/user/${goalId}`, "PATCH", {
      body: {
        name: goalName.value,
        amount: amount.value,
        unit: unit.value,
        deadline: targetCompletionDate.value || null,
      },
    });
    await router.push(`/goals/user/${goalId}`);
  } catch (err) {
    console.error("Failed to update goal:", err);
    alert("Failed to update goal. Please try again.");
  }
};

// Cancel editing and return to "My Goals"
const cancelEdit = async () => {
  await router.push(`/goals/user/${goalId}`);
};

onMounted(loadGoal);
</script>

<template>
  <main>
    <h1>Edit Goal</h1>
    <form @submit.prevent="saveGoal" class="goal-form">
      <div class="form-group">
        <label for="name">Goal Name</label>
        <input id="name" v-model="goalName" type="text" required />
      </div>

      <div class="form-group">
        <label for="amount">Amount</label>
        <input id="amount" v-model="amount" type="number" min="1" required />
      </div>

      <div class="form-group">
        <label for="unit">Unit</label>
        <input id="unit" v-model="unit" type="text" required />
      </div>

      <div class="form-group">
        <label for="targetDate">Target Completion Date</label>
        <input id="targetDate" v-model="targetCompletionDate" type="text" placeholder="mm/dd/yyyy" required />
      </div>

      <div class="button-group">
        <button type="button" class="cancel-button" @click="cancelEdit">Cancel</button>
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
