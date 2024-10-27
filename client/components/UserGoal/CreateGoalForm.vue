<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// State for form inputs
const goalName = ref("");
const amount = ref<number | null>(null);
const unit = ref("");
const targetCompletionDate = ref("");

// Handlers
const saveGoal = async () => {
  if (!goalName.value || !amount.value || !unit.value || !targetCompletionDate.value) {
    alert("Please fill out all fields.");
    return;
  }
  if (amount.value! <= 0) {
    alert("Amount must be greater than 0.");
    return;
  }
  if (new Date(targetCompletionDate.value) < new Date()) {
    alert("Target completion date must be in the future.");
    return;
  }
  try {
    await fetchy("/api/goals/user", "POST", {
      body: {
        name: goalName.value,
        amount: amount.value,
        unit: unit.value,
        deadline: targetCompletionDate.value || null,
      },
    });
    await router.push("/goals"); // Redirect to "My Goals" page on success
  } catch (err) {
    console.error("Failed to save goal:", err);
    alert("Failed to save goal. Please try again.");
  }
};

const cancelGoalCreation = async () => {
  await router.push("/goals"); // Navigate back to "My Goals" page
};
</script>

<template>
  <main>
    <h1>Create New Goal</h1>
    <form @submit.prevent="saveGoal" class="goal-form">
      <div class="form-group">
        <label for="name">Goal Name</label>
        <input id="name" v-model="goalName" type="text" placeholder="Enter goal name" required />
      </div>

      <div class="form-group">
        <label for="amount">Amount</label>
        <input id="amount" v-model="amount" type="number" min="1" placeholder="Enter amount" required />
      </div>

      <div class="form-group">
        <label for="unit">Unit</label>
        <input id="unit" v-model="unit" type="text" placeholder="Enter unit (e.g., minutes, pounds)" required />
      </div>

      <div class="form-group">
        <label for="targetDate">Target Completion Date</label>
        <input id="targetDate" v-model="targetCompletionDate" type="text" placeholder="mm/dd/yyyy" required />
      </div>

      <div class="button-group">
        <button type="button" class="cancel-button" @click="cancelGoalCreation">Cancel</button>
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
