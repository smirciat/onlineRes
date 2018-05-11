'use strict';

angular.module('tempApp')
  .controller('InventoryCtrl', function ($scope,$http,Modal,$timeout) {
    $timeout(()=> { $('#mainFocus').focus(); },0);
    this.newItem={};
    this.filter="";
    this.prefix="9957";
    this.keys = "";
    this.bcOptions={
      width: 1.3,
      height: 100,
      quite: 10,
      displayValue: false,
      font: "monospace",
      textAlign: "center",
      fontSize: 12,
      backgroundColor: "",
      lineColor: "#000"
    };
    
    $http.get('/api/inventory').then(response=>{
      this.partsOriginal=response.data;
      this.parts=angular.copy(this.partsOriginal);
    });
    
    this.keyPressed = (event)=>{
      $timeout(()=>{
          var barcodeIsDone=false;
          if(event.key == "Enter"){
              barcodeIsDone = true;
          }else{
              this.keys = this.keys + event.key;
              barcodeIsDone = false;
          }
          if(barcodeIsDone){
              this.scanner_input = this.keys;
              barcodeIsDone = false;
              this.keys = "";
          }
      },0);
    };
    
    $scope.$watch('inventory.keys', value=> {
      $timeout(function(){
          $scope.inventory.keys = "";
          $scope.inventory.scanner_input = "";
      }, 100);
    });
    
    $scope.$watch('inventory.scanner_input', value=> {
      console.log("Scanned Value = " + value);
      if (value&&value.substring(0,4)===this.prefix) {
        var itemArr=this.partsOriginal.filter(part=>{
          return part.upc.toString()===value;
        });
        if (itemArr.length>0) this.newItem = itemArr[0];
      }
    });
    
    this.generateUPC=()=>{
      var rnd=Math.floor(Math.random()*100000).toString();
      switch (rnd.length){
        case 4: rnd='0'+rnd;
          break;
        case 3: rnd='00'+rnd;
          break;
        case 2: rnd='000'+rnd;
          break;
        case 2: rnd='000'+rnd;
          break;
        default:
          break;
      }
      return $http.post('/api/inventory/check',{upc:(this.prefix+rnd)}).then(response=>{
        return this.generateUPC();
      },response=>{
        return this.prefix+rnd;
      }); 
    };
    
    this.quickModal=Modal.confirm.quickMessage();
    
    this.useModal = Modal.confirm.enterData(formData =>{
      this.newItem.countOnHand-=parseInt(formData.data,10);
      if (this.newItem._id){
        $http.put('/api/inventory/'+this.newItem._id,this.newItem).then(response=>{
          this.quickModal("Item Count Updated Successfully");
          //test if minimum count is reached
          if (this.newItem.minimumCount>=this.newItem.countOnHand) this.quickModal("You need to order more, use the green order button on the right side");
        });
      }
    });
    
    this.orderSubmit=(formData)=>{
      var orderItem=angular.copy(this.newItem);
      orderItem.countOnOrder=formData.data;
      orderItem._id=undefined;
      $http.post('/api/orders',orderItem).then(response=>{
        this.quickModal('Order Updated Successfully.  Check "Parts Order" link to view the order so far');
      });
    };
    
    this.orderModal = Modal.confirm.enterData(formData =>{
      this.newItem.countOnOrder+=parseInt(formData.data,10);
      if (this.newItem._id){
        $http.put('/api/inventory/'+this.newItem._id,this.newItem).then(response=>{
          this.orderSubmit(formData);
        });
      }
      else this.orderSubmit(formData);
    });
    
    this.applyFilter=()=>{
      if (!this.filter||this.filter==="") this.parts=angular.copy(this.partsOriginal);
      else {
        this.parts=this.partsOriginal.filter(part=>{
          var newFilter=this.filter.replace(/-|\s/g,"");
          var length=newFilter.length;
          if (!part.part) part.part="";
          var tempPart=part.part.replace(/[-\s]/g,"").substring(0,length);
          var descriptionMatch=tempPart.toUpperCase()===newFilter.toUpperCase();
          var filterArr=this.filter.split(' ');
          if (filterArr.length>0) newFilter=filterArr[0];
          length=newFilter.length;
          var descriptionArray=part.description.split(" ");
          if (descriptionArray.length>0) {
            descriptionArray.forEach(description=>{
              if (description.substring(0,length).toUpperCase()===newFilter.toUpperCase()) descriptionMatch=true;
            });
          }
          return descriptionMatch;
        });
      }
    };
    
    this.correct=()=>{
      if (this.newItem._id) $http.put('/api/inventory/'+this.newItem._id,this.newItem).then(response=>{
        this.quickModal('Item successfully updated');
      });
      else {
        this.generateUPC().then(response=>{
          this.newItem.upc=response;
          $http.post('/api/inventory',this.newItem).then(response=>{
            this.newItem._id=response.data._id;
            this.partsOriginal.push(this.newItem);
            this.applyFilter();
            this.quickModal('Item successfully created');
          });
        });
      }
    };
    
    this.edit=(part)=>{
      this.newItem=part;
    };
    
    this.clear=()=>{
      this.newItem={};
    };
  });
