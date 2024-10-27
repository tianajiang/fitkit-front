<script setup lang="ts">
import GoalCardComponent from "@/components/CommunityGoal/GoalCardComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostListComponent from "../Post/PostListComponent.vue";

const route = useRoute();
const router = useRouter();
const communityId = route.params.id as string;
const { currentUsername, userId } = storeToRefs(useUserStore());

const community = ref<{ name: string; description: string; members: string[]; posts: string[] }>();
const isMember = ref(false); // Track if user is a member of the community
const posts = ref<Array<Record<string, string>>>([]);
const members = ref<Array<{ id: string; username: string }>>([]);
const incompleteGoals = ref<Array<{ name: string; unit: string; amount: number; progress: number; targetCompletionDate: string; _id: string }>>([]);
const completeGoals = ref<Array<{ name: string; unit: string; amount: number; progress: number; targetCompletionDate: string; _id: string }>>([]);

// Load community info and check membership status
const loadCommunity = async () => {
  try {
    const data = await fetchy(`/api/communities/${communityId}`, "GET");
    community.value = data;
    isMember.value = await checkMembership();

    if (isMember.value) {
      await Promise.all([loadPosts(data.posts), loadMembers(data.members), loadGoals()]);
    }
  } catch (err) {
    console.error("Failed to load community:", err);
    alert("Could not load the community. Redirecting...");
    await router.push("/communities");
  }
};

const checkMembership = async () => {
  const { isMember } = await fetchy(`/api/communities/${communityId}/isMember`, "GET");
  return isMember;
};

// Load post details by their IDs
const loadPosts = async (postIds: string[]) => {
  try {
    const promises = postIds.map((id) => fetchy(`/api/posts/${id}`, "GET"));
    posts.value = await Promise.all(promises);
  } catch (err) {
    console.error("Failed to load posts:", err);
  }
};

// Load member details by their IDs
const loadMembers = async (memberIds: string[]) => {
  try {
    const promises = memberIds.map((id) => fetchy(`/api/users/username/${id}`, "GET"));
    members.value = await Promise.all(promises);
  } catch (err) {
    console.error("Failed to load members:", err);
  }
};

const loadGoals = async () => {
  try {
    let query: Record<string, string> = communityId !== undefined ? { communityId } : {};
    const incdata = await fetchy(`/api/goals/incomplete/community`, "GET", { query });
    incompleteGoals.value = incdata;
    const compdata = await fetchy(`/api/goals/complete/community`, "GET", { query });
    completeGoals.value = compdata;
  } catch (err) {
    console.error("Failed to load community goals:", err);
  }
};

// Handle joining the community
const joinCommunity = async () => {
  try {
    await fetchy(`/api/communities/join/${communityId}`, "PUT");
    isMember.value = true;
    members.value.push({ id: userId.value, username: currentUsername.value }); // Add the current user to the members list
    await loadCommunity();
    await Promise.all([loadPosts(community.value!.posts), loadMembers(community.value!.members), loadGoals()]);
  } catch (err) {
    console.error("Failed to join community:", err);
  }
};

const leaveCommunity = async () => {
  try {
    await fetchy(`/api/communities/leave/${communityId}`, "PUT");
    isMember.value = false;
    members.value = members.value.filter((member) => member.id !== userId.value); // Remove the current user from the members list
    await loadCommunity();
    await Promise.all([loadPosts(community.value!.posts), loadMembers(community.value!.members), loadGoals()]);
  } catch (err) {
    console.error("Failed to leave community:", err);
  }
};

const goToCreateGoalPage = async () => {
  await router.push(`/goals/community/${communityId}/new`);
};

onMounted(loadCommunity);
</script>

<template>
  <main>
    <section class="community-header">
      <h1>{{ community?.name }}</h1>
      <p>{{ community?.description }}</p>
    </section>

    <button @click="isMember ? leaveCommunity() : joinCommunity()" class="membership-button">
      {{ isMember ? "Leave Community" : "Join Community" }}
    </button>

    <section v-if="isMember" class="community-content">
      <div class="posts">
        <div class="post-list">
          <PostListComponent :communityId="communityId" />
        </div>
        <p v-if="!posts.length">No posts yet!</p>
      </div>

      <div class="sidebar">
        <div class="goals">
          <h3>Community Goals</h3>
          <button @click="goToCreateGoalPage" class="create-goal-button">Create New Community Goal</button>
          <h4>Incomplete Goals</h4>
          <div v-if="incompleteGoals.length">
            <GoalCardComponent
              v-for="goal in incompleteGoals"
              :key="goal._id"
              :name="goal.name"
              :unit="goal.unit"
              :amount="goal.amount"
              :progress="goal.progress"
              :target-completion-date="goal.targetCompletionDate"
              :id="goal._id"
              class="goal-item"
            />
          </div>
          <p v-else>No incomplete goals yet!</p>

          <h4>Complete Goals</h4>
          <div v-if="completeGoals.length">
            <GoalCardComponent
              v-for="goal in completeGoals"
              :key="goal._id"
              :name="goal.name"
              :unit="goal.unit"
              :amount="goal.amount"
              :progress="goal.progress"
              :target-completion-date="goal.targetCompletionDate"
              :id="goal._id"
              :small="true"
            />
          </div>
          <p v-else>No completed goals yet!</p>
        </div>

        <div class="members">
          <h3>Members</h3>
          <ul>
            <li v-for="member in members" :key="member.id">
              {{ member.username }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-else class="join-message">
      <p>Join to view posts, members, and goals in this community!</p>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5em;
  padding: 2em;
}

.community-header {
  text-align: center;
}

.community-content {
  display: flex;
  gap: 2em;
  width: 100%;
  max-width: 1200px;
}

.posts {
  flex: 3;
  background-color: #f9f9f9;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-item {
  border-bottom: 1px solid #ddd;
  padding: 0.5em 0;
}

.post-item:last-child {
  border-bottom: none;
}

.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.goals,
.members {
  background-color: #fff;
  padding: 1em;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.join-message {
  text-align: center;
}

button {
  margin-top: 1em;
  padding: 0.5em 1em;
  font-size: 16px;
  background-color: #fb7b90;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #f0577b;
}

.goal-item {
  max-width: 475px;
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.goal-item:hover {
  transform: scale(1.05);
}

.membership-button {
  padding: 0.5em 1em;
  font-size: 16px;
  background-color: #fb7b90;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
