<template>
  <div class="devicesComponent">
    <div class="container">
      <div class="q-pa-md bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Dispositivos</q-toolbar-title>
          <q-btn color="secondary" @click="addRow">Agregar</q-btn>
        </q-toolbar>
      </div>
      <q-table :rows="devicesData" :columns="columns" row-key="id" class="q-mt-md"
        :rows-per-page-options="[50, 100, 200]">
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
          <div class="text-h6">{{ isEditing ? 'Editar Dispositivo' : 'Agregar Dispositivo' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRow">
            <q-input v-model="form.imei" label="Imei" required class="q-ma-sm" />
            <q-input v-model="form.phoneNumber" label="Número Celular" required class="q-ma-sm" />
            <q-input v-model="form.serialNumber" label="Número de Serie" required class="q-ma-sm" />
            <q-input v-model="form.batteryCapacity" label="Capacidad de batería" required class="q-ma-sm" />
            <q-input v-model="form.updateTime" label="Tiempo de Actualización" required class="q-ma-sm" />

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
import { TDevice } from './models';
import { api } from 'src/boot/axios';

export interface TDeviceInput {
  _id: string;
  imei: number;
  phoneNumber: string;
  serialNumber: string;
  registeredAt: Date;
  lastUpdateAt: Date;
  batteryCapacity: number;
  updateTime: number;
}

const devicesData = ref<TDevice[]>([]);

const columns = ref([
  { name: 'imei', label: 'Imei', field: 'imei' },
  { name: 'phoneNumber', label: 'Número Celular', field: 'phoneNumber' },
  { name: 'serialNumber', label: 'Número de Serie', field: 'serialNumber' },
  { name: 'batteryCapacity', label: 'Capacidad de Batería', field: 'batteryCapacity' },
  { name: 'updateTime', label: 'Tiempo de Actualización', field: 'updateTime' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]);

const showDialog = ref(false);
const isEditing = ref(false);
const form = ref<TDeviceInput>({
  _id: '',
  imei: 0,
  phoneNumber: '',
  serialNumber: '',
  registeredAt: new Date(),
  lastUpdateAt: new Date(),
  batteryCapacity: 0,
  updateTime: 0,
});

const addRow = () => {
  isEditing.value = false;
  form.value = {
    _id: '',
    imei: 0,
    phoneNumber: '',
    serialNumber: '',
    registeredAt: new Date(),
    lastUpdateAt: new Date(),
    batteryCapacity: 0,
    updateTime: 0,
  };
  showDialog.value = true;
};

const editRow = (row: TDevice) => {
  isEditing.value = true;
  form.value = { ...row, _id: row._id, registeredAt: new Date(), lastUpdateAt: new Date() };
  showDialog.value = true;
};

const deleteRow = (form: TDeviceInput) => {
  api.delete(`/device/${form._id}`).then(() => {
    loadDevices();
  }).catch((error) => {
    console.error('Error deleting device:', error);
  });
};

const saveRow = () => {
  if (isEditing.value) {
    // Update existing device
    api.put('/device', form.value).then(() => {
      loadDevices();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error updating device:', error);
    });
  } else {
    // Add new device

    api.post('/device', (({ _id, ...rest }) => rest)(form.value)).then((response) => {
      loadDevices();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error adding device:', error);
    });
  }
};

const loadDevices = () => {
  api.get('/device').then((response) => {
    devicesData.value = response.data.devices as TDevice[];
  }).catch(() => {
    console.log('Error loading devices');
  });
};

onMounted(() => {
  loadDevices();
});


</script>


<script lang='ts'>
export default {
  name: 'DevicesComponent',
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
