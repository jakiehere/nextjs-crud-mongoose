import {
  model,
  models,
  Schema,
} from 'mongoose';

const TodoSchema = new Schema(
	{
		todo: {
			type: String,
			require: true,
			unique: true,
		},
		isCompleted: {
			type: Boolean,
			default: false
		}
	},
	{	
		timestamps: true
	}
);

const Todos = models.Todos || model('Todos', TodoSchema);

export default Todos;
