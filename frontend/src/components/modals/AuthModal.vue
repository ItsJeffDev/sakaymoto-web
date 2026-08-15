<script setup>
import { onMounted, onUnmounted, reactive } from 'vue'
import { X } from 'lucide-vue-next'
import { useModalStore } from '../../stores/modal'

const modal = useModalStore()

const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ name: '', email: '', password: '' })

function handleLogin() {
  // Wire this up to your auth API (POST /api/auth/login).
  console.log('login submit', { ...loginForm })
}

function handleRegister() {
  // Wire this up to your auth API (POST /api/auth/register).
  console.log('register submit', { ...registerForm })
}

function onKeydown(e) {
  if (e.key === 'Escape') modal.close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="modal-overlay" :class="{ open: modal.isOpen }" @click.self="modal.close()">
    <div class="modal-box">
      <button class="modal-close" aria-label="Close" @click="modal.close()">
        <X :size="16" />
      </button>

      <div class="modal-tabs">
        <button :class="{ active: modal.activeTab === 'login' }" @click="modal.setTab('login')">
          Log In
        </button>
        <button
          :class="{ active: modal.activeTab === 'register' }"
          @click="modal.setTab('register')"
        >
          Register
        </button>
      </div>

      <div class="form-panel" :class="{ active: modal.activeTab === 'login' }">
        <h3>Welcome back</h3>
        <p class="sub">Log in to manage your bookings and rental history.</p>
        <form @submit.prevent="handleLogin">
          <div class="field">
            <label for="login-email">Email</label>
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              placeholder="you@email.com"
            />
          </div>
          <div class="field">
            <label for="login-password">Password</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <button class="btn btn-primary btn-block" type="submit">Log In</button>
        </form>
        <p class="modal-note">
          No account yet? <a href="#" @click.prevent="modal.setTab('register')">Register here</a>
        </p>
      </div>

      <div class="form-panel" :class="{ active: modal.activeTab === 'register' }">
        <h3>Create your account</h3>
        <p class="sub">One profile for every future rental.</p>
        <form @submit.prevent="handleRegister">
          <div class="field">
            <label for="reg-name">Full Name</label>
            <input
              id="reg-name"
              v-model="registerForm.name"
              type="text"
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div class="field">
            <label for="reg-email">Email</label>
            <input
              id="reg-email"
              v-model="registerForm.email"
              type="email"
              placeholder="you@email.com"
            />
          </div>
          <div class="field">
            <label for="reg-password">Password</label>
            <input
              id="reg-password"
              v-model="registerForm.password"
              type="password"
              placeholder="Create a password"
            />
          </div>
          <button class="btn btn-primary btn-block" type="submit">Create Account</button>
        </form>
        <p class="modal-note">
          Already registered? <a href="#" @click.prevent="modal.setTab('login')">Log in</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 27, 54, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}
.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
.modal-box {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  padding: 36px;
  position: relative;
  transform: translateY(14px) scale(0.98);
  transition: transform 0.25s;
  box-shadow: var(--shadow);
}
.modal-overlay.open .modal-box {
  transform: translateY(0) scale(1);
}
.modal-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-soft);
}
.modal-tabs {
  display: flex;
  gap: 6px;
  background: var(--bg);
  padding: 5px;
  border-radius: 11px;
  margin-bottom: 26px;
}
.modal-tabs button {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-family: var(--ff-display);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--ink-soft);
  transition: all 0.2s;
}
.modal-tabs button.active {
  background: #fff;
  color: var(--navy);
  box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.15);
}
.modal-box h3 {
  font-size: 1.3rem;
  margin-bottom: 6px;
}
.modal-box .sub {
  color: var(--ink-soft);
  font-size: 0.86rem;
  margin-bottom: 24px;
}
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 0.82rem;
  font-family: var(--ff-display);
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 7px;
}
.field input {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--line);
  border-radius: 10px;
  font-family: var(--ff-body);
  font-size: 0.9rem;
  transition: border-color 0.2s;
  background: #fff;
}
.field input:focus {
  outline: none;
  border-color: var(--blue);
}
.modal-note {
  text-align: center;
  font-size: 0.82rem;
  color: var(--ink-soft);
  margin-top: 18px;
}
.modal-note a {
  color: var(--blue);
  font-weight: 600;
}
.form-panel {
  display: none;
}
.form-panel.active {
  display: block;
}

@media (max-width: 480px) {
  .modal-box {
    padding: 26px 22px;
    border-radius: 16px;
  }
  .modal-box h3 {
    font-size: 1.15rem;
  }
}
</style>
