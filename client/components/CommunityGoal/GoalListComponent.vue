<script setup lang="ts">
import GoalCardComponent from "@/components/CommunityGoal/GoalCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const { userId } = storeToRefs(useUserStore());
const incompleteGoals = ref<any[]>([]);
const completeGoals = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadGoals() {
  try {
    let query: Record<string, string> = userId.value !== undefined ? { authorId: userId.value } : {};
    const [incompleteResponse, completeResponse] = await Promise.all([fetchy("/api/goals/incomplete/community", "GET", { query }), fetchy("/api/goals/complete/user", "GET", { query })]);
    incompleteGoals.value = incompleteResponse;
    completeGoals.value = completeResponse;
  } catch (err) {
    console.error("Failed to load goals", err);
    error.value = "Failed to load goals.";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadGoals();
});
</script>

<template>
  <div>
    <div v-if="loading">Loading goals...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h3>Incomplete Goals</h3>
      <div v-for="goal in incompleteGoals" :key="goal._id">
        <GoalCardComponent :name="goal.name" :unit="goal.unit" :amount="goal.amount" :progress="goal.progress" :target-completion-date="goal.targetCompletionDate" :id="goal._id" />
      </div>

      <h3>Complete Goals</h3>
      <div v-for="goal in completeGoals" :key="goal._id">
        <GoalCardComponent :name="goal.name" :unit="goal.unit" :amount="goal.amount" :progress="goal.progress" :target-completion-date="goal.targetCompletionDate" :id="goal._id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.goal-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  align-items: stretch;
  justify-content: center; /* Center the goals horizontally */
}

.goal-item {
  width: 100%;
  max-width: 475px;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.goal-item:hover {
  transform: scale(1.05);
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

h3 {
  margin-top: 16px;
  font-weight: bold;
  text-align: center; /* Center the headers */
  padding-left: 20px; /* Indent the headers */
  padding-right: 20px; /* Indent the headers */
}
</style>
