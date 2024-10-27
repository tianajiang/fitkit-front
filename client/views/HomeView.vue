<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <div v-if="isLoggedIn">
        <h1>Welcome {{ currentUsername }}!</h1>
        <PostListComponent />
      </div>
      <h1 v-else>Please login to see posts and interact!</h1>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
