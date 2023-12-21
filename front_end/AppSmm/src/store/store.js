import {createStore} from "vuex";

export const store = createStore({
    state () {
        return {
            currentChannel: {
                chName: '',
                chDescription: '',
            },
            remainingQuota: {
                daily: 0,
                weekly: 0,
                monthly: 0,
            },
            maxQuota: {
                daily: 0,
                weekly: 0,
                monthly: 0,
            }
        }
    },
    mutations: {
        uploadChannel (state,channelInfo) {
            state.currentChannel.chName = channelInfo.chName;
            state.currentChannel.chDescription = channelInfo.chDescription;
        },
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
    },
    getters:{
        getQuota(state){
            return state.remainingQuota;
        },
        getMaxQuota(state){
            return state.maxQuota;
        }
    }
})

