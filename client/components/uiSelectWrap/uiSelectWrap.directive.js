'use strict';

angular.module('tempApp')
  .directive('uiSelectWrap', function ($document, uiGridEditConstants) {
    return {
      require: '?^uiGrid',
      link: function (scope, element, attrs, uiGridCtrl) {
        $document.on('click', docClick);
        function docClick(evt) {
          if ($(evt.target).closest('.ui-select-container').size() === 0) {
            scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
            $document.off('click', docClick);
          }
        }
        
        //set focus at start of edit
        scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function (evt, args) {
          //whoa, this is ugly
          scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.selectedRow=scope.row;
          hideOnCellnav();
        });
    
        function hideOnCellnav() {
          
          if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
            var dereg = uiGridCtrl.grid.api.cellNav.on.navigate(scope, function (newRowCol, oldRowCol) {
              if (scope.col.colDef.enableCellEditOnFocus) {
                if (newRowCol.row !== scope.row || newRowCol.col !== scope.col) {
                  scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                 dereg();
               }
              }
           });
         }
        }
      }
    };
  });