import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CommunitiesView from "../views/CommunityView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MyGoalsView from "../views/MyGoalsView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/communities",
      name: "Communities",
      component: CommunitiesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/communities/:id",
      name: "Community",
      component: () => import("../views/SingleCommunityView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/communities/new",
      name: "NewCommunity",
      component: () => import("../views/CreateCommunityView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/communities/find",
      name: "FindCommunities",
      component: () => import("../views/FindCommunitiesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals",
      name: "Goals",
      component: MyGoalsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/new",
      name: "NewGoal",
      component: () => import("../views/CreateGoalView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/user/:id",
      name: "Goal",
      component: () => import("@/views/SingleGoalPageView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/edit/:id",
      name: "UpdateGoal",
      component: () => import("@/views/EditGoalView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/add-progress/:id",
      name: "AddProgress",
      component: () => import("../views/AddGoalProgressView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/user/complete/:id",
      name: "Congrats",
      component: () => import("@/views/CongratsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/community/:id/new",
      name: "NewCommunityGoal",
      component: () => import("../views/CommunityGoals/CreateGoalView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/community/:id",
      name: "CommunityGoal",
      component: () => import("@/views/CommunityGoals/SingleGoalPageView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/community/edit/:id",
      name: "UpdateCommunityGoal",
      component: () => import("@/views/CommunityGoals/EditGoalView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/community/add-progress/:id",
      name: "AddProgressCommunity",
      component: () => import("../views/CommunityGoals/AddGoalProgressView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/goals/community/complete/:id",
      name: "CommunityCongrats",
      component: () => import("@/views/CommunityGoals/CongratsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/mycollections",
      name: "MyCollections",
      component: () => import("../views/MyCollectionsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/collections/:id",
      name: "Collection",
      component: () => import("@/views/SingleCollectionView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/posts/:id",
      name: "Post",
      component: () => import("@/views/SinglePostView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
