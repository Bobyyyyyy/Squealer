<script setup>
  import {useStore} from "vuex";
  import {computed, ref} from "vue";
  import BuyConfModal from "./buyConfModal.vue";
  import {useToast} from "vue-toast-notification";

  const UPGRADE_QUOTA_PERC = 15;

  const baseQuota = 250;
  const quota ={
    daily: baseQuota,
    weekly: baseQuota*6,
    monthly: (baseQuota*6)*4,
  }

  const $toast = useToast();

  const modalConf = ref();

  const store = useStore();
  const quotaRem = computed(() => store.getters.getQuota);
  const maxQuota = computed(()=>store.getters.getMaxQuota);
  const resetDaily = ref(false);
  const resetWeekly = ref(false);
  const resetMonthly = ref(false);
  const upgrade = ref(false);
  const totSpesa = computed(() => ((resetDaily.value) ? 5 : 0) +
      ((resetWeekly.value) ? 50 : 0) +
      ((resetMonthly.value) ? 150 : 0) +
      ((upgrade.value) ? 300 : 0)
  );

  const newMaxQuota = computed(() => {
      return {
        daily: maxQuota.value.daily + (upgrade.value ? Math.floor((quota.daily / 100) * UPGRADE_QUOTA_PERC) : 0),
        weekly: maxQuota.value.weekly + (upgrade.value ? Math.floor((quota.weekly / 100) * UPGRADE_QUOTA_PERC) : 0),
        monthly: maxQuota.value.monthly + (upgrade.value ? Math.floor((quota.monthly / 100) * UPGRADE_QUOTA_PERC) : 0),
      }
    }
  )

  const emits = defineEmits('closeModal')

  function openModalConfQuota() {
    modalConf.value.openModal();
  }

  async function fetchPayment(){
    if (upgrade.value) {
      let res = await fetch('/db/user/quota', {
        method: 'PUT',
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentage: UPGRADE_QUOTA_PERC
        })
      })
      if(res.ok){
        let data = await res.json();
        store.commit('setMaxQuota',data.newMaxQuota);
        $toast.success(data.message, {position: 'top-right'});
      }
      else {
        $toast.error(`errore ${res.statusCode}: ${(await res.json()).message}`)
      }
    }

    if (resetDaily.value){
      let res = await fetch('')
    }

    emits('closeModal');
  }

</script>

<template>
  <div class="d-flex flex-column align-items-center">
    <h4>Quota rimanente </h4>
    <div class="d-flex flex-row w-100 justify-content-around">
      <div class="d-flex flex-column sameWidth align-items-center">
        <h5 class="m-0">Giornaliera</h5>
        <div class="d-flex flex-row">
          <h5 class="m-0">{{quotaRem.daily}}</h5>
          <h5 v-if="resetDaily" class="m-0 ms-1 text-primary">{{`+${newMaxQuota.daily - quotaRem.daily}`}}</h5>
        </div>
      </div>
      <div class="d-flex flex-column sameWidth align-items-center">
        <h5 class="m-0">Settimanale</h5>
        <div class="d-flex flex-row">
          <h5 class="m-0">{{quotaRem.weekly}}</h5>
          <h5 v-if="resetWeekly" class="m-0 ms-1 text-primary">{{`+${newMaxQuota.weekly - quotaRem.weekly}`}}</h5>
        </div>
      </div>
      <div class="d-flex flex-column sameWidth align-items-center">
        <h5 class="m-0">Mensile</h5>
        <div class="d-flex flex-row">
          <h5 class="m-0">{{quotaRem.monthly}}</h5>
          <h5 v-if="resetMonthly" class="m-0 ms-1 text-primary">{{`+${newMaxQuota.monthly - quotaRem.monthly}`}}</h5>
        </div>
      </div>
    </div>

    <hr>
    <h4>Quota massima</h4>
    <div class="d-flex flex-row w-100 justify-content-around">
      <div class="d-flex flex-column sameWidth align-items-center">
        <h5 class="m-0">Giornaliera</h5>
        <div class="d-flex flex-row">
          <h5 class="m-0">{{ maxQuota.daily}}</h5>
          <h5 v-if="upgrade" class=" m-0 ms-1 text-primary">{{`+${newMaxQuota.daily - maxQuota.daily}`}}</h5>
        </div>
      </div>
      <div class="d-flex flex-column sameWidth align-items-center">
        <h5 class="m-0">Settimanale</h5>
        <div class="d-flex flex-row">
          <h5 class="m-0">{{ maxQuota.weekly}}</h5>
          <h5 v-if="upgrade" class=" m-0 ms-1 text-primary">{{`+${newMaxQuota.weekly - maxQuota.weekly}`}}</h5>
        </div>
      </div>
      <div class="d-flex flex-column sameWidth align-items-center">
        <h5 class="m-0">Mensile</h5>
        <div class="d-flex flex-row">
          <h5 class="m-0">{{ maxQuota.monthly}}</h5>
          <h5 v-if="upgrade" class=" m-0 ms-1 text-primary">{{`+${newMaxQuota.monthly - maxQuota.monthly}`}}</h5>
        </div>
      </div>
    </div>
    <div class="d-flex flex-row w-100 justify-content-around mt-5">
      <input type="checkbox" class="btn-check" id="btnCheckDailyReset" v-model="resetDaily">
      <label class="btn btn-outline-primary" for="btnCheckDailyReset">ripristina giornaliera</label>

      <input type="checkbox" class="btn-check" id="btnCheckWeeklyReset" v-model="resetWeekly">
      <label class="btn btn-outline-primary" for="btnCheckWeeklyReset">ripristina settimanale</label>

      <input type="checkbox" class="btn-check" id="btnCheckMonthlyReset" v-model="resetMonthly">
      <label class="btn btn-outline-primary" for="btnCheckMonthlyReset">ripristina mensile</label>

      <input type="checkbox" class="btn-check" id="btnCheckIncreaseMax" v-model="upgrade">
      <label class="btn btn-outline-primary" for="btnCheckIncreaseMax">aumenta la massima</label>
    </div>
  </div>
  <hr>
  <div class="d-flex flex-row justify-content-between">
    <div class="d-flex flex-row align-items-center">
      <h5 class="m-0">totale previsto: €{{totSpesa}}</h5>
    </div>
    <div class="d-flex flex-row align-items-center">
      <button type="button" class="btn btn-lg btn-primary" @click="openModalConfQuota">Acquista</button>
    </div>
  </div>
  <buyConfModal :payment="totSpesa" ref="modalConf" @acquisto="fetchPayment"></buyConfModal>
</template>
