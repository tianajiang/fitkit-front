<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const goalId = route.params.id as string;
const router = useRouter();

const goal = ref({
  name: "",
  unit: "",
  amount: 0,
  progress: 0,
  creationDate: "",
  targetCompletionDate: "",
});

const loadGoalDetails = async () => {
  try {
    const response = await fetchy(`/api/goals/community/${goalId}`, "GET");
    goal.value = response;
  } catch (error) {
    console.error("Failed to load goal details:", error);
  }
};

// Format date to "MM/DD/YYYY"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
};

const progressPercentage = () => {
  return Math.min((goal.value.progress / goal.value.amount) * 100, 100);
};

const deleteGoal = async () => {
  try {
    await fetchy(`/api/goals/community/${goalId}`, "DELETE");
  } catch (error) {
    console.error("Failed to delete goal:", error);
    alert("Failed to delete goal. Please try again.");
  }
  await router.push("/communities");
};

const editGoal = async () => {
  await router.push(`/goals/community/edit/${goalId}`);
};

const addProgress = async () => {
  await router.push(`/goals/community/add-progress/${goalId}`);
};

onMounted(loadGoalDetails);
</script>

<template>
  <main class="goal-detail">
    <h1>{{ goal.name }}</h1>
    <p>Created: {{ formatDate(goal.creationDate) }}</p>
    <p>Target Completion: {{ formatDate(goal.targetCompletionDate) }}</p>

    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressPercentage() + '%' }"></div>
    </div>
    <p>Progress: {{ goal.progress }} / {{ goal.amount }} {{ goal.unit }}</p>

    <div class="button-container">
      <button class="action-button" @click="addProgress">Add Progress</button>
      <button class="action-button" @click="editGoal">Edit Goal</button>
      <button class="action-button" @click="deleteGoal">Delete Goal</button>
    </div>
  </main>
</template>

<style scoped>
.goal-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
}

.progress-bar-container {
  width: 100%;
  max-width: 500px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-bar {
  height: 100%;
  background-color: #fb7b90;
  transition: width 0.3s ease;
}

.button-container {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #1976d2;
}
</style>
