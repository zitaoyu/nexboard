import { beforeEach, afterEach } from 'vitest'

// Clear localStorage before and after each test so Zustand persist
// rehydration doesn't bleed across tests.
beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})
