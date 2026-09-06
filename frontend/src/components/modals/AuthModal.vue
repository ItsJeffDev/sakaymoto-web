<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound, X } from 'lucide-vue-next'
import { useModalStore } from '../../stores/modal'

const modal = useModalStore()
const loginForm = reactive({ email: '', password: '' })
const registerForm = reactive({ name: '', email: '', password: '' })
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

function handleLogin() {
  console.log('login submit', { ...loginForm })
}

function handleRegister() {
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
    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <aside class="auth-aside">
        <button class="modal-close aside-close" aria-label="Close" @click="modal.close()"><X :size="17" /></button>
        <a href="#home" class="auth-brand" @click="modal.close()">Sakay<span>Moto</span></a>
        <div class="aside-copy">
          <p class="aside-kicker">Your next ride starts here</p>
          <h2>Move freely.<br /><em>Go further.</em></h2>
          <p>Book trusted motorcycles from local owners and make every trip feel like your own.</p>
        </div>
        <ul class="aside-list">
          <li><span><Check :size="14" /></span>Verified motorcycles</li>
          <li><span><Check :size="14" /></span>Flexible daily rentals</li>
          <li><span><Check :size="14" /></span>Support when you need it</li>
        </ul>
        <div class="aside-footer"><strong>4.9/5</strong><span>from riders across the Philippines</span></div>
      </aside>

      <section class="auth-content">
        <button class="modal-close content-close" aria-label="Close" @click="modal.close()"><X :size="16" /></button>
        <div class="modal-tabs">
          <button :class="{ active: modal.activeTab === 'login' }" @click="modal.setTab('login')">Log In</button>
          <button :class="{ active: modal.activeTab === 'register' }" @click="modal.setTab('register')">Register</button>
        </div>

        <div v-if="modal.activeTab === 'login'" class="form-panel active">
          <p class="form-kicker">Rider access</p>
          <h1 id="auth-title">Welcome back</h1>
          <p class="sub">Log in to manage your bookings and rental history.</p>
          <form @submit.prevent="handleLogin">
            <div class="field"><label for="login-email">Email address</label><div class="input-wrap"><Mail :size="17" /><input id="login-email" v-model="loginForm.email" type="email" placeholder="you@email.com" required /></div></div>
            <div class="field"><label for="login-password">Password</label><div class="input-wrap"><LockKeyhole :size="17" /><input id="login-password" v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" placeholder="Enter your password" required /><button type="button" class="password-toggle" aria-label="Toggle password visibility" @click="showLoginPassword = !showLoginPassword"><EyeOff v-if="showLoginPassword" :size="17" /><Eye v-else :size="17" /></button></div></div>
            <div class="form-options"><label class="check-label"><input type="checkbox" /> <span>Remember me</span></label><a href="#">Forgot password?</a></div>
            <button class="btn btn-primary btn-block" type="submit">Log In <ArrowRight :size="17" /></button>
          </form>
          <p class="modal-note">No account yet? <a href="#" @click.prevent="modal.setTab('register')">Register here</a></p>
        </div>

        <div v-else class="form-panel active">
          <p class="form-kicker">Start riding</p>
          <h1 id="auth-title">Create your account</h1>
          <p class="sub">One profile for every future rental.</p>
          <form @submit.prevent="handleRegister">
            <div class="field"><label for="reg-name">Full name</label><div class="input-wrap"><UserRound :size="17" /><input id="reg-name" v-model="registerForm.name" type="text" placeholder="Juan Dela Cruz" required /></div></div>
            <div class="field"><label for="reg-email">Email address</label><div class="input-wrap"><Mail :size="17" /><input id="reg-email" v-model="registerForm.email" type="email" placeholder="you@email.com" required /></div></div>
            <div class="field"><label for="reg-password">Password</label><div class="input-wrap"><LockKeyhole :size="17" /><input id="reg-password" v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="Create a password" required minlength="8" /><button type="button" class="password-toggle" aria-label="Toggle password visibility" @click="showRegisterPassword = !showRegisterPassword"><EyeOff v-if="showRegisterPassword" :size="17" /><Eye v-else :size="17" /></button></div></div>
            <p class="terms">By creating an account, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
            <button class="btn btn-primary btn-block" type="submit">Create Account <ArrowRight :size="17" /></button>
          </form>
          <p class="modal-note">Already registered? <a href="#" @click.prevent="modal.setTab('login')">Log in</a></p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(8, 27, 54, 0.62); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; z-index: 2000; opacity: 0; pointer-events: none; transition: opacity 0.25s; }
