
App = {
  loading: false,
  contracts: {},  
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    //window.alert(App.account);
    
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const Student = await $.getJSON('Student.json')
    App.contracts.Student = TruffleContract(Student)
    App.contracts.Student.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.student = await App.contracts.Student.deployed()
  },
  render: async () => {
    var role=await App.student.roles(App.account);
    window.alert(role);
    if(role=="1"){
      $("#studentdashboard").show();
      $("#teacherdashboard").hide();
      $("#officedashboard").hide();
      $("#registerpage").hide();
    }
    else if(role=="2"){
      $("#studentdashboard").hide();
      $("#teacherdashboard").show();
      $("#officedashboard").hide();
      $("#registerpage").hide();
    }
    else if(role=="3"){
      $("#studentdashboard").hide();
      $("#teacherdashboard").hide();
      $("#officedashboard").show();
      $("#registerpage").hide();
    }
    else{
      $("#studentdashboard").hide();
      $("#teacherdashboard").hide();
      $("#officedashboard").hide();
      $("#registerpage").show();
    }
  }  ,
  showData: async ()=>{
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render();
  }  ,
  updateValues :async () =>{
    var roles=$("#roles").val();      
    await App.student.registerUser(roles,{from :App.account});
    await App.render();   
  },
  showRegisterPage :async ()=>{
   // $("#registerpage").show();
    $("#viewpage").hide();
  },
  showViewPage :async ()=>{
    $("#registerpage").hide();
    $("#viewpage").show();
    $("#disp").empty();
    var total=await App.student.totalUsers();
    for(var i=1;i<=total;i++){
      var st=await App.student.users(parseInt(i));
      var str="<tr><td>"+st[0]+"</td><td>"+st[1]+"</td><td>"+st[2]+"</td></tr>";
       $("#disp").append(str);
    }

  }
}

$(document).ready(async function(){
   await App.load();
});


