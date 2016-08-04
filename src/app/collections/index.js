import { Mongo } from 'meteor/mongo'

import '../methods/index'


const Tasks = new Mongo.Collection("tasks");

export default Tasks;
