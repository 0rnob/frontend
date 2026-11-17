<template>
  <div class="website">

    <!-- HEADER -->
    <header class="header">

      <div class="logo">
        Lost&Found
      </div>

      <nav class="navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/listing">Listing</RouterLink>
        <RouterLink to="/report">Report</RouterLink>
        <RouterLink to="/track-claim">Track Claim</RouterLink>
      </nav>

      <RouterLink to="/login" class="login-btn">
        Login
      </RouterLink>

    </header>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <p>© 2026 My Website. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const isMenuOpen = ref(false)

const form = reactive({
  type: 'Lost',
  name: '',
  phone: '',
  itemName: '',
  description: '',
  location: '',
  date: '',
  time: ''
})

const imageFile = ref(null)
const imagePreview = ref('')
const successMessage = ref('')

function uploadImage(event) {
  const file = event.target.files[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.')
    event.target.value = ''
    return
  }

  imageFile.value = file

  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }

  imagePreview.value = URL.createObjectURL(file)
}

function submitReport() {
  console.log('Report Information:', {
    ...form,
    image: imageFile.value
  })

  successMessage.value =
    'Your report has been submitted successfully!'

  console.log('Report Submitted!')
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: Arial, sans-serif;
  padding-bottom: 40px;
}

.navbar {
  background-color: #183b64;
  color: white;
  padding: 14px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.nav-brand {
  color: white;
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
  letter-spacing: 0.5px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 24px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: #e0e6ed;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 5px;
  transition: background 0.2s, color 0.2s;
}

.nav-links a:hover,
.nav-links a.active-link {
  background-color: #24558b;
  color: white;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    margin-top: 14px;
  }

  .nav-links.active {
    display: flex;
  }
}

.report-container {
  max-width: 650px;
  margin: 40px auto 0;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #183b64;
  margin-top: 0;
}

.subtitle {
  text-align: center;
  color: #777;
  margin-bottom: 25px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: bold;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 15px;
}

textarea {
  height: 100px;
  resize: vertical;
}

.radio-group {
  display: flex;
  gap: 30px;
  margin-bottom: 10px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.radio-group input {
  width: auto;
}

.preview {
  width: 150px;
  margin-top: 10px;
  border-radius: 8px;
}

.submit-btn {
  background: #183b64;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
}

.submit-btn:hover {
  background: #24558b;
}

.success {
  color: green;
  text-align: center;
  font-weight: bold;
  margin-top: 15px;
}
</style>
