// router.js
import { createRouter, createWebHistory } from "vue-router";
import FoundPetScreen from "@/view/FoundPetScreen.vue";

const routes = [
  {
    path: "/found",
    name: "found",
    component: FoundPetScreen,
    props: (route) => ({
      id: route.query.id || null, // 👈 pasa el ID como prop
    }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;