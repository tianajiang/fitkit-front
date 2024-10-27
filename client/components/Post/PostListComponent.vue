<script setup lang="ts">
import CreateNewPostForm from "@/components/Post/CreateNewPostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps<{
  communityId?: string;
}>();

const loaded = ref(false);
const posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getPosts() {
  const communityId = props.communityId;
  let postResults;
  if (!communityId) {
    try {
      postResults = await fetchy("/api/posts", "GET");
      posts.value = postResults;
    } catch (_) {
      return;
    }
  } else {
    try {
      console.log("Fetching posts for community", communityId);
      postResults = await fetchy(`/api/communities/posts/${communityId}`, "GET");
      //get all of the post objects given the array of post ids
      const promises = postResults.map((id: string) => fetchy(`/api/posts/${id}`, "GET"));
      postResults = await Promise.all(promises);
      posts.value = postResults;
      console.log("Posts for community", communityId, postResults);
    } catch (_) {
      return;
    }
  }
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreateNewPostForm @refreshPosts="getPosts" :community-id="communityId" />
  </section>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts yet!</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
