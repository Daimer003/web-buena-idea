<template>
  <div class="bg-[#FFDB58] min-h-screen flex items-center justify-center p-4">
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden p-6 md:p-8 transform transition duration-500 ease-in-out"
    >
      <div class="flex flex-col items-center text-center">

        <!-- LOGO -->
        <div
          class="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-app-primary shadow-lg p-3"
        >
<svg 
  width="80" 
  height="80" 
  viewBox="0 0 24 24" 
  fill="#FF8C00" 
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M9 21h6v-1H9v1zm1-3h4v-1h-4v1zm2-17C8.13 1 5 4.13 5 8c0 2.38 1.19 4.47 3 5.74V16c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"/>
</svg>
        </div>

        <h1 class="mt-4 text-2xl font-bold text-app-dark">
          ¡Mascota Encontrada!
        </h1>

        <!-- ESTADO LOADING -->
        <div
          v-if="locationStatus === 'loading'"
          class="mt-8 flex flex-col items-center"
        >
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-app-primary"></div>
          <p class="mt-4 text-lg text-app-dark font-medium">
            Estamos buscando tu ubicación...
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Por favor, acepta la solicitud de geolocalización.
          </p>
        </div>

        <!-- ESTADO SUCCESS -->
        <div v-else-if="locationStatus === 'success'" class="mt-8">
          <div class="text-6xl mb-4">✅</div>
          <p class="text-xl font-semibold text-app-dark">¡Gracias por ayudar!</p>
          <p class="mt-2 text-md text-gray-600">
            Se registró la ubicación (Lat: {{ finderLocation.latitude }}, Lon:
            {{ finderLocation.longitude }}) para la mascota:
            <span
              class="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm"
              >{{ petId }}</span
            >.
          </p>
          <p class="mt-4 font-semibold text-app-primary">
            El dueño se pondrá en contacto contigo pronto.
          </p>
        </div>

        <!-- ESTADO ERROR -->
        <div v-else-if="locationStatus === 'error'" class="mt-8">
          <div class="text-6xl mb-4">⚠️</div>
          <p class="text-xl font-semibold text-red-600">
            No pudimos obtener tu ubicación.
          </p>
          <p class="mt-2 text-md text-gray-600">
            Verifica que diste permisos de ubicación.
          </p>
          <p class="mt-4 text-sm text-app-dark">
            Pet ID:
            <span
              class="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm"
              >{{ petId }}</span
            >
          </p>

          <button
            @click="getFinderLocation"
            class="mt-6 w-full py-3 bg-app-dark text-white rounded-lg font-semibold hover:bg-gray-700 transition duration-150 shadow-md"
          >
            Intentar de nuevo
          </button>
        </div>

        <!-- ESTADO INVALID ID -->
        <div v-else-if="locationStatus === 'invalid_id'" class="mt-8">
          <div class="text-6xl mb-4">🚫</div>
          <p class="text-xl font-semibold text-red-600">URL inválida</p>
          <p class="mt-2 text-md text-gray-600">
            No se encontró un ID de mascota en el enlace.
          </p>
        </div>

        <p class="mt-10 text-xs text-gray-400">
          Buena idea - Servicio de localización de mascotas
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const petId = ref("");
const locationStatus = ref("loading");
const finderLocation = ref(null);

// Obtener ID desde la URL
const getPetIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    locationStatus.value = "invalid_id";
    return null;
  }

  petId.value = id;
  return id;
};

// Obtener ubicación
const getFinderLocation = () => {
  if (locationStatus.value === "invalid_id") return;

  locationStatus.value = "loading";

  if (!navigator.geolocation) {
    locationStatus.value = "error";
    return;
  }

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const location = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      finderLocation.value = location;
      sendDataToBackend(location);
    },
    () => {
      locationStatus.value = "error";
    },
    geoOptions
  );
};

// Enviar ubicación al backend (simulado)
const sendDataToBackend = (location) => {
  console.log("Enviando datos al backend:", {
    pet_id: petId.value,
    finder_lat: location.latitude,
    finder_lon: location.longitude,
    time_found: location.timestamp,
  });

  // Simulación
  setTimeout(() => {
    locationStatus.value = "success";
  }, 1500);
};

onMounted(() => {
  const id = getPetIdFromUrl();
  if (id) getFinderLocation();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");

body {
  font-family: "Inter", sans-serif;
}
</style>