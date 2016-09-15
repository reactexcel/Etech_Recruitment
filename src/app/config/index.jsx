import ip from 'ip';

export const config_ENV = {
  /*"emailServer": {
    "_id":encodeURIComponent("excellenceseo@gmail.com"),
    "_password": encodeURIComponent("java@123"),
    "_host": "smtp.gmail.com",
    "_port": 587,
    "_url" : function(){
      return (
        'smtp://'+
        this._id+
        ':'+this._password+
        '@'+this._host+
        ':'+this._port
      );
    },
  },*/
  "emailServer": {
    "_id":"abhishek@excellencetechnologies.in",
    "_password":"nKR9ENcoWmAtGZL",
    "_host": "smtp-pulse.com",
    "_port": 465,
    "_url" : function(){
      return (
        'smtp://'+
        this._id+
        ':'+this._password+
        '@'+this._host+
        ':'+this._port
      );
    },
  },
  "MongoDB": {
    "_username": "manishiitg",
    "_password": "java123",
    "_host": "ds139725.mlab.com",
    "_port": 39725,
    "_database": "meteor-manish-test",
    "_url" : function(){
      return (
        'mongodb://'+
        this._username+
        ':'+this._password+
        '@'+this._host+
        ':'+this._port+
        '/'+this._database
      );
    },
  },
  "host":{
    "server_host": ip.address(),//Get IP address of host server
    "server_port": 3000,//process.env.PORT || 3000,
    "_url": function(){
      return (
        'http://'+this.server_host+':'+this.server_port
      );
    },
  },
  'IMAP_API_BASE_URL' : 'http://excellencetechnologies.co.in/imap/?',
  '_BASE_URL' : 'http://excellencetechnologies.co.in/imap/email.php?'
}
