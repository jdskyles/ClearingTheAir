let qualityIndex = 0;
let timey;
let context;

const { createDevice } = RNBO;

function someFunc() {
    getData();
    play();
}

 function show() {
            /* Access image by id and change
            the display property to block*/
            document.getElementById('image')
                .style.display = "block";
             document.getElementById('btnID')
                .style.display = "none";
}

async function getData() {

  const url = 'https://airvisual1.p.rapidapi.com/cities/v2/get-information?id=T5tB3QotF9fBS4GQ3&x-user-lang=en-US&x-user-timezone=Americas%2FNew%20York&x-aqi-index=us&x-units-pressure=mbar&x-units-distance=kilometer&x-units-temperature=celsius';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '8800a19684msh366b4fb41ee762ap1ad0d2jsn280d4039d039',
		'X-RapidAPI-Host': 'airvisual1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json(); 
	qualityIndex = result.data.currentMeasurement.aqius;
  console.log(qualityIndex);
  document.getElementById("qindex").innerHTML = "The Air Quality Index is "+ qualityIndex;
  
  timey.value = parseInt(qualityIndex);
  
  show();
  
  } catch (error) {
	  console.error(error);
  }
}

async function setup2() {
    const WAContext = window.AudioContext || window.webkitAudioContext;
    context = new WAContext();

     ////Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);
    

     ////Fetch the exported patchers
    let response = await fetch("coughing.export.json");
    const samplePatcher = await response.json();

     ////Create the devices
    const sampleDevice = await createDevice({context, patcher: samplePatcher });
  
     ////dependency stuff
    let dependencies = await fetch("dependencies.json");
    dependencies = await dependencies.json();

     ////Load the dependencies into the device
    const results = await sampleDevice.loadDataBufferDependencies(dependencies);
    results.forEach(result => {
        if (result.type === "success") {
            console.log(`Successfully loaded buffer with id ${result.id}`);
        } else {
            console.log(`Failed to load buffer with id ${result.id}, ${result.error}`);
        }
    });
  
     ////fetch params
    timey = sampleDevice.parametersById.get("timey");
     ////Connect the devices in series
    sampleDevice.node.connect(outputNode);  
}

setup2();

function play() {
  context.resume();
  timey.value = qualityIndex;
}