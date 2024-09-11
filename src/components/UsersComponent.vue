<template>
  <div class="usersComponent">
    <div class="container">
      <div class="q-pa-md bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Usuarios</q-toolbar-title>
          <q-btn color="secondary" @click="addRow">Agregar</q-btn>
        </q-toolbar>

      </div>
      <q-table :rows="usersData" :columns="columns" row-key="id" class="q-mt-md">
        <template v-slot:body-cell-actions="props">
          <td class="text-right">
            <q-btn flat icon="edit" @click="editRow(props.row)" />
            <q-btn flat icon="delete" color="negative" @click="deleteRow(props.row)" />
          </td>
        </template>
      </q-table>
      <!-- <div class="q-pa-md bg-grey-2">
        <q-btn color="primary" @click="performAction">Footer Action</q-btn>
      </div> -->
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-lg" style="max-width: 80vw; max-height: 80vh;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Usuario' : 'Agregar Usuario' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRow">
            <q-input v-model="form.name" label="Nombre" required class="q-ma-sm" />
            <q-input v-model="form.lastname" label="Apellido" required class="q-ma-sm" />
            <q-input v-model="form.email" label="Correo" type="email" required class="q-ma-sm" />
            <q-input v-model="form.emailConfirmation" label="Confirmar correo" type="email" required class="q-ma-sm" />

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" @click="showDialog = false" />
              <q-btn color="primary" label="Guardar" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TUser } from './models';
import { api } from 'src/boot/axios';

export interface TUserInput {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  emailConfirmation: string;
  userType: number;
  passwordReset: boolean;
  createdAt: Date;
  password?: string;
}

const usersData = ref<TUser[]>([]);

const columns = ref([
  { name: 'name', label: 'Nombre', field: 'name' },
  { name: 'lastname', label: 'Apellido', field: 'lastname' },
  { name: 'email', label: 'Correo', field: 'email' },
  // { name: 'createdAt', label: 'Fecha de Creación', field: 'createdAt' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]);

const showDialog = ref(false);
const isEditing = ref(false);
const form = ref<TUserInput>({ _id: '', name: '', lastname: '', email: '', emailConfirmation: '', userType: 1, passwordReset: true, createdAt: new Date(), password: 'Default123' });

const addRow = () => {
  isEditing.value = false;
  form.value = { _id: '', name: '', lastname: '', email: '', emailConfirmation: '', userType: 1, passwordReset: true, createdAt: new Date(), password: 'Default123' };
  showDialog.value = true;
};

const editRow = (row: TUser) => {
  isEditing.value = true;
  form.value = { ...row, _id: row._id, emailConfirmation: row.email, createdAt: new Date() };
  showDialog.value = true;
};

const deleteRow = (form: TUserInput) => {
  api.delete(`/user/${form._id}`).then(() => {
    loadUsers();
  }).catch((error) => {
    console.error('Error deleting user:', error);
  });
};

const saveRow = () => {
  if (isEditing.value) {
    // Update existing user
    api.put('/user', form.value).then(() => {
      loadUsers();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error updating user:', error);
    });
  } else {
    // Add new user

    api.post('/user', (({ _id, ...rest }) => rest)(form.value)).then((response) => {
      loadUsers();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error adding user:', error);
    });
  }
};

const loadUsers = () => {
  api.get('/user/getAdmins').then((response) => {
    usersData.value = response.data.users as TUser[];
  }).catch(() => {
    console.log('Error loading users');
  });
};

onMounted(() => {
  loadUsers();
});


</script>


<script lang='ts'>
export default {
  name: 'UsersComponent',
  inheritAttrs: false,
  customOptions: {}
}
</script>

<style scoped>
.q-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-table {
  flex: 1;
}

.q-toolbar-title {
  flex: 1;
}
</style>
