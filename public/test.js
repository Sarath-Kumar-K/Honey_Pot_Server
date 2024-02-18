function fetchdata() {
  return fetch("data.json").then((res) => res.json());
}
const simpleString = `sarath kumar doss`;
const arr = `["sarath", "kumar", "praveen", "raj", "ganesh"]`;
const obj = `[{
    "name":"sarath",
    "age":21,
    "hobbies":["singing", "dancing", "vibing", "smiling"]
},
{
    "name":"sarath",
    "age":21,
    "hobbies":["singing", "dancing", "vibing", "smiling"]
},
{
    "name":"sarath",
    "age":21,
    "hobbies":["singing", "dancing", "vibing", "smiling"]
}]`;

// const fetch = require('node-fetch');
fetch("../data.json")
  .then(res => res.json())
  .then(data => console.log(data));
