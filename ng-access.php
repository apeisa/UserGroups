<!-- all the Angular related markup goes inside this extra wrapper for it to be accessible by AccessApp/AccessCtrl -->
<div xmlns:ng="http://angularjs.org" id="ng-app" ng-app="AccessApp" ng-controller="AccessCtrl">
	<label>
		<input type="radio" name="manage_access" value="1" ng-model="manageAccess" ng-change="init()" />
		{{ i18n.labelManageHere }}
	</label>
	<label>
		<input type="radio" name="manage_access" value="0" ng-model="manageAccess" ng-change="init()" ng-disabled="!inheritPage" />
		<span ng-show="inheritPage">{{ i18n.labelInheritAccess }} <strong>{{ inheritPage.title }}</strong> ({{ inheritPage.path }})</span>
		<span ng-hide="inheritPage" class="NoInherit">{{ i18n.labelNoInherit }}</span>
	</label>

	<div class="AccessTableHeading">{{ i18n.headingTable }}</div>
	<!-- try to look like other tables around here -->
	<table class="AdminDataTable AdminDataList AccessTable">
		<thead>
			<th class="GroupName">{{ i18n.headingUserGroup }}</th>
			<th>{{ i18n.headingDescription }}</th>
			<th class="Narrow">{{ i18n.headingViewPages }}</th>
			<th class="Narrow">{{ i18n.headingEditPages }}</th>
			<th></th>
		</thead>
		<tbody>
			<!-- a row per group with grants -->
			<tr ng-repeat="id in grantedGroups">
				<td>{{ groupInfo[id] }}</td>
				<td>{{ groupDescription[id] }}</td>
				<td><label><input type="checkbox" ng-model="contextViewGroups[id]" ng-change="grantChanged()" ng-disabled="manageAccess==0" /></label></td>
				<td><label><input type="checkbox" ng-model="contextEditGroups[id]" ng-change="grantChanged()" ng-disabled="manageAccess==0 || editDisabledFor[id]" /></label></td>
				<td></td>
			</tr>
		</tbody>
	</table>

	<!-- dropdown for adding new groups to be granted access -->
	<select
		ng-model="selectedGroup"
		ng-change="newGrant()"
		ng-options="id as groupInfo[id] for (id, bogus) in selectableGroups"
		ng-disabled="!selectableGroupCount"
		ng-hide="manageAccess==0">
		<option value="">{{ i18n.labelChooseGroup }}</option>
	</select>

	<!-- hidden multiple select inputs for saving the data -->
	<select name="view_groups[]" multiple="multiple"
		ng-model="viewGroupArray"
		ng-options="id for (id, title) in groupInfo"
		class="ng-hide">
	</select>
	<select name="edit_groups[]" multiple="multiple"
		ng-model="editGroupArray"
		ng-options="id for (id, title) in groupInfo"
		class="ng-hide">
	</select>
</div>
