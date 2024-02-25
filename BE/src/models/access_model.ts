import mongoose from "mongoose";

const accessSchema = new mongoose.Schema({
	attempts: {
		type: Number,
		min: 0,
		max: 5,
		required: true,
	},
	access: {
		type: Boolean,
		required: true,
	},
	remoteAddress: {
		type: String,
		required: true,
		unique: true,
	},
});

accessSchema.set("toJSON", {
	transform(_document, returnedObject) {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Access = mongoose.model("Access", accessSchema);

export default Access;
