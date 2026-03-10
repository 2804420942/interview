import { ref, watch } from 'vue'

const isDark = ref(false)

// Initialize from localStorage or default to light
const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null
if (savedTheme === 'dark') {
  isDark.value = true
  document.documentElement.classList.add('dark')
} else {
  isDark.value = false
  document.documentElement.classList.remove('dark')
}

watch(isDark, (val) => {
  if (val) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
})

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme,
  }
}
