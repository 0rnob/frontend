<script setup>
import { ref, computed } from "vue";
import { items } from "../data/items.js";

// Search and Filter
const search = ref("");
const category = ref("All");

// Filter Items
const filteredItems = computed(() => {
  return items.filter((item) => {
    const keyword = search.value.trim().toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword);

    const matchesCategory =
      category.value === "All" ||
      item.category === category.value;

    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <div class="home-page">

    <!-- HERO SECTION -->
    <section class="hero">
      <div class="container hero-content">

        <span class="hero-tag">
          LOST SOMETHING? FOUND SOMETHING?
        </span>

        <h1>
          Lost it? <span>Find it.</span>
          <br />
          Help others find theirs.
        </h1>

        <p>
          A simple platform to reconnect people with their lost belongings.
          Search, discover and report lost or found items.
        </p>

        <a href="#items" class="primary-btn">
          Explore Items →
        </a>

      </div>
    </section>


    <!-- ITEMS SECTION -->
    <section id="items" class="items-section">
      <div class="container">

        <div class="section-header">
          <span class="section-tag">DISCOVER ITEMS</span>

          <h2>Recently Lost & Found</h2>

          <p>
            Explore recently reported lost and found belongings.
          </p>
        </div>


        <!-- SEARCH AND FILTER -->
        <div class="search-box">

          <input
            type="text"
            placeholder="🔍 Search by item, description or location..."
            v-model="search"
          />

          <select v-model="category">
            <option value="All">All Items</option>
            <option value="Lost">Lost Items</option>
            <option value="Found">Found Items</option>
          </select>

        </div>


        <!-- RESULT COUNT -->
        <div class="result-info">
          <p>
            Showing <strong>{{ filteredItems.length }}</strong>
            {{ filteredItems.length === 1 ? 'item' : 'items' }}
          </p>
        </div>


        <!-- ITEMS GRID -->
        <div class="items-grid">

          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="item-card"
          >

            <!-- IMAGE -->
            <div class="image-wrapper">

              <img
                :src="item.image"
                :alt="item.name"
              />

              <span
                class="status"
                :class="item.category.toLowerCase()"
              >
                {{ item.category }}
              </span>

            </div>


            <!-- CONTENT -->
            <div class="item-content">

              <h3>{{ item.name }}</h3>

              <p class="item-description">
                {{ item.description }}
              </p>

              <div class="item-meta">
                <span>📍 {{ item.location }}</span>
                <span>📅 {{ item.date }}</span>
              </div>

              <button class="details-btn">
                View Details <span>→</span>
              </button>

            </div>

          </div>

        </div>


        <!-- EMPTY STATE -->
        <div
          v-if="filteredItems.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">🔎</div>

          <h3>No items found!</h3>

          <p>
            Try searching with a different keyword or category.
          </p>

          <button
            class="reset-btn"
            @click="search = ''; category = 'All'"
          >
            Clear Filters
          </button>

        </div>

      </div>
    </section>


    <!-- REPORT CTA SECTION -->
    <section class="report-cta">

      <div class="report-cta-content">

        <span class="cta-tag">
          BE A PART OF THE COMMUNITY
        </span>

        <h2>
          Lost Something or Found Something?
        </h2>

        <p>
          Your small action can make a big difference.
          Report a lost or found item and help someone get
          their belongings back.
        </p>

        <div class="cta-buttons">

          <RouterLink to="/report" class="cta-primary">
            Report an Item →
          </RouterLink>

          <RouterLink to="/listing" class="cta-secondary">
            Browse All Items
          </RouterLink>

        </div>

      </div>

    </section>

  </div>
</template>


<style scoped>

/* =========================
   GLOBAL HOME STYLES
========================= */

.home-page {
  width: 100%;
  overflow: hidden;
}

.home-page * {
  box-sizing: border-box;
}


/* =========================
   HERO SECTION
========================= */

.hero {
  width: 100%;
  background: linear-gradient(120deg, #dbeafe, #eff6ff);
  padding: 90px 30px;
  text-align: center;
}

.hero-content {
  max-width: 850px;
  margin: auto;
}

.hero-tag,
.section-tag {
  display: inline-block;
  color: #2563eb;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: clamp(35px, 5vw, 58px);
  line-height: 1.2;
  color: #172033;
  margin-bottom: 25px;
}

.hero h1 span {
  color: #2563eb;
}

.hero p {
  max-width: 650px;
  margin: 0 auto 30px;
  color: #475569;
  font-size: 16px;
  line-height: 1.8;
}

.primary-btn {
  display: inline-block;
  background: #263b60;
  color: white;
  padding: 13px 25px;
  border-radius: 7px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.primary-btn:hover {
  background: #172033;
  transform: translateY(-3px);
}


/* =========================
   ITEMS SECTION
========================= */

.items-section {
  width: 100%;
  padding: 75px 5%;
  background: #f8fafc;
}

.items-section .container {
  max-width: 1200px;
  margin: auto;
}

.section-header {
  text-align: center;
  margin-bottom: 35px;
}

.section-header h2 {
  font-size: 34px;
  color: #172033;
  margin: 0 0 12px;
}

.section-header p {
  color: #64748b;
  font-size: 15px;
}


/* =========================
   SEARCH AND FILTER
========================= */

.search-box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 15px;
  width: 100%;
  margin: 30px 0 20px;
  align-items: center;
}

.search-box input {
  display: block;
  width: 100%;
  height: 50px;
  min-width: 0;
  padding: 0 18px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  background: white;
  color: #172033;
  font-size: 15px;
  box-sizing: border-box;
  transition: 0.3s;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-box select {
  display: block;
  width: 190px;
  height: 50px;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  background: white;
  color: #172033;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;
}

.search-box select:focus {
  border-color: #2563eb;
}


/* =========================
   RESULT INFO
========================= */

.result-info {
  margin-bottom: 20px;
}

.result-info p {
  color: #64748b;
  font-size: 14px;
}

.result-info strong {
  color: #263b60;
}


/* =========================
   ITEMS GRID
========================= */

.items-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 25px;
}


/* =========================
   ITEM CARD
========================= */

.item-card {
  min-width: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
  border-color: #bfdbfe;
}


/* =========================
   ITEM IMAGE
========================= */

.image-wrapper {
  height: 220px;
  position: relative;
  overflow: hidden;
  background: #e2e8f0;
}

.image-wrapper img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.item-card:hover .image-wrapper img {
  transform: scale(1.06);
}


/* =========================
   STATUS BADGE
========================= */

.status {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status.lost {
  background: #fee2e2;
  color: #dc2626;
}

.status.found {
  background: #dcfce7;
  color: #15803d;
}


/* =========================
   ITEM CONTENT
========================= */

.item-content {
  padding: 22px;
}

.item-content h3 {
  font-size: 21px;
  color: #172033;
  margin: 0 0 12px;
}

.item-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
  min-height: 48px;
}


/* =========================
   ITEM META
========================= */

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 22px 0;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 13px;
}


/* =========================
   DETAILS BUTTON
========================= */

.details-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 7px;
  background: #263b60;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.details-btn:hover {
  background: #2563eb;
}

.details-btn span {
  margin-left: 5px;
}


/* =========================
   EMPTY STATE
========================= */

.empty-state {
  text-align: center;
  padding: 55px 20px;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #64748b;
}

.empty-icon {
  font-size: 35px;
  margin-bottom: 15px;
}

.empty-state h3 {
  color: #172033;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 14px;
}

.reset-btn {
  margin-top: 20px;
  padding: 11px 22px;
  border: none;
  border-radius: 7px;
  background: #263b60;
  color: white;
  cursor: pointer;
}

.reset-btn:hover {
  background: #2563eb;
}


/* =========================
   REPORT CTA SECTION
========================= */

.report-cta {
  width: 100%;
  background: linear-gradient(120deg, #172033, #263b60);
  text-align: center;
  padding: 85px 20px;
}

.report-cta-content {
  max-width: 750px;
  margin: auto;
}

.cta-tag {
  display: inline-block;
  color: #93c5fd;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.report-cta h2 {
  font-size: clamp(27px, 4vw, 38px);
  color: white;
  margin: 0 0 18px;
}

.report-cta p {
  color: #cbd5e1;
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 30px;
}


/* =========================
   CTA BUTTONS
========================= */

.cta-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
}

.cta-primary,
.cta-secondary {
  display: inline-block;
  padding: 14px 24px;
  border-radius: 7px;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  transition: 0.3s;
}

.cta-primary {
  background: #3b82f6;
  color: white;
}

.cta-primary:hover {
  background: #2563eb;
  transform: translateY(-3px);
}

.cta-secondary {
  background: transparent;
  border: 1px solid #94a3b8;
  color: white;
}

.cta-secondary:hover {
  background: white;
  color: #172033;
}


/* =========================
   TABLET RESPONSIVE
========================= */

@media (max-width: 900px) {
  .items-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* =========================
   MOBILE RESPONSIVE
========================= */

@media (max-width: 600px) {
  .hero {
    padding: 70px 20px;
  }

  .items-section {
    padding: 55px 20px;
  }

  .section-header h2 {
    font-size: 27px;
  }

  .search-box {
    grid-template-columns: 1fr;
  }

  .search-box input,
  .search-box select {
    width: 100%;
  }

  .items-grid {
    grid-template-columns: 1fr;
  }

  .image-wrapper {
    height: 230px;
  }

  .report-cta {
    padding: 65px 20px;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-buttons a {
    width: 100%;
  }
}

</style>