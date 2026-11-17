<template>
  <div class="page-wrapper">
   
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="nav-brand">VU Lost & Found</a>

      
        <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
          ☰
        </button>

        <ul :class="['nav-links', { active: isMenuOpen }]">
          <li><a href="#">Home</a></li>
          <li><a href="#">Lost Items</a></li>
          <li><a href="#">Found Items</a></li>
          <li><a href="#" class="active-link">Report Item</a></li>
        </ul>
      </div>
    </nav>
   

    
    <div class="report-container">
      <h1>Report Lost or Found Item</h1>
      <p class="subtitle">
        Help us return lost items to their owners.
      </p>

      <form @submit.prevent="submitReport">
        <label>Report Type</label>

        <div class="radio-group">
          <label>
            <input
              type="radio"
              value="Lost"
              v-model="form.type"
            />
            Lost Item
          </label>

          <label>
            <input
              type="radio"
              value="Found"
              v-model="form.type"
            />
            Found Item
          </label>
        </div>

        <label>Student Name</label>
        <input
          type="text"
          v-model="form.name"
          placeholder="Enter your name"
          required
        />

        <label>Phone Number</label>
        <input
          type="tel"
          v-model="form.phone"
          placeholder="Enter phone number"
          required
        />

        <label>Item Name</label>
        <input
          type="text"
          v-model="form.itemName"
          placeholder="e.g. Mobile, Wallet, ID Card"
          required
        />

        <label>Description</label>
        <textarea
          v-model="form.description"
          placeholder="Describe the item..."
          required
        ></textarea>

        <label>Upload Item Image</label>
        <input
          type="file"
          accept="image/*"
          @change="uploadImage"
        />

        <img
          v-if="imagePreview"
          :src="imagePreview"
          class="preview"
          alt="Item preview"
        />

        <label>Location</label>
        <input
          type="text"
          v-model="form.location"
          :placeholder="form.type === 'Lost'
            ? 'Where did you lose it?'
            : 'Where did you find it?'"
          required
        />

        <label>Date</label>
        <input
          type="date"
          v-model="form.date"
          required
        />

        <label>Time</label>
        <input
          type="time"
          v-model="form.time"
          required
        />

        <button type="submit" class="submit-btn">
          Submit Report
        </button>
      </form>

      <p v-if="successMessage" class="success">
        {{ successMessage }}
      </p>
    </div>
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
