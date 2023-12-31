const replyModel = require("../models/replyMethods");
const {createError} = require("../models/utils");

const addReply = async (req,res) => {
    try{
        let content = req.body.content;
        let parentID = req.body.parentid;

        if(!content) throw createError('contenuto non valido', 404);
        if(!parentID) throw createError('id post padre non valido', 404);

        let user = req.session.type === 'smm' ? req.session.vip : req.session.user;

        let response = await replyModel.addReply(content, user, parentID);

        res.status(200).send(response);
    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

const getReplies = async (req,res) => {
    try{
        if(typeof req.query.parentid === "undefined")
            throw createError('id post padre non valido', 404);

        let response = await replyModel.getReplies(req.query.parentid);

        res.status(200).send(response);

    } catch (Error) {
        if(typeof Error.statusCode !== 'undefined')
            res.status(Error.statusCode).send(Error.message);
        else {
            res.status(500).send(Error);
        }
    }
}

module.exports = {
    addReply,
    getReplies,
}