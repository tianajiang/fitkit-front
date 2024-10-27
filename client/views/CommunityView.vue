<script setup lang="ts">
import MyCommunityPageList from "@/components/Community/MyCommunityPageList.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>My Communities</h1>
    <section>
      <h1 v-if="isLoggedIn"></h1>
      <h1 v-else>Please login!</h1>
    </section>
    <MyCommunityPageList />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
