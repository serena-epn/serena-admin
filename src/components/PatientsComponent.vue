<template>
  <div class="patientsComponent">
    <div class="container">
      <div class="q-pa-md bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Afectados</q-toolbar-title>
          <q-btn color="secondary" @click="addRow">Agregar</q-btn>
        </q-toolbar>

      </div>
      <q-table :rows="patientsData" :columns="columns" row-key="id" class="q-mt-md"
        :rows-per-page-options="[50, 100, 200]">
        <template v-slot:header-cell-actions="props">
          <q-th class="text-center thead th td tr">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:header-cell-devices="props">
          <q-th class="text-center">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:header-cell-zones="props">
          <q-th class="text-center">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:body-cell-devices="props">
          <q-td class="text-center">
            <q-btn flat icon="add" color="positive" @click="linkDevice(props.row)" v-if="props.row.device == null" />
            <q-btn flat icon="remove" color="negative" @click="unlinkDevice(props.row)" v-else />
          </q-td>
        </template>
        <template v-slot:body-cell-zones="props">
          <q-td class="text-center">
            <q-btn flat icon="add" color="positive" @click="addZone(props.row)" v-if="props.row.zone == null" />
            <q-btn flat icon="edit" color="negative" @click="editZone(props.row)" v-else />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn flat icon="edit" @click="editRow(props.row)" />
            <q-btn flat icon="delete" color="negative" @click="deleteRow(props.row)" />
          </q-td>
        </template>
      </q-table>
      <!-- <div class="q-pa-md bg-grey-2">
        <q-btn color="primary" @click="performAction">Footer Action</q-btn>
      </div> -->
    </div>

    <q-dialog v-model="showDialog">
      <q-card class="q-pa-lg" style="max-width: 80vw; max-height: 80vh;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar Afectado' : 'Agregar Afectado' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRow">
            <q-input v-model="form.name" label="Nombre" required class="q-ma-sm" />
            <q-input v-model="form.lastname" label="Apellido" required class="q-ma-sm" />
            <q-input v-model="form.birthdate" label="Fecha Nacimiento" required class="q-ma-sm" />
            <q-input v-model="form.contactInfo" label="Información de Contacto" required class="q-ma-sm" />
            <q-input v-model="form.idNumber" label="Cédula" required class="q-ma-sm" />
            <q-card-actions align="right">
              <q-btn label="Cancelar" @click="showDialog = false" />
              <q-btn color="primary" label="Guardar" type="submit" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showSetSecureZone">
      <q-card class="q-pa-lg" style="min-width: 750px; min-height: 750px;">
        <q-card-section>
          <div class="text-h6">{{ isEditingZone ? 'Editar Zona Segura' : 'Establecer Zona Segura' }}</div>
        </q-card-section>
        <q-card-section>

          <ol-map ref="map" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true"
            style="height: 650px; width: 650px;">

            <ol-view :center="center" :zoom="zoom" :projection="projection" ref="view" />

            <ol-tile-layer>
              <ol-source-osm />
            </ol-tile-layer>

            <ol-context-menu-control :items="contextMenuItems" @beforeopen="log('beforeopen', $event)"
              @open="log('open', $event)" @close="log('close', $event)"
              @add-menu-entry="log('add-menu-entry', $event)" />

            <ol-vector-layer>
              <ol-source-vector ref="markers"> </ol-source-vector>
              <ol-style>
                <ol-style-icon :scale="1" style="background-color: #FFFFFF00;">
                  <span class="marker">📍</span>
                </ol-style-icon>

              </ol-style>
            </ol-vector-layer>

            <ol-vector-layer v-if="markersLength > 0">
              <ol-source-vector>
                <ol-feature>
                  <ol-geom-circle :center="circleCenter" :radius="0.01"></ol-geom-circle>
                  <ol-style>
                    <ol-style-stroke color="red" :width="3"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,200,0,0.2)"></ol-style-fill>
                  </ol-style>
                </ol-feature>
              </ol-source-vector>
            </ol-vector-layer>

          </ol-map>

        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" @click="showSetSecureZone = false" />
          <q-btn color="positive" label="Guardar" @click="saveZone" />

        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showLinkDialog">
      <q-card class="q-pa-lg">
        <q-card-section>
          <div class="text-h6">{{ !isUnlinking ? 'Enlazar Dispositivo' : 'Desenlazar Dispositivo' }}</div>
          <p><b>Paciente:</b> {{ selectedPatient?.name }} {{ selectedPatient?.lastname }}</p>
          <p><b>Cédula:</b> {{ selectedPatient?.idNumber }}</p>

        </q-card-section>

        <q-card-section>
          <q-form @submit="saveLinkDevice">
            <q-select filled v-model="model" use-input hide-selected fill-input :input-value="inputValue"
              input-debounce="0" @input-value="(value) => updateInputValue(value)" :label="'Buscar'"
              @update:model-value="(value) => selectDevice(value)" @filter="filterFn" :options="devicesSelectData"
              v-if="!isUnlinking">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :key="scope.index">
                  <q-item-section class="item-border">
                    <div class="item__device">
                      <p><b>Imei:</b>{{ scope.opt.imei }}</p>
                      <p><b>Celular:</b>{{ scope.opt.phoneNumber }}</p>
                      <p><b>Número de serie:</b>{{ scope.opt.serialNumber }}</p>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="item__device">
                  <p><b>Imei:</b>{{ scope.opt.imei }}</p>
                  <p><b>Celular:</b>{{ scope.opt.phoneNumber }}</p>
                  <p><b>Número de serie:</b>{{ scope.opt.serialNumber }}</p>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay dispositivos enlazables registrados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="item__device" v-if="selectedDevice">
              <p><b>Imei:</b>{{ selectedDevice.imei }}</p>
              <p><b>Celular:</b>{{ selectedDevice.phoneNumber }}</p>
              <p><b>Número de serie:</b>{{ selectedDevice.serialNumber }}</p>
            </div>

            <q-card-actions align="right">
              <q-btn label="Cancelar" @click="showLinkDialog = false" />
              <q-btn color="negative" label="Desenlazar" type="submit" v-if="isUnlinking" />
              <q-btn color="primary" label="Guardar" type="submit" v-else />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TDevice, TPatient } from './models';
