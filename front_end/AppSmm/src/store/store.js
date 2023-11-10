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
        }
    },
    getters:{
        getQuota(state){
            return state.remainingQuota;
        }
    }
})

