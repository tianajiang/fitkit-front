<script setup lang="ts">
import GoalListComponent from "@/components/UserGoal/GoalListComponent.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goToCreateGoalPage = async () => {
  await router.push("/goals/new"); // Navigate to the create goal page
};
</script>

<template>
  <main>
    <h1>My Goals</h1>
    <section>
      <div>
        <button @click="goToCreateGoalPage" class="create-goal-button">Create New Goal</button>
      </div>
    </section>
    <GoalListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.create-goal-button {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

.create-goal-button:hover {
  background-color: #45a049;
}
</style>
