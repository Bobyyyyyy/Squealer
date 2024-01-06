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
            notifications: [],
            user_info:{
                smm: '',
                vip: {
                    name: '',
                    profilePic: '',
                }
            },
            currReplies: [],
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
            state.offsetSqueals = 0;
            state.currentSqueals = [];
        },
        pushHeadSqueal(state, squeal){
            state.currentSqueals.unshift(squeal.post);
            state.offsetSqueals += 1;
        },
        updateOffset(state){
            state.offsetSqueals += 12;
        },
        setNotification(state, notifications){
            notifications.forEach(not => {
                if(! state.notifications.map(noti => noti._id).includes(not._id)) state.notifications.push(not)
            })
        },
        deleteNotifications(state){
            state.notifications = [];
        },
        setsmm(state, smmname){
            state.user_info.smm = smmname
        },
        setVip(state,vip){
            state.user_info.vip.name = vip.name;
            state.user_info.vip.profilePic = vip.profilePic;
        },
        deleteVip(state){
            state.user_info.vip.name= '';
            state.user_info.vip.profilePic = '';
        },
        setReplies(state, replies){
            state.currReplies = replies;
        },
        pushReply(state, reply){
            console.log(reply);
            state.currReplies.unshift(reply);
        },
        deleteReplies(state){
            state.currReplies = []
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
        },
        getNotifications(state){
            return state.notifications;
        },
        getVip(state){
            return state.user_info.vip;
        },
        getSmm(state){
            return state.user_info.smm;
        },
        getReplies(state){
            return state.currReplies;
        }
    }
})

