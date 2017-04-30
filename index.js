/*
INSTRUCTIONS

The goal of this exercise is to simulate the creation of a report, by merging two datasets together, and drawing some basic insights. Given the stated assumptions, please provide your answers to the following 4 questions, as well as your code. Use of python, particularly with Pandas, is encouraged.

Source1.csv:
•	Each “campaign” contains three elements, separated by the delimiter “_”. The first element represents an initiative, the second represents an audience, and third represents an asset.
o	“A_B_C” means the initiative is A, the audience is B, and the asset is C
•	Each “actions” value contains a list of dictionaries, where each element has an action and a type. For example {"x": 63, "action": "like"} means that there were 63 likes of type x.

Source2.csv
•	Each “campaign” contains the same three elements (initiative, audience, asset), separated by the same delimiter “_”, but in this case the order of the elements is random.

Assumptions:
•	A “campaign” is a unique combination of Initiative, Asset and Audience
•	CPM = spend/impressions*1000
•	CPV = spend/views ONLY for campaigns with an object_type of video. Ignore spend and views for all other object_types in calculating CPV.
•	All campaigns are represented for each day in source1.csv
•	There may be missing or duplicate campaigns in source2.csv
•	For all questions, ignore actions that aren’t of type X or Y.

Questions:
1.	How many unique campaigns ran in February?
2.	What is the total number of conversions on plants?
3.	What audience, asset combination had the least expensive conversions?
4.	What was the total cost per video view?
*/

// campaign,date,spend,impressions,actions

// let campaigns = new Set();
let campaigns = {};

var csv = require("fast-csv");

const main = () => {
  readFile2();
}

const readFile2 = () => {
  csv
    .fromPath("source2.csv", {headers: true})
    .on("data", function(data){
      // console.log(data);
      // added[data.campaign] = null;

      if (!campaigns.hasOwnProperty(data.campaign)) {
        let split = data.campaign.split('_');
        let campaign = {
          initiative: split[0],
          audience: split[1],
          asset: split[2],
        }
        let entry = {
          campaign,
          dates: {},
          spend: 0,
          impressions: 0,
          actions: {},
        }
        campaigns[data.campaign] = entry;
      }
    })
    .on("end", function(){
      console.log("done2");
      // console.log(campaigns);
      readFile1();
    });
}

const readFile1 = () => {
  csv
  .fromPath("source1.csv", {headers: true})
  .on("data", function(data){
    if (campaigns.hasOwnProperty(data.campaign)) {
      let campaign = campaigns[data.campaign];
      if (!campaign.dates.hasOwnProperty(data.date)) {
        campaign.dates[data.date] = null;
        campaign.spend += Number(data.spend);
        campaign.impressions += Number(data.impressions);
        JSON.parse(data.actions).forEach(entry => {
          if (entry.hasOwnProperty("x") || entry.hasOwnProperty("y")) {
            campaign.actions[entry.action] = Number(campaign.actions[entry.action]) + 1 || 1;
          }
        });
      }
    } else {
      let split = data.campaign.split('_');
      let campaign = {
        initiative: split[0],
        audience: split[1],
        asset: split[2],
      }
      let entry = {
        campaign,
        dates: {[data.date]: null},
        spend: Number(data.spend),
        impressions: Number(data.impressions),
        actions: {},
      }
      campaigns[data.campaign] = entry;
      JSON.parse(data.actions).forEach(entry => {
        if (entry.hasOwnProperty("x") || entry.hasOwnProperty("y")) {
          // console.log(entry);
          // if (!campaigns[data.campaign].actions.hasOwnProperty(entry.action)) {
          //   campaigns[data.campaign].actions[entry.action] = 1;
          // } else {
          //   campaigns[data.campaign].actions[entry.action] += 1;
          // }
          campaigns[data.campaign].actions[entry.action] = Number(campaigns[data.campaign].actions[entry.action]) + 1 || 1;
        }
      });
    }
  })
  .on("end", function(){
    console.log("done1");
    analyze();
  });
}

const analyze = () => {
  console.log('analyzing');

  console.log('\nQ: 1. How many unique campaigns ran in February?');
  console.log(`A: ${Object.keys(campaigns).length}`); // 233

  console.log('\nQ: 2. What is the total number of conversions on plants?');
  let plantsAsInitiative = 0;
  for (let key in campaigns) {
    let entry = campaigns[key];
    if (entry.campaign.initiative === 'plants') {
      if (entry.actions.hasOwnProperty('conversions')) {
        plantsAsInitiative += entry.actions.conversions;
      }
    }
  }
  console.log(`A: ${plantsAsInitiative}`); // 1996

  console.log('Q: 3. What audience, asset combination had the least expensive conversions?');


  // for (let entry in campaigns) {
  //   // console.log(campaigns[entry].campaign.initiative);
  //   if (campaigns[entry].campaign.audience === 'plants') {
  //     console.log(campaigns[entry].campaign);
  //   }
  // }
}

main();



// let example = {
//   campaignTriplet: {
//     campaign: {
//       initiate: '', audience: '', asset: ''
//     },
//     dates: {
//       '12345': null,
//       '67890': null,
//     },
//     spend: 0,
//     impressions: 0,
//     actions: [],
//   },
//   etc: {},
// }



          // if (!campaigns[data.campaign].actions[entry.action]) {
          //   campaigns[data.campaign].actions[entry.action] = 1;
          // } else {
          //   campaigns[data.campaign].actions[entry.action] =  + 1;
          // }