<template>
  <div class="caregiversComponent">
    <div class="container">
      <div class="q-pa-md bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>Cuidadores</q-toolbar-title>
          <q-btn color="secondary" @click="addRow">Agregar</q-btn>
        </q-toolbar>

      </div>
      <q-table :rows="caregiversData" :columns="columns" row-key="id" class="q-mt-md"
        :rows-per-page-options="[50, 100, 200]">
        <template v-slot:header-cell-actions="props">
          <q-th class="text-center thead th td tr">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:header-cell-patients="props">
          <q-th class="text-center">
            {{ props.col.label }}
          </q-th>
        </template>
        <template v-slot:body-cell-patients="props">
          <q-td class="text-center">
            <q-btn flat icon="add" color="positive" @click="linkPatient(props.row)" v-if="props.row.patient == null" />
            <q-btn flat icon="remove" color="negative" @click="unlinkPatient(props.row)" v-else />
          </q-td>
        </template>
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
          <div class="text-h6">{{ isEditing ? 'Editar Cuidador' : 'Agregar Cuidador' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveRow">
            <q-input v-model="form.name" label="Nombre" required class="q-ma-sm" />
            <q-input v-model="form.lastname" label="Apellido" required class="q-ma-sm" />
            <q-input v-model="form.birthdate" label="Fecha Nacimiento" required class="q-ma-sm" />
            <q-input v-model="form.phone" label="Teléfono" required class="q-ma-sm" />
            <q-input v-model="form.idNumber" label="Cédula" required class="q-ma-sm" />
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

    <q-dialog v-model="showLinkDialog">
      <q-card class="q-pa-lg" style="max-width: 80vw; max-height: 80vh;">
        <q-card-section>
          <div class="text-h6">{{ !isUnlinking ? 'Enlazar Afectado' : 'Desenlazar Afectado' }}</div>
          <p><b>Cuidador:</b> {{ selectedUser?.name }} {{ selectedUser?.lastname }}</p>
          <p><b>Cédula:</b> {{ selectedUser?.idNumber }}</p>

        </q-card-section>

        <q-card-section>
          <q-form @submit="saveLinkPatient">
            <q-select filled v-model="model" use-input hide-selected fill-input :input-value="inputValue"
              input-debounce="0" @input-value="(value) => updateInputValue(value)" :label="'Buscar'"
              @update:model-value="(value) => selectPatient(value)" @filter="filterFn" :options="patientsSelectData"
              v-if="!isUnlinking">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :key="scope.index">
                  <q-item-section class="item-border">
                    <div class="item__patient">
                      <p><b>Cédula:</b>{{ scope.opt.idNumber }}</p>
                      <p><b>Nombre:</b>{{ scope.opt.name }}</p>
                      <p><b>Apellido:</b>{{ scope.opt.lastname }}</p>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:selected-item="scope">
                <div class="item__patient">
                  <p><b>Cédula:</b>{{ scope.opt.idNumber }}</p>
                  <p><b>Nombre:</b>{{ scope.opt.name }}</p>
                  <p><b>Apellido:</b>{{ scope.opt.lastname }}</p>
                </div>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay pacientes pendientes de asignación
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="item__patient" v-if="selectedPatient">
              <p><b>Cédula:</b>{{ selectedPatient.idNumber }}</p>
              <p><b>Nombre:</b>{{ selectedPatient.name }}</p>
              <p><b>Apellido:</b>{{ selectedPatient.lastname }}</p>
            </div>

            <q-card-actions align="right">
              <q-btn label="Cancelar" @click="showLinkDialog = false;
          isUnlinking = false; selectedPatient = undefined" />
              <q-btn color="negative" label="Desenlazar" type="submit" v-if="isUnlinking" />
              <q-btn color="primary" label="Enlazar" type="submit" v-else />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TPatient, TUser } from './models';
import { api } from 'src/boot/axios';

export interface TCaregiverInput {
  _id: string;
  name: string;
  lastname: string;
  birthdate: string;
  phone: string;
  email: string;
  emailConfirmation: string;
  userType: number;
  idNumber: string;
  passwordReset: boolean;
  createdAt: Date;
}

const caregiversData = ref<TUser[]>([]);

const columns = ref([
  { name: 'name', label: 'Nombre', field: 'name' },
  { name: 'lastname', label: 'Apellido', field: 'lastname' },
  { name: 'birthdate', label: 'Fecha Nacimiento', field: 'birthdate' },
  { name: 'phone', label: 'Teléfono', field: 'phone' },
  { name: 'idNumber', label: 'Cédula', field: 'idNumber' },
  { name: 'email', label: 'Correo', field: 'email' },
  { name: 'patients', label: 'Asignación Afectado', field: 'patients' },
  { name: 'actions', label: 'Acciones', field: 'actions' }
]);

const showDialog = ref(false);
const isEditing = ref(false);


const inputValue = ref('');


const patientsSelectData = ref<TPatient[]>([]);
const patientsData = ref<TPatient[]>([]);
const selectedPatient = ref<TPatient>();
const selectedUser = ref<TUser>();
const showLinkDialog = ref(false);

const isUnlinking = ref(false);

const model = ref(null);



const form = ref<TCaregiverInput>({
  _id: '',
  name: '',
  lastname: '',
  email: '',
  emailConfirmation: '',
  userType: 2,
  passwordReset: false, createdAt: new Date(),
  birthdate: '',
  phone: '',
  idNumber: ''
});

const addRow = () => {
  isEditing.value = false;
  form.value = {
    _id: '', name: '', lastname: '', email: '', emailConfirmation: '', userType: 2, passwordReset: false, createdAt: new Date(),
    birthdate: '',
    phone: '',
    idNumber: ''
  };
  showDialog.value = true;
};

const editRow = (row: TUser) => {
  isEditing.value = true;
  form.value = { ...row, _id: row._id, emailConfirmation: row.email, createdAt: new Date() };
  showDialog.value = true;
};

const deleteRow = (form: TCaregiverInput) => {
  api.delete(`/user/${form._id}`).then(() => {
    loadCaregivers();
  }).catch((error) => {
    console.error('Error deleting caregiver:', error);
  });
};

const saveRow = () => {
  if (isEditing.value) {
    // Update existing caregiver
    api.put('/user', form.value).then(() => {
      loadCaregivers();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error updating caregiver:', error);
    });
  } else {
    // Add new caregiver

    api.post('/user', (({ _id, ...rest }) => rest)(form.value)).then((response) => {
      loadCaregivers();
      showDialog.value = false;
    }).catch((error) => {
      console.error('Error adding caregiver:', error);
    });
  }
};

const loadCaregivers = () => {
  api.get('/user/getCaregivers').then((response) => {
    caregiversData.value = response.data.caregivers as TUser[];
  }).catch(() => {
    console.log('Error loading caregivers');
  });
};

const loadUnlinkedPatients = () => {
  api.get('/patient/getUnlinkedUserPatients').then((response) => {
    patientsData.value = response.data.patients as TPatient[];
  }).catch(() => {
    console.log('Error loading caregivers');
  });
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectPatient = (patient: any) => {
  patient.label = patient.idNumber;
  selectedPatient.value = patient

};

const updateInputValue = (value: string) => {
  inputValue.value = value

};

const saveLinkPatient = () => {
  if (isUnlinking.value) {
    api.put('/user/unlinkpatient', {
      patientId: selectedPatient.value?._id,
      userId: selectedUser.value?._id
    }).then(() => {
      loadCaregivers();
      loadUnlinkedPatients();
      isUnlinking.value = false;
      showLinkDialog.value = false;
      inputValue.value = '';
      selectedPatient.value = undefined
    }).catch((error) => {
      console.error('Error unlinking patient:', error);
    });
  }
  else {
    api.put('/user/linkpatient', {
      patientId: selectedPatient.value?._id,
      userId: selectedUser.value?._id,

    }).then(() => {
      loadCaregivers();
      loadUnlinkedPatients();
      isUnlinking.value = false;

      showLinkDialog.value = false;
      inputValue.value = '';
      selectedPatient.value = undefined
    }).catch((error) => {
      console.error('Error linking patient:', error);
    });
  }
}

const filterFn = (filterInputValue: string, update: (callback: () => void) => void) => {
  update(() => {

    patientsSelectData.value = patientsData.value.filter((patientItem) => {
      console.log(' filetring patientItem ..')
      console.log(patientItem)
      return patientItem.idNumber.toString().toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1 ||
        patientItem.lastname.toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1 ||
        patientItem.name?.toLowerCase().indexOf(filterInputValue.toLowerCase()) > -1
    })
  })
}

const linkPatient = (row: TUser) => {
  showLinkDialog.value = true;
  selectedUser.value = row
};


const unlinkPatient = (row: TUser) => {
  isUnlinking.value = true;
  selectedUser.value = row;
  selectedPatient.value = row.patient;
  showLinkDialog.value = true;
};

onMounted(() => {
  loadCaregivers();
  loadUnlinkedPatients();
});


</script>


<script lang='ts'>
export default {
  name: 'CaregiversComponent',
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
