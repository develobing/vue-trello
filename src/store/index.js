import { createPinia } from 'pinia';

const pinia = createPinia();

const { accessToken } = localStorage;

// Optionally, initialize the state with `accessToken`
pinia.use(({ store }) => {
  if (store.$id === 'main' && accessToken) {
    store.LOGIN_WITH_TOKEN(accessToken);
  }
});

export default pinia;
