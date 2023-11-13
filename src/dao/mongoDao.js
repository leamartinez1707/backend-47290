// import mongoose from "mongoose";
// import User from '../dao/models/user.model.js'

// export default class MongoDao {
//     constructor(config) {
//         this.mongoose = mongoose.connect(config.mongo_url)
//             .catch(err => {
//                 console.log(err)
//                 process.exit()
//             })
//         const timestamp = {
//             timestamps: {
//                 createdAt: 'created_at',
//                 updatedAt: 'updated_at'
//             }
//         }
//         const userSchema = mongoose.Schema(User.schema, timestamp)
//     }
// }