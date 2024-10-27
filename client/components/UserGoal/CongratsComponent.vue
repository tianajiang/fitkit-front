<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const goalId = route.params.id as string;

// State variables
const goalName = ref("");
const totalAmount = ref<number>(0);
const goalUnit = ref("");

// Load goal details on component mount
const loadGoal = async () => {
  try {
    const goal = await fetchy(`/api/goals/user/${goalId}`, "GET");
    goalName.value = goal.name;
    totalAmount.value = goal.amount;
    goalUnit.value = goal.unit;
  } catch (err) {
    console.error("Failed to load goal:", err);
    alert("Could not load the goal details.");
    await router.push("/goals");
  }
};

// Return to goals list
const returnToGoals = async () => {
  await router.push("/goals");
};

onMounted(loadGoal);
</script>

<template>
  <main class="congrats-container">
    <h1>Congratulations! 🎉</h1>
    <p>You completed your goal:</p>
    <h2>{{ goalName }}</h2>
    <p>
      Total progress achieved: <strong>{{ totalAmount }} {{ goalUnit }}</strong>
    </p>

    <button @click="returnToGoals" class="return-button">Back to My Goals</button>
  </main>
</template>

<style scoped>
.congrats-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 10px;
  background-color: #f0f8ff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #4caf50;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.8rem;
  margin: 10px 0;
}

p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.return-button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.return-button:hover {
  background-color: #45a049;
}
</style>
