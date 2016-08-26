import { Mongo } from 'meteor/mongo'

const EmailTemplates = new Mongo.Collection("email_templates")

export default EmailTemplates


