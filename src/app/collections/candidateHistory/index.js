import { Mongo } from 'meteor/mongo'

const History = new Mongo.Collection("history");
export default History;