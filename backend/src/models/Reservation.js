import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
{
    bookingId:{
        type:String,
        unique:true
    },

    customerName:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    email:{
        type:String,
        default:""
    },

    reservationDate:{
        type:Date,
        required:true
    },

    reservationTime:{
        type:String,
        required:true
    },

    guests:{
        type:Number,
        required:true
    },

    specialRequest:{
        type:String,
        default:""
    },

    table:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Table",
        default:null
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "Confirmed",
            "Rescheduled",
            "Completed",
            "Cancelled"
        ],
        default:"Pending"
    },

    rescheduleCount:{
        type:Number,
        default:0
    },

    previousReservations:[
        {
            reservationDate:Date,
            reservationTime:String
        }
    ]
},
{
timestamps:true
}
);

export default mongoose.model("Reservation",reservationSchema);