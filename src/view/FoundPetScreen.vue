<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-5 bg-gradient-to-b from-[#FFDB58] to-[#FFC733]">
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl px-5 py-8 sm:px-7 sm:py-10 transform transition-all duration-500">
      <div class="flex flex-col items-center text-center">

        <!-- LOGO + TITULO EN MISMA LINEA -->
        <div class="flex items-center gap-3 sm:gap-4 mb-2">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center border-4 border-[#FF8C00] shadow-lg">
            <svg class="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="#FF8C00">
              <path
                d="M9 21h6v-1H9v1zm1-3h4v-1h-4v1zm2-17C8.13 1 5 4.13 5 8c0 2.38 1.19 4.47 3 5.74V16c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
            </svg>
          </div>

          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight whitespace-nowrap">
            ¡Mascota encontrada!
          </h1>
        </div>

        <!-- LOADING -->
        <div v-if="locationStatus === 'loading'" class="mt-10 flex flex-col items-center">
          <div
            class="h-12 w-12 sm:h-14 sm:w-14 border-4 border-[#FF8C00] border-b-transparent rounded-full animate-spin">
          </div>

          <p class="mt-5 text-base sm:text-lg text-gray-700 font-semibold">
            Buscando tu ubicación…
          </p>

          <p class="mt-2 text-xs sm:text-sm text-gray-500">
            Por favor acepta los permisos de geolocalización.
          </p>
        </div>

        <!-- SUCCESS -->
        <div v-else-if="locationStatus === 'success'" class="mt-8 animate-fadeIn w-full">

          <div class="text-5xl sm:text-6xl mb-4">✅</div>

          <p class="text-lg sm:text-xl font-semibold text-gray-800">
            ¡Gracias por tu ayuda!
          </p>

          <!-- UBICACIÓN + ID AJUSTADO -->
          <p class="flex flex-col gap-3 mt-0 text-sm sm:text-base text-gray-600 leading-relaxed text-center">
            <span class="font-semibold text-gray-800">Ubicación OK:</span>
            <!-- <span class="font-medium">Lat: {{ finderLocation.latitude }}</span>,
            <span class="font-medium">Lon: {{ finderLocation.longitude }}</span> -->
            <span class="font-semibold text-gray-800">Mascota identificada: Akyra</span>
            <!-- <span class="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">
              {{ petId }}
            </span> -->
          </p>

          <!-- CAMPOS -->
          <div class="mt-6 text-left w-full">
            <label class="font-semibold text-gray-700 text-sm sm:text-base">Tu teléfono</label>
            <input v-model="phone" type="tel" placeholder="Ej: 300 123 4567"
              class="w-full mt-1 px-3 py-3 sm:px-4 border rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#FF8C00] outline-none" />

            <label class="mt-4 font-semibold text-gray-700 block text-sm sm:text-base">Nota adicional</label>
            <textarea v-model="note" placeholder="Escribe un mensaje opcional…" rows="3"
              class="w-full mt-1 px-3 py-3 sm:px-4 border rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#FF8C00] outline-none resize-none"></textarea>
          </div>

          <!-- BOTÓN NOTIFICAR -->
          <button @click="notifyOwner"
            class="mt-6 w-full py-3 rounded-lg bg-[#FF8C00] hover:bg-[#e67a00] text-white font-semibold shadow-md transition duration-150 active:scale-95 text-sm sm:text-base">
            Enviar notificación al dueño
          </button>

          <!-- BOTÓN LLAMAR AL DUEÑO -->
          <a :href="`tel:${ownerPhone}`"
            class="mt-3 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition active:scale-95 text-sm sm:text-base flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.47l.72 2.4a2 2 0 01-.46 1.94L8.21 10.8a16 16 0 006 6l1.99-1.21a2 2 0 011.94-.46l2.4.72A2 2 0 0121 18.72V21a2 2 0 01-2 2h-.28C9.4 23 1 14.6 1 4.28V4a2 2 0 012-2z" />
            </svg>
            Llamar al dueño
          </a>

          <p class="mt-4 text-[#FF8C00] font-semibold text-center text-xs sm:text-sm">
            Con la información enviada, el dueño se pondrá en contacto contigo.
          </p>
        </div>

        <!-- PERMISOS DENEGADOS -->
        <div v-else-if="locationStatus === 'denied'" class="mt-8 animate-fadeIn">
          <div class="text-5xl sm:text-6xl mb-4">🔒</div>

          <p class="text-lg sm:text-xl font-semibold text-red-600">
            Permiso de ubicación denegado
          </p>

          <p class="mt-2 text-sm sm:text-base text-gray-600">
            Debes habilitar la ubicación para continuar.
          </p>

          <button @click="requestPermissionAgain"
            class="mt-6 w-full py-3 rounded-lg bg-[#FF8C00] hover:bg-[#e67a00] text-white font-semibold shadow-md transition active:scale-95 text-sm sm:text-base">
            Dar permisos nuevamente
          </button>
        </div>

        <!-- ERROR -->
        <div v-else-if="locationStatus === 'error'" class="mt-8 animate-fadeIn">
          <div class="text-5xl sm:text-6xl mb-4">⚠️</div>

          <p class="text-lg sm:text-xl font-semibold text-red-600">
            No pudimos obtener tu ubicación
          </p>

          <p class="mt-2 text-sm sm:text-base text-gray-600">
            Verifica los permisos y vuelve a intentarlo.
          </p>

          <button @click="requestPermissionAgain"
            class="mt-6 w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold shadow-md transition active:scale-95 text-sm sm:text-base">
            Intentar de nuevo
          </button>
        </div>

        <!-- INVALID ID -->
        <div v-else-if="locationStatus === 'invalid_id'" class="mt-8 animate-fadeIn">
          <div class="text-5xl sm:text-6xl mb-4">🚫</div>

          <p class="text-lg sm:text-xl font-semibold text-red-600">
            URL inválida
          </p>

          <p class="mt-2 text-sm sm:text-base text-gray-600">
            No se encontró un ID de mascota en el enlace.
          </p>
        </div>

        <p class="mt-10 text-[10px] sm:text-xs text-gray-400">
          Buena idea • Sistema de localización
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const route = useRoute();

const petId = ref("");
const locationStatus = ref("loading");
const finderLocation = ref(null);
const phone = ref("");
const note = ref("");

const tempFinderUserId = uuidv4();
const ownerPhone = ref("3001234567");

const getPetIdFromUrl = () => {
  const id = route.query?.id;

  if (!id) {
    locationStatus.value = "invalid_id";
    return null;
  }

  petId.value = id;
  return id;
};

const requestPermissionAgain = () => {
  locationStatus.value = "loading";
  getFinderLocation();
};

const getFinderLocation = () => {
  if (locationStatus.value === "invalid_id") return;

  locationStatus.value = "loading";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      finderLocation.value = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString(),
      };

      locationStatus.value = "success";
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        locationStatus.value = "denied";
      } else {
        locationStatus.value = "error";
      }
    }
  );
};

const notifyOwner = async () => {
  if (!finderLocation.value || !phone.value.trim()) {
    alert("Debes ingresar tu teléfono y permitir la ubicación.");
    return;
  }

  try {
    const { error } = await supabase.from("pet_found_locations").insert({
      pet_id: petId.value,
      finder_pet_user_id: tempFinderUserId,
      latitude: finderLocation.value.latitude,
      longitude: finderLocation.value.longitude,
    });

    if (error) throw error;

    const { error: updateError } = await supabase
      .from("pets")
      .update({
        contact_phone: phone.value,
        finder_note: note.value,
        last_location: JSON.stringify({
          latitude: finderLocation.value.latitude,
          longitude: finderLocation.value.longitude,
          timestamp: finderLocation.value.timestamp,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", petId.value);

    if (updateError) throw updateError;

    alert("Notificación enviada ✓");

  } catch (err) {
    console.error(err);
    alert("Ocurrió un error guardando la información.");
  }
};

onMounted(() => {
  const id = getPetIdFromUrl();
  if (id) getFinderLocation();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap");

body {
  font-family: "Inter", sans-serif;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
</style>