import { api } from 'src/boot/axios';


import type { ContextMenuEvent, Item } from 'ol-contextmenu';

import { Feature, type View } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';



export interface TPatientInput {
  _id: string;
  name: string;
  lastname: string;
  birthdate: string;
  contactInfo: string;
  idNumber: string;
  deviceId: string;
  createdAt: Date;
}



const patientsData = ref<TPatient[]>([]);

const devicesData = ref<TDevice[]>([]);

const inputValue = ref('');

const showDialog = ref(false);

const devicesSelectData = ref<TDevice[]>([]);
const selectedDevice = ref<TDevice>();
const showLinkDialog = ref(false);


const isEditing = ref(false);
const isUnlinking = ref(false);
const isEditingZone = ref(false);

const showSetSecureZone = ref(false);


const model = ref(null);

const selectedPatient = ref<TPatient>();

const form = ref<TPatientInput>({
  _id: '',
  name: '',
  lastname: '',
  birthdate: '',
  contactInfo: '',
  idNumber: '',
  deviceId: '',
  createdAt: new Date()
});



const columns = ref([
  { name: 'name', label: 'Nombre', field: 'name' },
  { name: 'lastname', label: 'Apellido', field: 'lastname' },
  { name: 'birthdate', label: 'Fecha Nacimiento', field: 'birthdate' },
  { name: 'contactInfo', label: 'Información Contacto', field: 'contactInfo' },
  { name: 'idNumber', label: 'Cédula', field: 'idNumber' },
  { name: 'devices', label: 'Asignación Dispositivo', field: 'devices' },
  { name: 'zones', label: 'Asignación Zona Segura', field: 'zones' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]);

const addRow = () => {
  isEditing.value = false;
  form.value = {
    _id: '',
    name: '',
    lastname: '',
    birthdate: '',
    contactInfo: '',
    idNumber: '',
    deviceId: '',
    createdAt: new Date()
  };
  showDialog.value = true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectDevice = (device: any) => {
  device.label = device.phoneNumber;
  selectedDevice.value = device

};
////////////////////////

const contextMenuItems = ref<Item[]>([]);
const center = ref([-78.4896006, -0.2095647]);
const circleCenter = ref([0, 0]);
const projection = ref('EPSG:4326');
const zoom = ref(12);
const markers = ref<{ source: VectorSource } | null>(null);
const view = ref<View | null>(null);

contextMenuItems.value = [
  {
    text: 'Establecer centro',
    // instead of `icon` property (see next line)
    callback: (val) => {
      console.log('val');
      console.log(val);
      console.log('val.coordinate');
      console.log(val.coordinate);
      const feature = new Feature({
        geometry: new Point(val.coordinate),
      });

      console.log('markers.value?.source.getFeatures().length')
      console.log(markers.value?.source.getFeatures().length)

      console.log('markers.value?.source.getFeatures() ---->')
      console.log(markers.value?.source.getFeatures())

      markers.value?.source.clear();
      markers.value?.source.addFeature(feature);
      console.log('markers.value?.source.getFeatures().length')
      console.log(markers.value?.source.getFeatures().length)

      console.log('markers.value?.source.getFeatures() ---->')
      console.log(markers.value?.source.getFeatures())

      const markersLenWatch = markers.value ? markers.value?.source.getFeatures().length : 0;

      console.log('markersLenWatch')
      console.log(markersLenWatch)

      if (markersLenWatch > 0) {
        markersLength.value = 1;
        circleCenter.value = val.coordinate
      }

    },
  },
  '-',

];

const markersLength = ref(0);



function log(type: string, event: ContextMenuEvent) {
  console.log(type, event);
}

////////////////////////


const saveZone = () => {
  console.log('isEditingZone.value *******')
  console.log(isEditingZone.value)
  if (!isEditingZone.value && circleCenter.value.length > 1) {
    console.log('savingggg')
    api.post('/zone', {
      'latitude': circleCenter.value[1],
      'longitude': circleCenter.value[0],
      'radius': 1,
      'patient': selectedPatient.value?._id
    }).then(() => {
      loadPatients();
      showSetSecureZone.value = false
      isEditingZone.value = false;
    }).catch((error) => {
      console.error('Error deleting patient:', error);
    });
  }
  else {
    console.log('editinggggg')
    api.put('/zone', {
      '_id': selectedPatient.value?.zone._id,
      'latitude': circleCenter.value[1],
      'longitude': circleCenter.value[0],
      'radius': 1,
    }).then(() => {
      loadPatients();
      showSetSecureZone.value = false
      isEditingZone.value = false;
    }).catch((error) => {
      console.error('Error deleting patient:', error);
    });
  }

};

const updateInputValue = (value: string) => {

  console.log('updateeeeeevalueee... ', value)
  inputValue.value = 'value.imei;'
  console.log('inputValue.value')
  console.log(value)

};

const saveLinkDevice = () => {

  if (isUnlinking.value) {
    api.put('/patient/unlinkdevice', {
      patientId: selectedPatient.value?._id,
      deviceId: selectedPatient.value?.device._id
    }).then(() => {
      loadPatients();
      loadDevices();
      showLinkDialog.value = false
      selectedDevice.value = undefined
      inputValue.value = ''
      isUnlinking.value = false
    }).catch((error) => {
      console.error('Error deleting patient:', error);
    });
  }
  else {
    api.put('/patient/linkdevice', {
      patientId: selectedPatient.value?._id,
      deviceId: selectedDevice.value?._id,

    }).then(() => {
      loadPatients();
      loadDevices();
      showLinkDialog.value = false
      selectedDevice.value = undefined
      inputValue.value = ''
      isUnlinking.value = false
    }).catch((error) => {
      console.error('Error deleting patient:', error);
    });
  }
}

const filterFn = (filterInputValue: string, update: (callback: () => void) => void) => {
  update(() => {

    devicesSelectData.value = devicesData.value.filter((deviceItem) => {
      console.log(' filetring deviceItem ..')
      console.log(deviceItem)
      return deviceItem.imei.toString().toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1 ||
        deviceItem.phoneNumber.toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1 ||
        deviceItem.serialNumber?.toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1
    })
  })
}

const linkDevice = (row: TPatient) => {
  showLinkDialog.value = true;
  selectedPatient.value = row
};


const unlinkDevice = (row: TPatient) => {
  isUnlinking.value = true;
  selectedPatient.value = row;
  selectedDevice.value = row.device;
  showLinkDialog.value = true;
};

const addZone = (row: TPatient) => {
  showSetSecureZone.value = true;
  selectedPatient.value = row
  circleCenter.value = []
  center.value = [-78.4896006, -0.2095647]
};


const editZone = (row: TPatient) => {
  isEditingZone.value = true;
  selectedPatient.value = row;
  //selectedZone.value = row.zone;
  showSetSecureZone.value = true;

  console.log('editZone .................')

  // const feature = new Feature({
  //   geometry: new Point([selectedPatient.value.zone.latitude, selectedPatient.value.zone.longitude]),
  // });

  // console.log('val');
  // console.log(val);
  // console.log('val.coordinate');
  // console.log(val.coordinate);

  const feature = new Feature({
    geometry: new Point([selectedPatient.value.zone.longitude, selectedPatient.value.zone.latitude]),
  });

  console.log('markers.value?.source.getFeatures().length ....1')
  console.log(markers.value?.source.getFeatures().length)

  if (!markers.value) {
    console.log('initiiiiiiii')
    markers.value = { source: new VectorSource() }

  }

  //markers.value?.source.clear();

  console.log('>>> markers.value?.source.getFeatures().length')
  console.log(markers.value?.source.getFeatures().length)

  console.log('>>> markers.value?.source.getFeatures() ---->')
  console.log(markers.value?.source.getFeatures())

  markers.value?.source.clear();
  markers.value?.source.addFeature(feature);
  console.log('>>> markers.value?.source.getFeatures().length')
  console.log(markers.value?.source.getFeatures().length)

  console.log(' >>> markers.value?.source.getFeatures() ---->')
  console.log(markers.value?.source.getFeatures())

  const markersLenWatch = markers.value ? markers.value?.source.getFeatures().length : 0;


  if (markersLenWatch > 0) {
    markersLength.value = 1;
    circleCenter.value = [selectedPatient.value.zone.longitude, selectedPatient.value.zone.latitude]
    center.value = [selectedPatient.value.zone.longitude, selectedPatient.value.zone.latitude]
  }


};

const editRow = (row: TPatient) => {
  isEditing.value = true;
  form.value = { ...row, _id: row._id, createdAt: new Date() };
  showDialog.value = true;
};



const deleteRow = (form: TPatientInput) => {
  api.delete(`/patient/${form._id}`).then(() => {
    loadPatients();
  }).catch((error) => {
    console.error('Error deleting patient:', error);
  });
};

const saveRow = () => {
  if (isEditing.value) {
    // Update existing patient
    api.put('/patient', form.value).then(() => {
      loadPatients();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error updating patient:', error);
    });
  } else {
    // Add new patient

    api.post('/patient', (({ _id, ...rest }) => rest)(form.value)).then((response) => {
      loadPatients();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error adding patient:', error);
    });
  }
};

const loadPatients = () => {
  api.get('/patient').then((response) => {
    patientsData.value = response.data.patients as TPatient[];
    console.log('patientsData.value')
    console.log(patientsData.value)
  }).catch(() => {
    console.log('Error loading patients');
  });
};

const loadDevices = () => {
  api.get('/device/unlinked').then((response) => {
    devicesData.value = response.data.devices as TDevice[];

    // devicesData.value = devicesData.value.map((deviceItem) => { return { ...deviceItem, label: 'Dispositivo: ' + deviceItem.imei } })
    console.log('devicesData.value')
    console.log(devicesData.value)
  }).catch(() => {
    console.log('Error loading devices');
  });
};

onMounted(() => {
  loadPatients();
  loadDevices();
});


</script>


<script lang='ts'>
export default {
  name: 'PatientsComponent',
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

.item-border {
  border-bottom: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
}

.map-picker {
  position: relative;
}

.coordinates {
  margin-top: 10px;
}

.marker {
  background-color: #00000000;
  padding: 10px;
  border-radius: 25px;
  margin: 5px;
  font-size: 40px;
}
</style>
