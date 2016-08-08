import { Mongo } from 'meteor/mongo'

import '../methods/index'
const Logs = new Mongo.Collection("logs");
export default Logs;
