<template>
  <q-layout view="hHh lpR fFf" class="bg-gradient">
    <q-page-container>
      <q-page padding class="q-pa-md flex flex-center">
        <q-card class="q-pa-md login-card">
          <q-card-section class="text-center">
            <div class="text-h5">Consola de Administración</div>
            <q-avatar size="320px">
              <img src="~assets/serenaLogo.png" alt="Sistema Logo" class="logo">
            </q-avatar>
            <div class="text-subtitle2">Inicie sesión para continuar</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit">
              <q-input v-model="username" label="Nombre de usuario" filled dense
                :rules="[val => !!val || 'El nombre de usuario es requerido']" class="q-mb-md" />
              <q-input v-model="password" type="password" label="Contraseña" filled dense
                :rules="[val => !!val || 'La contraseña es requerida']" class="q-mb-md" />
              <q-btn type="submit" label="Iniciar Sesión" color="primary" size="lg" class="full-width q-mt-md" />
            </q-form>
          </q-card-section>

          <q-card-actions align="center" class="q-mt-lg">
            <q-btn flat label="¿Olvidaste tu contraseña?" color="primary" />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { TUser } from 'src/components/models';


const router = useRouter()

const $q = useQuasar();
const username = ref('');
const password = ref('');

const authStore = useAuthStore();



const onSubmit = () => {
  if (username.value && password.value) {

    api.post('/auth/admin-login', {
      'userEmail': username.value,
      'inputPassword': password.value
    })
      .then((response) => {
        //fileExplorerData.value = response.data.codefiles


        console.log(response.data)

        //const responseData = response.data

        authStore.setJWT(response.data.access_token)
        authStore.setLogin(true)
        router.push('/')

      })
      .catch(() => {
        console.log('error')
      })


  } else {
    $q.notify({
      type: 'negative',
      message: 'Por favor, complete el formulario correctamente',
    });
  }
};


</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(to right, #452ea6, #452ea6);
  height: 100vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.full-width {
  width: 100%;
}

.logo {
  max-width: 100%;
  height: auto;
}

@media (max-width: 600px) {
  .login-card {
    padding: 16px;
  }
}
</style>
