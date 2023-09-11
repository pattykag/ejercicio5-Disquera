const cds = require('@sap/cds');

// handle bootstrapping events...
cds.on('bootstrap', (app)=>{
  // add your own middleware before any by cds are added
  console.log('Bootstrap --> add your own middleware before any by cds are added');
});

cds.on('served', ()=>{
  // add more middleware after all CDS services
  console.log('Served --> add more middleware after all CDS services');
});

// delegate to default server.js:
module.exports = cds.server 