const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistoriquesCadresSchema = mongoose.Schema({
    cadre:{
        type: Schema.Types.ObjectId,
        ref: 'cadres',
        required: true
    },
    dateSortie: {    
        type: Date,
        required: true
    },
    causeSortie: {
        type: String,
        required: true
    },
    etat : {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('historiquesCadres', HistoriquesCadresSchema);