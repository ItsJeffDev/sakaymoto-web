import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const activeTab = ref('login')

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function setTab(tab) {
    activeTab.value = tab
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  return { isOpen, activeTab, open, close, setTab, toggle }
})
