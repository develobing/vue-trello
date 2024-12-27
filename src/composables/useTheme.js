import { useStore } from '@/composables/useStore';
import { computed } from 'vue';

export const useTheme = () => {
  const store = useStore();
  const bodyColor = computed(() => store.bodyColor);
  const navbarColor = computed(() => store.navbarColor);

  const updateTheme = () => {
    console.log('🚀 ~ updateTheme ~ bodyColor.value:', bodyColor.value);

    if (bodyColor.value) {
      document.body.style.backgroundColor = bodyColor.value;
    }
    if (navbarColor.value) {
      document.querySelector('.navbar').style.backgroundColor =
        navbarColor.value;
    }
  };

  return {
    updateTheme,
  };
};