.modal-overlay.open { opacity: 1; pointer-events: auto; }
.modal-box { background: #fff; border-radius: 22px; width: 100%; max-width: 820px; min-height: 540px; position: relative; transform: translateY(14px) scale(0.98); transition: transform 0.25s; box-shadow: 0 28px 80px -28px rgba(8, 27, 54, 0.46); display: grid; grid-template-columns: 38% 62%; overflow: hidden; }
.modal-overlay.open .modal-box { transform: translateY(0) scale(1); }
.modal-close { position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border-radius: 9px; background: var(--bg); display: flex; align-items: center; justify-content: center; color: var(--ink-soft); transition: background 0.2s, color 0.2s; z-index: 2; }
.modal-close:hover { background: var(--blue-soft); color: var(--blue); }
.auth-aside { background: var(--navy-deep); color: #fff; padding: 38px 34px 30px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
.auth-aside::after { content: ''; position: absolute; width: 230px; height: 230px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 50%; right: -100px; bottom: 52px; box-shadow: 0 0 0 28px rgba(255, 255, 255, 0.03), 0 0 0 58px rgba(255, 255, 255, 0.025); }
.auth-brand { font-family: var(--ff-display); font-size: 1.25rem; font-weight: 800; position: relative; z-index: 1; }.auth-brand span { color: var(--orange); }
.aside-copy { margin: auto 0 32px; position: relative; z-index: 1; }.aside-kicker, .form-kicker { color: var(--orange); text-transform: uppercase; letter-spacing: 0.14em; font: 600 0.68rem var(--ff-display); margin-bottom: 14px; }.aside-copy h2 { color: #fff; font-size: clamp(1.8rem, 3vw, 2.35rem); margin-bottom: 16px; }.aside-copy h2 em { color: #f6b39c; font-style: normal; }.aside-copy > p:last-child { color: rgba(255, 255, 255, 0.68); font-size: 0.88rem; line-height: 1.7; }
.aside-list { display: grid; gap: 12px; position: relative; z-index: 1; }.aside-list li { display: flex; align-items: center; gap: 10px; color: rgba(255, 255, 255, 0.84); font-size: 0.79rem; }.aside-list li span { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 50%; background: rgba(255, 106, 61, 0.18); color: var(--orange); }.aside-footer { display: flex; align-items: baseline; gap: 8px; border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 22px; margin-top: 28px; position: relative; z-index: 1; }.aside-footer strong { font: 700 1rem var(--ff-display); }.aside-footer span { color: rgba(255, 255, 255, 0.5); font-size: 0.68rem; }.aside-close { display: none; }
.auth-content { padding: 46px 58px 38px; position: relative; }.modal-tabs { display: flex; gap: 6px; background: var(--bg); padding: 5px; border-radius: 11px; margin-bottom: 30px; max-width: 290px; }.modal-tabs button { flex: 1; padding: 10px; border-radius: 8px; font-family: var(--ff-display); font-weight: 600; font-size: 0.85rem; color: var(--ink-soft); transition: all 0.2s; }.modal-tabs button.active { background: #fff; color: var(--navy); box-shadow: 0 4px 10px -4px rgba(0, 0, 0, 0.15); }
.form-panel { max-width: 400px; animation: form-in 0.25s ease both; }.form-kicker { margin-bottom: 8px; }.auth-content h1 { font-size: 1.8rem; margin-bottom: 7px; }.sub { color: var(--ink-soft); font-size: 0.86rem; margin-bottom: 24px; }.field { margin-bottom: 16px; }.field label { display: block; font-size: 0.82rem; font-family: var(--ff-display); font-weight: 600; color: var(--navy); margin-bottom: 7px; }.input-wrap { display: flex; align-items: center; gap: 10px; border: 1.5px solid var(--line); border-radius: 10px; padding-left: 13px; color: #9aa4b4; transition: border-color 0.2s, box-shadow 0.2s; }.input-wrap:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.1); color: var(--blue); }.field input { width: 100%; padding: 12px 12px 12px 0; border: 0; font-family: var(--ff-body); font-size: 0.9rem; background: transparent; }.field input:focus { outline: none; }.password-toggle { color: #9aa4b4; padding: 10px 13px 10px 4px; }.form-options { display: flex; justify-content: space-between; align-items: center; margin: -2px 0 23px; font-size: 0.74rem; color: var(--ink-soft); }.form-options a, .terms a, .modal-note a { color: var(--blue); font-weight: 600; }.check-label { display: flex; align-items: center; gap: 6px; }.check-label input { accent-color: var(--blue); }.terms { color: var(--ink-soft); font-size: 0.7rem; line-height: 1.5; margin: -2px 0 20px; }.modal-note { text-align: center; font-size: 0.82rem; color: var(--ink-soft); margin-top: 22px; }.modal-box .btn { gap: 10px; }.modal-box .btn svg { transition: transform 0.2s; }.modal-box .btn:hover svg { transform: translateX(3px); }
@keyframes form-in { from { opacity: 0; transform: translateX(5px); } to { opacity: 1; transform: translateX(0); } }
@media (max-width: 700px) { .modal-box { grid-template-columns: 1fr; max-width: 460px; min-height: 0; max-height: calc(100dvh - 30px); overflow-y: auto; }.auth-aside { min-height: 190px; padding: 27px 25px 24px; }.aside-copy { margin: 34px 0 0; }.aside-copy h2 { font-size: 1.65rem; }.aside-copy > p:last-child, .aside-list, .aside-footer { display: none; }.content-close { display: none; }.aside-close { display: flex; }.auth-content { padding: 28px 25px 30px; }.modal-tabs { margin-bottom: 25px; } }
@media (min-width: 701px) { .content-close { display: flex; } }
@media (max-width: 480px) { .modal-box { border-radius: 16px; }.auth-content h1 { font-size: 1.5rem; } }
</style>
