<script setup lang="ts">
import AddProgressForm from "@/components/CommunityGoal/addProgressForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <AddProgressForm />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
