angular.module('AccessApp', []).controller('AccessCtrl', function($scope) {
	// get data from global config into our scope
	// * viewGroups, editGroups, inheritedViewGroups, inheritedEditGroups,
	// * groupInfo, editDisabledFor, manageAccess, inheritPage, i18n
	for(key in config.AccessData) {
		$scope[key] = config.AccessData[key];
	}

	// when the access tab is being loaded OR
	// when manage_access is changed (here / inherit)...
	$scope.init = function() {
		// groups with grants: array --> show new groups at the bottom easily
		$scope.grantedGroups = [];
		// groups with no grants: object --> keep the list in alphabetical order
		$scope.selectableGroups = {};
		// variable for disabling the dropdown when there's nothing to choose from
		// simple count to avoid more complex size() implementation for objects
		$scope.selectableGroupCount = 0;
		// 'select' directive requires a model (could have done without)
		$scope.selectedGroup = null;

		// $scope.context*Groups holds the current data to be viewed
		// data will be editable only when manage_access == 1
		if($scope.manageAccess == 1) {
			$scope.contextViewGroups = $scope.viewGroups;
			$scope.contextEditGroups = $scope.editGroups;
		} else {
			$scope.contextViewGroups = $scope.inheritedViewGroups;
			$scope.contextEditGroups = $scope.inheritedEditGroups;
		}
		angular.forEach($scope.groupInfo, function(value, key) {
			if(this[key]) {
				$scope.grantedGroups.push(key);
			} else {
				$scope.selectableGroups[key] = true;
				$scope.selectableGroupCount++;
			}
		}, $scope.contextViewGroups);

		$scope.rebuildData();
	}

	// when a group is selected from the dropdown...
	$scope.newGrant = function() {
		// initialize group's grants to view only
		$scope.viewGroups[$scope.selectedGroup] = true;
		$scope.editGroups[$scope.selectedGroup] = false;
		// rebuild data for saving
		$scope.rebuildData();
		// this group has grants now
		$scope.grantedGroups.push($scope.selectedGroup);
		// this group is not selectable anymore
		delete $scope.selectableGroups[$scope.selectedGroup];
		// no group is selected atm
		$scope.selectedGroup = null;
		// one less group to select
		$scope.selectableGroupCount--;
	}

	// when a view/edit checkbox is clicked...
	$scope.grantChanged = function() {
		// no view access --> no grants at all
		if(! $scope.viewGroups[this.id]) {
			// clean up
			delete $scope.viewGroups[this.id];			
			// revoke edit grant from this group too
			delete $scope.editGroups[this.id];
			// this group has no grants anymore
			$scope.grantedGroups.splice(this.$index, 1);
			// this group is selectable again
			$scope.selectableGroups[this.id] = true;
			// one more group to select
			$scope.selectableGroupCount++;
		}
		// rebuild data for saving
		$scope.rebuildData();
	}

	// rebuild data for saving
	$scope.rebuildData = function() {
		var newViewArray = [];
		var newEditArray = [];

		// only fill in data to be saved if access is managed here
		if($scope.manageAccess == 1) {
			angular.forEach($scope.viewGroups, function(value, key) {
				// view_groups[] and edit_groups[] use groupInfo as options
				// --> selected items need to reference items there
				newViewArray.push($scope.groupInfo[key]);
				if($scope.editGroups[key]) {
					newEditArray.push($scope.groupInfo[key]);				
				}
			});
		}
		$scope.viewGroupArray = newViewArray;
		$scope.editGroupArray = newEditArray;
	}

	// initialize internals based on given data
	$scope.init();

});
