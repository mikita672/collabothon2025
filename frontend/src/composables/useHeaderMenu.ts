import { ref } from 'vue';

interface MenuItem {
  title: string;
  icon: string;
  action: () => void;
}

export function useHeaderMenu(onLogout: () => void) {
  const menuItems = ref<MenuItem[]>([
    {
      title: 'Sign Out',
      icon: 'mdi-logout',
      action: onLogout
    }
  ]);

  return {
    menuItems
  };
}
