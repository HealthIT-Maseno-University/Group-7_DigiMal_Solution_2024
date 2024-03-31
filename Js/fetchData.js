document.addEventListener("DOMContentLoaded", () => {  
  var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1IiwianRpIjoiMTM2NDIzYjE2ZjU2ZmQ3OTEyNmZhMTJmNjA1ODUzYTA2ZTMxZTZhZmYyNTZiNjQxZDVmNjAzNDg4YWU5NTc1ZjJjOWFiMzU2ZTQwMWJlMTgiLCJpYXQiOjE3MTE4OTM2MzEuNjQ3OTM1LCJuYmYiOjE3MTE4OTM2MzEuNjQ3OTQxLCJleHAiOjE3MTE5MDA4MzEuNjQyODE5LCJzdWIiOiIyMTA3NTIiLCJzY29wZXMiOltdfQ.kAWV3XmvLuufhBulzhszldCtK8cCJsk8P8MPjmj62pEaGoWOKh-cQXKt4P8QVSSJ5_DGaAH3EYHJZm0kl6kkV2HEbymSTXPTXN4Db1Qdf0fFl2IT1EHFTYj3x7Lo_dsc912uodGxu2yRBk-ya3InSKPrYDr9U_vBy5oBFZ2ViKnL1qA4KcsmZvsz-VBiTuy0FLUlvpSP-wHs8PJJ_x8QpR_VX5LS27jKXesiISZoH4qiYyAjqTCcrru9lYt_FdweaakTurdL9C3gpDkxdk2lG6Vd598y2DoRFEa3NTeZ464u5d4miMIhgvaAo29Lafl2bOXvtj5FJIUzWMQRsxVh9Rfxu6-EHEYZUYFM4Jr4raEeu1NwV86oVaTW54qgXMesP1m9O_Is26cXg_cGIpNMVZKNsGwDV-yoT_RaKv_zaOASDXZ1xVoaKKInzITPe7byfN64hYY4lvqv5drliMZq3JB3tbJcGgSmhjuLnczAE_tWBhWbk54WqNMTgI80w1jxUjorC6trCNmrqEQ6k2EnICegwHufAaaeduRQnw1SSzb707oeh7OqiyU_udQirMt503uHIS58jdvKB67LJPcDVZm7IRA-A8-l3Yhf8W9b5O-to7n_I4zL-cWgsMKYeCFJXXSOArHej0FqI-qoRg_VkekbLI3lRWIF23ohVPWurKU";
  
  //var county = "";
  var villageCoordinates = [];

  // Function to construct URL with parameters
  function get_url(endpoint, params) {
    let url = new URL(`https://training.digimal.uonbi.ac.ke/api/${endpoint}`);
    url.search = new URLSearchParams(params).toString();
    return url;
  }

  //fetching and displaying counties
  fetch('https://training.digimal.uonbi.ac.ke/api/get_counties', {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(response => response.json())
    .then(res => {
      populateDropdown('county_select', res, 'County');              
    })
    .catch(error => console.error("Error fetching data:", error));

  // Function to fetch data and populate dropdown
  function fetchDataAndPopulateDropdown(endpoint, parentId, dropdownId, defaultOptionText) {
    // Fetch data from API
    fetch(get_url(endpoint, { parent_id: parentId }), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(res => {
        if (res && res.message) {
          populateDropdown(dropdownId, res.message, defaultOptionText);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }

  // Function to populate dropdown options
  function populateDropdown(dropdownId, data, defaultOptionText) {
    let dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ''; // Clear existing options
    let defaultOption = document.createElement("option");
    defaultOption.text = defaultOptionText;
    defaultOption.value = "";
    dropdown.add(defaultOption);

    data.forEach(item => {
      let option = document.createElement("option");
      option.text = item.name;
      //console.log(data)
      //getVillageName(15802);
      if(dropdownId == 'village_select'){
        option.value = item.id;        
      }else{
        option.value = item.org_id;
      }
      dropdown.add(option);
    });

    dropdown.disabled = false;
  }


  //get location name
  function getLocation(org_id, distinct){
    fetch('https://training.digimal.uonbi.ac.ke/api/get_org_unit_with_children?org_id='+org_id, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => response.json())
        .then(res => {
          zoomIntoCounty(getFirstWordOfThePlace(res.message[0].name), distinct)
        })
        .catch(error => { console.log('error', error)});

  }

  // Event listener for county selection
  document.getElementById("county_select").addEventListener("change", (e) => {
    let parent_id = e.target.value;
    getLocation(parent_id, 'county')
    fetchDataAndPopulateDropdown("get_sub_counties_list", parent_id, "sub_county_select", "Sub_county");
  });

  // Event listener for sub-county selection
  document.getElementById("sub_county_select").addEventListener("change", (e) => {
      let parent_id = e.target.value;
      getLocation(parent_id, 'sub_county')
      fetchDataAndPopulateDropdown("get_sub_counties_list", parent_id, "ward_select", "Ward");
  });

  // Event listener for ward selection
  document.getElementById("ward_select").addEventListener("change", (e) => {
      let parent_id = e.target.value;
      getLocation(parent_id, 'ward')
      fetchDataAndPopulateDropdown("get_sub_counties_list", parent_id, "location_select", "Location");
  });

  // Event listener for location selection
  document.getElementById("location_select").addEventListener("change", (e) => {
      let parent_id = e.target.value;
      getLocation(parent_id, 'location')
      fetchDataAndPopulateDropdown("get_sub_counties_list", parent_id, "sub_location_select", "Sub Location");
  });

  // Event listener for sub-location selection
  document.getElementById("sub_location_select").addEventListener("change", (e) => {
      let parent_id = e.target.value;
      getLocation(parent_id, 'sub_location')
      fetchDataAndPopulateDropdown("get_sub_counties_list", parent_id, "village_select", "Village");
  });

  // Event listener for village selection
  document.getElementById("village_select").addEventListener("change", (e) => {
    let village_id = e.target.value;    
    console.log(village_id);  
    processVillage(village_id);    
  });
  
  //get village name
  function processVillage(village_id){
    fetch('https://training.digimal.uonbi.ac.ke/api/get_org_unit_with_children?id='+village_id, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => response.json())
        .then(res => {
          locate_village(res.message[0].name, res.message[0].org_id, res.message[0].parent_id)
        })
        .catch(error => { console.log('error', error)});
  }

  //locating the village with village name only in fetching request
  function locate_village(villageName, org_id, parent_id){
    villageName = villageName.replace(/\bvillage\b/gi, '').trim();
    const words = villageName.split(' ');

      if (words.length >= 3) {
        villageName = words.slice(0, 2).join(' ');
      }

      if (villageName) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(villageName)}`)
          .then(response => response.json())
          .then(data => {
            const filteredAddresses = data.filter(element => {
              return element.display_name.includes("Kenya");
            });                   

            if (filteredAddresses.length > 0) {
              show_map_and_pin_location('village', villageName, filteredAddresses[0].lat, filteredAddresses[0].lon, org_id)
            } else {
              locate_village_b(villageName, org_id, parent_id);
            }

          })
          .catch(error => {           

            alert("The village was not found, Enter nearby locations manually on the search bar  i.e location, village:");
              console.error('Error fetching coordinates:', error);
          });
      } else {
          console.error('Village not found');
      }
  }

  function getFirstWordOfThePlace(sentence) {
    if(sentence.includes('Sub County')){
      console.log(sentence.replace(/\b(?:county|sub\scounty)\b/gi, '').trim())
      return sentence.replace(/\b(?:county|sub\scounty)\b/gi, '').trim();
    }else if(sentence.includes('County')){
      console.log(sentence.replace(/\bcounty\b/gi, '').trim())
      return sentence.replace(/\bcounty\b/gi, '').trim();
    }else if(sentence.includes('Ward')){
      console.log(sentence.replace(/\ward\b/gi, '').trim())
      return sentence.replace(/\ward\b/gi, '').trim();
    }else{
      var place = sentence.split(" ");
      return place[0];
    }
  }

  //locating a village with both sub-location and village name in fetching request
  function locate_village_b(villageName, org_id, parent_id){
    var parent_name = '';
    //console.log(parent_id)

    fetch(`https://training.digimal.uonbi.ac.ke/api/get_org_unit_with_children?org_id=${parent_id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => response.json())
    .then(data => {

      //console.log('success fetching parent')
      parent_name = getFirstWordOfThePlace(data.message[0].name);

      villageName = villageName.replace(/\bvillage\b/gi, '').trim();
      newVillageName = getFirstWordOfThePlace(villageName);

      if (newVillageName) {
        var input_query = newVillageName+', '+parent_name;
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input_query)}`)
          .then(response => response.json())
          .then(data => {

            //console.log('success fetching village')
            
            const filteredAddresses = data.filter(element => {
              return element.display_name.includes("Kenya");
            });                   

            if (filteredAddresses.length > 0) {
              show_map_and_pin_location('village', villageName, filteredAddresses[0].lat, filteredAddresses[0].lon, org_id)
            } else {
              alert("The village was not found, Enter nearby locations manually on the search bar  i.e location, village:");
            }

          })
          .catch(error => {
            console.error('Error fetching coordinates:', error);
          });
      } else {
        console.error('Error fetching coordinates:');
      }
    })
    .catch(error => {
      console.error('Error fetching coordinates:', error);
    });

    
  }
});