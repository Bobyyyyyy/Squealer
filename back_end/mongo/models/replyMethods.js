const connection = require('../ConnectionSingle');
const Reply = require('../schemas/Reply');
const {createError, sorts} = require("./utils");

/**
 *
 * @param {String} content
 * @param {String} owner
 * @param {String} parentID
 * @return {Promise<unknown extends {_id?: infer U} ? IfAny<U, {_id: Types.ObjectId}, Required<{_id: U}>> : {_id: Types.ObjectId} extends {_id?: infer U} ? IfAny<U, unknown extends {_id?: infer U} ? IfAny<U, {_id: Types.ObjectId}, Required<{_id: U}>> : {_id: Types.ObjectId} & {_id: Types.ObjectId}, unknown extends {_id?: infer U} ? IfAny<U, {_id: Types.ObjectId}, Required<{_id: U}>> : {_id: Types.ObjectId} & Required<{_id: U}>> : (unknown extends {_id?: infer U} ? IfAny<U, {_id: Types.ObjectId}, Required<{_id: U}>> : {_id: Types.ObjectId} & {_id: Types.ObjectId})>}
 */
const addReply = async (content, owner, parentID) => {
    try{
        let newReply = new Reply({
            owner: owner,
            content: content,
            parent: parentID,
            dateOfCreation: Date.now(),
        })
        await connection.get();
        let writeResult = await newReply.save()
        if( writeResult?.writeConcernError){
            throw createError('aggiunta commento fallita', 500);
        }
        return newReply.toObject();
    }catch(error){
        throw error;
    }
}

/**
 *
 * @param {String} parentID
 * @return {Promise<Aggregate<Array<{String, String, String}>>>}
 */
const getReplies = async (parentID) => {
    try{
        await connection.get();
        let replies = await Reply.aggregate([
            {
                $project:{
                    owner: '$owner',
                    content: 'content',
                    dateOfCreation: 'dateOfCreation',
                },
            },
            {$match: {'parent': parentID}},
            {$sort: sorts['meno recente']},
            /*
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "username",
                    pipeline:[
                        {
                            $project: {
                                profilePicture: '$profilePicture'
                            }
                        }
                    ],
                    as: "user_info",
                }
            },

             */
        ]);
        return replies;
    }catch(error){
        throw error;
    }
}

module.exports = {
    addReply,
    getReplies
}