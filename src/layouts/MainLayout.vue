<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Consola de Administración del sistema SERENA
        </q-toolbar-title>

        <!-- <q-btn flat dense icon-right="account_circle" label="Iniciar Sesión" aria-label="Iniciar sesión" class="q-mx-md"
          @click="iniciarSesion" /> -->

        <q-btn flat dense icon-right="account_circle" label="Cerrar Sesión" aria-label="Iniciar sesión" class="q-mx-md"
          @click="cerrarSesion" />

        <!-- Botón de notificaciones -->
        <!-- <q-btn flat dense icon-right="notifications" label="Notificaciones" aria-label="Notificaciones" class="q-mx-md"
          @click="mostrarNotificaciones">
          <q-badge floating color="red" rounded label="3" />
        </q-btn> -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Opciones
        </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';


const router = useRouter()
const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Cuidadores',
    caption: 'Permite administrar los usuarios cuidadores registrados',
    icon: 'person',
    link: '/caregivers'
  },
  {
    title: 'Afectados',
    caption: 'Permite administrar los usuarios afectados registrados',
    icon: 'record_voice_over',
    link: '/patients'
  },
  {
    title: 'Dispositivos',
    caption: 'Permite la administración de los dispositivos asociados al sistema',
    icon: 'watch',
    link: '/devices'
  },
  {
    title: 'Administradores',
    caption: 'Configuración de los usuarios del sistema',
    icon: 'manage_accounts',
    link: '/admins'
  },
  {
    title: 'Opciones',
    caption: 'Permite configurar opciones generales del sistema',
    icon: 'settings',
    link: '/options'
  }
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

//Methods

const cerrarSesion = () => {
  console.log('cerrar sesion')
  useAuthStore().logout()
  router.push('/login');
}
// const mostrarNotificaciones = () => {
//   console.log('mostrar notificaciones')
// }

</script>
