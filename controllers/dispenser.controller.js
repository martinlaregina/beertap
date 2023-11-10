const crypto = require('crypto');
const fs = require('fs');
const filename = 'dispensers.json';

// Returns the money spent by the given dispenser Id
exports.spending = (req, res) => {
  // Check if storage file exist
  if (!fs.existsSync(filename)) {
    return res.status(409).json({error: 'Error reading on FS'});
  } else {
    // Read content of storage file
    var content = fs.readFileSync(filename, 'utf8');
    try {
      // Parse storage files into JSON object
      contentJSON = JSON.parse(content);
      // Filter with the giving ID
      dispenserJSON = contentJSON.filter(i => i.id === req.params.dispenserId);
      if (dispenserJSON.length == 1){
        dispenserJSON = dispenserJSON[0];
        // Delete before response the unnecesary fields
        delete dispenserJSON['id'];
        delete dispenserJSON['flow_volume'];
        return res.status(202).json(dispenserJSON);
      } else {
        return res.status(409).json({error: 'Dispenser not found'});
      }
    } catch (e) {
      return res.status(409).json({error: 'Error parsing FS'});
    }
  } 
}

//TODO: Install express-validator and check with it

exports.status = (req, res) => {
  // Validations
  if (!req.body) {
    return res.status(409).json({
      error: 'Content can not be empty!'
    });
  }
  if (!req.body.status) {
    return res.status(409).json({
      error: 'status are required!'
    });
  }
  if (!req.body.updated_at) {
    return res.status(409).json({
      error: 'updated_at are required!'
    });
  }
  // Check if storage file exist
  if (!fs.existsSync(filename)) {
    return res.status(409).json({error: 'Error reading on FS'});
  } else {
    // Read content of storage file
    var content = fs.readFileSync(filename, 'utf8');
    try {
      // Parse storage files into JSON object
      contentJSON = JSON.parse(content);
    } catch (e) {
      return res.status(409).json({error: 'Error parsing FS'});
    }
    // TODO: We can use filter to improve performance
    for (let element of contentJSON){
      if (element.id === req.params.dispenserId){
        let allUsages = element.usages;
        if (req.body.status == 'open'){
          let openedUsages = allUsages.filter(usage => usage.closed_at == '');
          if (openedUsages.length !=0){
            return res.status(409).json({error: 'Dispenser is already opened'});
          }
          allUsages.push({
            opened_at: req.body.updated_at,
            closed_at: '',
            total_spend: 0
          });
        } else if (req.body.status == 'close'){
          let closedUsages = allUsages.filter(usage => usage.closed_at != '');
          if (closedUsages.length == allUsages.length){
            return res.status(409).json({error: 'Dispenser is already closed'});
          }
          let amount = 0;
          for (let usage of allUsages){
            if (usage.closed_at==''){
              var opened_at = new Date(usage.opened_at);
              var closed_at = new Date(req.body.updated_at);
              if (isNaN(closed_at)) {
                return res.status(409).json({error: 'Closed date is invalid'});
              }
              if (closed_at <= opened_at){
                return res.status(409).json({error: 'Closed date must be greather than Open date'});
              }              
              var seconds = (closed_at.getTime() - opened_at.getTime()) / 1000;
              usage.closed_at = req.body.updated_at;
              usage.total_spend = element.flow_volume * seconds;
              amount+= usage.total_spend;
            } else {
              amount+= usage.total_spend;
            }
          };
          element.amount = parseFloat(amount * 12.25).toFixed(3);
        } else {
          return res.status(409).json({error: 'Accepted status values open/close'});
        }
      }
    };
    fs.writeFileSync(filename, JSON.stringify(contentJSON, null, 2));
    dispenserJSON = contentJSON.filter(i => i.id === req.params.dispenserId);
    return res.status(202).json(dispenserJSON);
  } 
}

exports.create = (req, res) => {
  if (!req.body) {
    return res.status(500).json({
      error: 'Content can not be empty!'
    });
  }
  if (!req.body.flow_volume) {
    return res.status(500).json({
      error: 'flow_volume are required!'
    });
  }
  const newDispenser = {
    id: crypto.randomUUID(),
    flow_volume: req.body.flow_volume,
    amount: 0,
    usages: []
  };
  if (!fs.existsSync(filename)) {
    fs.writeFile(filename, JSON.stringify([newDispenser]));
    return res.status(200).json({result: newDispenser});
  } else {
    var content = fs.readFileSync(filename, 'utf8');  
    var list = (content.length) ? JSON.parse(content): [];
    if (list instanceof Array) list.push(newDispenser)
    else list = [newDispenser]
    fs.writeFile(filename, JSON.stringify(list, null, 2), (err) => {  
      if (err) {
        return res.status(500).json({error: 'Error writing on FS'});
      } else { 
        delete newDispenser['amount'];
        delete newDispenser['usages'];
        return res.status(200).json(newDispenser);
      }
    });
  } 
};