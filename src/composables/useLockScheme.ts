
import { ref } from 'vue';


const isLockDown = ref(false)

export function useLockScheme() {
  const handleChangeStateLockScheme = (state: boolean) => {
    isLockDown.value = state
  }

  const getStateLockScheme = () => isLockDown.value

  return {
    getStateLockScheme,
    handleChangeStateLockScheme
  }
}