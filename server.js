const express =require('express');
const geolib = require('geolib');

const app = express();

const hospitalLocations =[
  //locations of several hospitals go here, although a separate database could be used instead
  //only 3 locations to be used in the demo
  {
    name: 'St. Lukes Makati', contact: '+639123456789', cvexcl: 1,
    longitude: 121.0482,
    latitude: 14.5549,
  },
  {
    name: 'The Medical City', contact: '+639983922013', cvexcl: 1,
    longitude: 121.0693,
    latitude: 14.5895,
  },
  {
    name: 'Philippine General Hospital', contact: '+631344921234', cvexcl: 1,
    longitude: 120.9856,
    latitude: 14.5777,
  },
];

//function to find nearest hospital (very crude algo tho)
//better to use geohashing for more than 10 locations
const findNearestHospital = (latitude, longitude) => {
  const locations = hospitalLocations.map(location => {
    const distance = geolib.getDistance({
      latitude,
      longitude
    },{
      latitude: location.latitude,
      longitude: location.longitude
    });
    
    return Object.assign({}, location, {distance});
  });
  
  locations.sort((locationA, locationB) => {
    const distanceA = locationA.distance;
    const distanceB = locationB.distance;
    
    if (distanceA < distanceB) {
      return -1;
    }
    
    if (distanceA > distanceB) {
      return 1;
    }
    
    return 0;
  });
  return locations;
};

//requests
app.get('/nearest', (request,response) => {
  const latitude = request.query.latitude;
  const longitude = request.query.longitude;
  
  const locations = findNearestHospital(latitude, longitude);
  
  const nearestLocation = locations[0];
  
  //returns this message to the request (in chatfuel form)
  response.json({
    messages: [
      {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: `The nearest hospital that could accomodate you would be: ${nearestLocation.name},
            contact number is ${nearestLocation.contact}.`,
          }
        }
      }      
    ]
  });
  
  response.json({locations});
  
});

//4 listening 2 requests
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
//thank you to Marc Littlemore for the base code and the tutorial on setting this up