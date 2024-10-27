<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  name: string;
  unit: string;
  amount: number;
  progress: number;
  targetCompletionDate: string;
  id: string;
}>();

const router = useRouter();

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function checkValidDate(date: string): boolean {
  return new Date(date).getTime() > 0;
}

const goToSingleGoalPage = async (goalId: string) => {
  //only go to a page if the goal is not completed
  if (props.progress < props.amount) {
    await router.push(`/goals/community/${goalId}`);
  }
};

// Compute the percentage of progress for the progress bar
const progressPercentage = computed(() => (props.progress / props.amount) * 100);
</script>

<template>
  <div class="goal-card" @click="goToSingleGoalPage(props.id)">
    <div class="goal-info">
      <h4>{{ name }}</h4>
      <p v-if="progress >= 0">{{ progress }} / {{ amount }} {{ unit }}</p>
      <p v-else>{{ amount }} / {{ amount }} {{ unit }}</p>
    </div>
    <div class="goal-info">
      <p v-if="progress < amount && checkValidDate(targetCompletionDate)">Target completion date: {{ formatDate(targetCompletionDate) }}</p>
      <p v-else-if="checkValidDate(targetCompletionDate)">Completed on: {{ formatDate(targetCompletionDate) }}</p>
      <p v-else>No target completion date set!</p>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
    </div>
  </div>
</template>

<style scoped>
.goal-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 85%;
}

.goal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-info p {
  font-size: 12px; /* Adjust as needed */
}

.progress-bar-container {
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #76c7c0;
  transition: width 0.3s ease-in-out;
}
</style>
