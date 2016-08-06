import { Mongo } from 'meteor/mongo'

const EmailsStore = new Mongo.Collection("emails_store")

export default EmailsStore


