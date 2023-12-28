import {createStore} from "vuex";

export const store = createStore({
    state () {
        return {
            remainingQuota: {
                daily: 0,
                weekly: 0,
                monthly: 0,
            },
            maxQuota: {
                daily: 0,
                weekly: 0,
                monthly: 0,
            },
            currentSqueals: [],
            offsetSqueals: 0,
        }
    },
    mutations: {
        setQuota (state, quota) {
            state.remainingQuota.daily = quota.daily;
            state.remainingQuota.weekly = quota.weekly;
            state.remainingQuota.monthly = quota.monthly;
        },
        uploadQuota (state, used) {
            state.remainingQuota.daily -= used;
            state.remainingQuota.weekly -= used;
            state.remainingQuota.monthly -= used;
        },
        setMaxQuota (state, maxQuota) {
            state.maxQuota.daily = maxQuota.daily;
            state.maxQuota.weekly = maxQuota.weekly;
            state.maxQuota.monthly = maxQuota.monthly;
        },
        pushSqueal(state, squeals){
            state.currentSqueals.push(...squeals);
        },
        clearSqueal(state){
            state.currentSqueals = [];
            state.offsetSqueals = 0;
        },
        pushHeadSqueal(state, squeal){
            state.currentSqueals.unshift(squeal.post);
            state.offsetSqueals += 1;
        },
        updateOffset(state){
            state.offsetSqueals += 12;
        }
    },
    getters:{
        getQuota(state){
            return state.remainingQuota;
        },
        getMaxQuota(state){
            return state.maxQuota;
        },
        getSqueal(state){
            return state.currentSqueals;
        },
        getOffset(state){
            return state.offsetSqueals;
        }
    }
})

