'use strict';

angular.module('tempApp')
  .controller('OrderCtrl', function ($scope,$http,Modal,$timeout) {
    this.newItem={};
    this.filter="";
    this.pos=[];
    this.historicalPos=[];
    this.po="1000";
    
    $http.get('/api/orders').then(response=>{
      response.data.forEach(part=>{
        if (part.po&&part.po!==""&&this.historicalPos.indexOf(part.po)<0) this.historicalPos.push(part.po);
      });
      this.historicalPos.sort((a,b)=>{
        return parseInt(b,10)-parseInt(a,10);
      });
      if (this.historicalPos.length>0) this.po=(parseInt(this.historicalPos[0],10)+1).toString();
    });
    
    $http.get('/api/orders/incomplete').then(response=>{
      this.partsOriginal=response.data;
      this.parts=angular.copy(this.partsOriginal);
      this.parts.forEach(part=>{
        part.selected="NO";
        if (this.pos.indexOf(part.po)<0) this.pos.push(part.po);
      });
    });
    
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
    
    this.save=()=>{
      if (this.newItem._id) $http.put('/api/orders/'+this.newItem._id,this.newItem).then(response=>{
        this.quickModal('Item successfully updated');
      });
      else {
          $http.post('/api/orders',this.newItem).then(response=>{
            this.newItem._id=response.data._id;
            this.partsOriginal.push(this.newItem);
            this.applyFilter();
            this.quickModal('Item successfully created');
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
