import { Injectable } from '@angular/core';
import { ConfigService } from './config.service'

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  urlObject: any;
  constructor(configService: ConfigService) {

    

  //  let urlString = 'http://' + configService.HOST + ':' + configService.PORT + '/teamiumapp/';
      
    //  let urlString = 'http://' + configService.HOST + ':' + configService.PORT + '/';

   let urlString = 'http://' + configService.HOST + ':' + configService.PORT + '/teamiumapp/';
      


    this.urlObject = {
      'login': {
        'method': 'POST',
        'url': urlString + 'oauth/token'
      },
      'logout': {
        'method': 'POST',
        'url': urlString + 'user/logout'
      },
      'changestatus': {
        'method': 'PUT',
        'url': urlString + 'user/login-status'
      },
      'getstatus': {
        'method': 'GET',
        'url': urlString + 'user/login-status'
      },
      'getEquipments': {
        'method': 'GET',
        'url': urlString + 'equipment'
      }, 'getPersonals': {
        'method': 'GET',
        'url': urlString + 'staff'
      },'getAvailablePersonals': {
        'method': 'GET',
        'url': urlString + 'staff/available'
      },
       'getPersonalById': {
        'method': 'GET',
        'url': urlString + 'staff'
      }, 'getPersonalDropdownData': {
        'method': 'GET',
        'url': urlString + 'staff/dropdown'
      }, 'getPersonalReel': {
        'method': 'GET',
        'url': urlString + 'staff'
      }, 'savePersonalReel': {
        'method': 'POST',
        'url': urlString + 'staff'
      },
      'getEquipmentById': {
        'method': 'GET',
        'url': urlString + 'equipment/'
      },
      'getEquipmentDropdownData': {
        'method': 'GET',
        'url': urlString + 'equipment/dropdown'
      },
      'getEquipmentForPackage': {
        'method': 'GET',
        'url': urlString + 'package/equipment/'
      },
      'deleteEquipment': {
        'method': 'DELETE',
        'url': urlString + 'equipment/'
      },
      'savePackage': {
        'method': 'POST',
        'url': urlString + 'package/'
      },
      'getEquipmentForSeletedPacakge': {
        'method': 'GET',
        'url': urlString + 'package/'
      },
      'getPersonnelById': {
        'method': 'GET',
        'url': urlString + 'staff/'
      },
      'saveEquipment': {
        'method': 'POST',
        'url': urlString + 'equipment'
      },
      'uploadPicture': {
        'method': 'POST',
        'url': urlString + 'upload/picture/'
      },
      'uploadAttachment': {
        'method': 'POST',
        'url': urlString + 'upload/attachment/'
      },
      'deleteAttachments': {
        'method': 'DELETE',
        'url': urlString + 'upload/attachment/'
      },
      'getPersonnelDropdownData': {
        'method': 'GET',
        'url': urlString + 'staff/dropdown'
      },
      'deleteReel': {
        'method': 'DELETE',
        'url': urlString + 'staff/reel/'
      },
      'getLoggedInUser': {
        'method': 'GET',
        'url': urlString + 'staff/logged-in-user'
      },

      'savePersonnel': {
        'method': 'POST',
        'url': urlString + 'staff'
      },
      'deletePersonnel': {
        'method': 'DELETE',
        'url': urlString + 'staff/'
      },
      'getProjectsByStatus': {
        'method': 'GET',
        'url': urlString + 'budget/status'
      },
      'getRecentViewedProjects': {
        'method': 'GET',
        'url': urlString + 'budget/recent/0'
      },
      'getFunctionDropdown': {
        'method': 'GET',
        'url': urlString + 'function/dropdown'
      },
      'getFunctionList': {
        'method': 'GET',
        'url': urlString + 'function/roots'
      },
      'saveFunction': {
        'method': 'POST',
        'url': urlString + 'function'
      },
      'deleteFunction': {
        'method': 'DELETE',
        'url': urlString + 'function'
      },
      'getAllFunctions': {
        'method': 'GET',
        'url': urlString + 'resource/functions'
      },
      'getAllAvailableFunctions': {
        'method': 'GET',
        'url': urlString + 'resource/functions/available'
      },
      'getAllEvents': {
        'method': 'GET',
        'url': urlString + 'event/by-function'
      },
      "saveOrUpdateEvent": {
        'method': 'POST',
        'url': urlString + 'event'
      },
      "assignEventToLoggedInUser": {
        'method': 'POST',
        'url': urlString + 'event/assign/to/logged-in-user'
      },
      "unassignResourceOnBooking": {
        'method': 'POST',
        'url': urlString + 'booking/unassign/resource/'
      },
      "getProjectResources": {
        'method': 'GET',
        'url': urlString + 'booking/function/by-project'
      },
      "addOrderFormOnBooking": {
        'method': 'POST',
        'url': urlString + 'booking/add/order-form/'
      },
      "getAvailableOrderForms": {
        'method': 'GET',
        'url': urlString + 'booking/booking-order-form/by-order-type'
      },
      "removeOrderFormOnBooking": {
        'method': 'POST',
        'url': urlString + 'booking/remove/order-form/'
      },
      "changeStatusOfOrderForm": {
        'method': 'POST',
        'url': urlString + 'booking/order-form/change-status'
      },
      "getProjectsEvent": {
        'method': 'GET',
        'url': urlString + 'event/by-project'
      },
      'getProjectById': {
        'method': 'GET',
        'url': urlString + 'budget/'
      },
      'getProjectDropdown': {
        'method': 'GET',
        'url': urlString + 'budget/dropdown'
      },
      'saveBudget': {
        'method': 'POST',
        'url': urlString + 'budget'
      },
      'createProjectBooking': {
        'method': 'POST',
        'url': urlString + 'project/booking'
      },
      'sendForgotPasswordLink': {
        'method': 'POST',
        'url': urlString + 'password/recovery-request'
      },
      'verifyRecoveryLink': {
        'method': 'POST',
        'url': urlString + 'password/recovery-link/validate'
      },
      'resetPassword': {
        'method': 'POST',
        'url': urlString + 'password/recover'
      },

      //ratecard
      'getRatesByFunction': {
        'method': 'GET',
        'url': urlString + 'rate/function/'
      },

      'getBookingByBookingId': {
        'method': 'GET',
        'url': urlString + 'project/'
      },

      'linkOrUnlinBookingEvents': {
        'method': 'POST',
        'url': urlString + 'event/link'
      },
      'getAllLinkinedBookingEvents': {
        'method': 'GET',
        'url': urlString + 'event/link'
      },
      'getProjectByBudget': {
        'method': 'GET',
        'url': urlString + 'project/booking'
      },
      'saveBookingEvents': {
        'method': 'POST',
        'url': urlString + 'booking/events'
      },
      'projectBasicInfo': {
        'method': 'GET',
        'url': urlString + 'project/info'
      }, 'copyEvent': {
        'method': 'POST',
        'url': urlString + 'event/copy'
      },
      'findBudgetIdFromProjectId': {
        'method': 'GET',
        'url': urlString + 'project/budget-id'
      },
      'splitEvent': {
        'method': 'POST',
        'url': urlString + 'event/split'
      },
      'findBookingEventFromLineId': {
        'method': 'GET',
        'url': urlString + 'booking/by-origin'
      },
      'changesProjectStatus': {
        'method': 'Post',
        'url': urlString + '/budget/change/status'
      }
      ,
      "deleteBudget": {
        'method': 'DELETE',
        'url': urlString + 'budget/'
      },
      "saveProject": {
        'method': 'POST',
        'url': urlString + 'project'
      },
      "deleteProject": {
        'method': 'DELETE',
        'url': urlString + 'project/'
      },
      "applyDateToAllLinesOnBuduget": {
        'method': 'POST',
        'url': urlString + 'budget/apply-date-to-all/'
      },
      "applyDateToAllLinesOnProject": {
        'method': 'POST',
        'url': urlString + 'project/apply-date-to-all/'
      },
      "addLineToBudget": {
        'method': 'POST',
        'url': urlString + 'budget/line/'
      },
      "addLineToProject": {
        'method': 'POST',
        'url': urlString + 'project/line/'
      },
      "addGroupOnBooking": {
        'method': 'POST',
        'url': urlString + 'booking/add-to-group/'
      },
      "removeGroupOnBooking": {
        'method': 'POST',
        'url': urlString + 'booking/remove-group/'
      },
      "getBookingsByLoggedInGroups": {
        'method': 'GET',
        'url': urlString + 'booking/by-logged-in-user-group'
      },
      "getBookingsByLoggedInUser": {
        'method': 'GET',
        'url': urlString + 'booking/by-logged-in-user/'
      },
      "startOrEndUserBookingTime": {
        'method': 'POST',
        'url': urlString + 'booking/add/start-or-end-time/'
      },
      "changeCompletionTimeOnBooking": {
        'method': 'POST',
        'url': urlString + 'booking/change-completion/'
      },

      'getClients': {
        'method': 'GET',
        'url': urlString + 'client'
      },
      'getClient': {
        'method': 'GET',
        'url': urlString + 'client'
      },
      'saveClient': {
        'method': 'POST',
        'url': urlString + 'client'
      },
      'getClientDropdown': {
        'method': 'GET',
        'url': urlString + 'client/dropdown'
      },
      'deleteClient': {
        'method': 'DELETE',
        'url': urlString + 'client'
      },
      'getAllLinkEventID': {
        'method': 'GET',
        'url': urlString + 'event/link'
      },
      'deleteLineFromBudget': {
        'method': 'DELETE',
        'url': urlString + 'budget/line/'
      },
      'deleteLineFromBokking': {
        'method': 'DELETE',
        'url': urlString + 'project/line/'
      },
      
      'getRecentViewedShows': {
        'method': 'GET',
        'url': urlString + 'show/recent/0'
      },
      'getShowsByStatus': {
        'method': 'GET',
        'url': urlString + 'show/status'
      },

      'getVendors': {
        'method': 'GET',
        'url': urlString + 'vendor'
      },
      'saveVendor': {
        'method': 'POST',
        'url': urlString + 'vendor'
      },
      'deleteVendor': {
        'method': 'DELETE',
        'url': urlString + 'vendor'
      },

      'saveShow': {
        'method': 'POST',
        'url': urlString + 'show'
      },
      'addLineToShow': {
        'method': 'POST',
        'url': urlString + 'show/line/'
      },
      'deleteLineFromShow': {
        'method': 'DELETE',
        'url': urlString + 'show/line/'
      },
      'createAllSessions': {
        'method': 'POST',
        'url': urlString + 'show/session/all/'
      },
      'createSession': {
        'method': 'POST',
        'url': urlString + 'show/session/'
      },
      'deleteShow': {
        'method': 'DELETE',
        'url': urlString + 'show/'
      },
      'getShowById': {
        'method': 'GET',
        'url': urlString + 'show/'
      },
      'getVendorDropdown': {
        'method': 'GET',
        'url': urlString + 'vendor/dropdown'
      },
      'rosterEvent': {
        'method': 'GET',
        'url': urlString + 'event'
      },
      'saveOrUpdateRosterEvent': {
        'method': 'POST',
        'url': urlString + 'roster-event'
      },
      'getAllRosterEvent': {
        'method': 'GET',
        'url': urlString + 'roster-event'
      },
      'deleteRosterEventById': {
        'method': 'DELETE',
        'url': urlString + 'roster-event/'
      },
      'pasteRosterEvent': {
        'method': 'POST',
        'url': urlString + 'roster-event/copy/'
      },
      'getEventForAllProject': {
        'method': 'GET',
        'url': urlString + 'event/project'
      },
      'getProjectEvent': {
        'method': 'GET',
        'url': urlString + 'budget/event'
      },
      'saveProjectEvent': {
        'method': 'POST',
        'url': urlString + 'budget/event'
      },
      'getAllProgramEvent': {
        'method': 'GET',
        'url': urlString + 'show/event'
      },

      'rate': {
        'method': 'GET',
        'url': urlString + 'rate'
      },
      'rateById': {
        'method': 'GET',
        'url': urlString + 'rate/'
      },
      'deleteRateById': {
        'method': 'DELETE',
        'url': urlString + 'rate/'
      },
      'addRate': {
        'method': 'POST',
        'url': urlString + 'rate'
      },
      'getAllDropdown': {
        'method': 'GET',
        'url': urlString + 'rate/dropdown'
      },
      'editRateCardById': {
        'method': 'POST',
        'url': urlString + 'rate/'
      },
      "applyDateToAllLinesOnShow": {
        'method': 'POST',
        'url': urlString + 'show/apply-date-to-all/'
      },
      'saveNewTemplate': {
        'method': 'POST',
        'url': urlString + 'budget/template/'
      },
      "addTemplateToBudget": {
        'method': 'POST',
        'url': urlString + '/budget/apply/template/'

      },
      'saveNewTemplateToBooking': {
        'method': 'POST',
        'url': urlString + 'project/template/'
      },
      "addTemplateToBooking": {
        'method': 'POST',
        'url': urlString + '/project/apply/template/'
      },
      "printPDFForBudget": {
        'method': 'GET',
        'url': urlString + 'budget/pdf'
      },

      "createOrder": {
        'method': 'POST',
        'url': urlString + '/order'
      },
      "updateOrder": {
        'method': 'POST',
        'url': urlString + '/order/update'
      },
      "loggedInUser": {
        'method': 'GET',
        'url': urlString + 'staff/logged-in-user'
      },
      "getOrdersByProjectId": {
        'method': 'GET',
        'url': urlString + '/order/by-project/'
      },
      "getProcurmentByProjectId": {
        'method': 'GET',
        'url': urlString + '/project/procurment/'
      },
      "printPDFForBooking": {
        'method': 'POST',
        'url': urlString + 'project/pdf/callsheet'
      },
      "printPDFForPackingList": {
        'method': 'POST',
        'url': urlString + 'project/pdf/packing'
      },
      "printPDFForProductionStatement": {
        'method': 'GET',
        'url': urlString + 'project/pdf/production'
      },
      "printPDFForOrder": {
        'method': 'GET',
        'url': urlString + 'order/pdf'
      },
      "getLabourRule": {
        'method': 'GET',
        'url': urlString + 'labour-rule/'
      },
      "saveLabourRule": {
        'method': 'POST',
        'url': urlString + 'labour-rule/'
      },
      "saveLabourRuleHoliday": {
        'method': 'POST',
        'url': urlString + 'labour-rule/holiday/'
      },
      "saveLabourRuleStaff": {
        'method': 'POST',
        'url': urlString + 'labour-rule/staff-member/'
      },
      "getContractDetailsById": {
        'method': 'GET',
        'url': urlString + 'project'
      },
      "updateContractById": {
        'method': 'PUT',
        'url': urlString + 'contract'
      },
      "deleteLabourRuleHoliday": {
        'method': 'DELETE',
        'url': urlString + 'labour-rule/holiday/'
      },
      "deleteLabourRuleStaff": {
        'method': 'DELETE',
        'url': urlString + 'labour-rule/staff-member/'
      },
      'getCompany': {
        'method': 'GET',
        'url': urlString + 'company'
      },
      'saveCompany': {
        'method': 'POST',
        'url': urlString + 'company'
      },
      'getSignatureData': {
        'method': 'Get',
        'url': urlString + 'digital-signature/envelope'
      },
      "uploadEquipementSheet": {
        'method': 'POST',
        'url': urlString + 'equipment/upload/spreadsheet'
      },
      "uploadStaffSheet": {
        'method': 'POST',
        'url': urlString + 'staff/upload/spreadsheet'
      },
      "uploadClientSheet": {
        'method': 'POST',
        'url': urlString + 'client/upload/spreadsheet'
      },
      "uploadVendorSheet": {
        'method': 'POST',
        'url': urlString + 'vendor/upload/spreadsheet'
      },
      "getTeamplateData": {
        'method': 'GET',
        'url': urlString + 'configuration/edition-template'
      },
      "saveSignatureData": {
        'method': 'POST',
        'url': urlString + 'digital-signature/envelope'
      },
      'getGroups': {
        'method': 'GET',
        'url': urlString + 'configuration/group'
      },
      'saveGroup': {
        'method': 'POST',
        'url': urlString + 'configuration/group'
      },
      'deleteGroup': {
        'method': 'DELETE',
        'url': urlString + 'configuration/group'
      }, "saveOrUpdateUserBooking": {
        'method': 'POST',
        'url': urlString + 'user-booking'
      },
      "findUserBookingByUser": {
        'method': 'GET',
        'url': urlString + 'user-booking'
      },
      "deleteUserBooking": {
        'method': 'DELETE',
        'url': urlString + 'user-booking'
      },
      "findWeeklyWorkingDuration": {
        'method': 'GET',
        'url': urlString + 'user-booking/week'
      },
      "deleteCompany": {
        'method': 'DELETE',
        'url': urlString + 'company'
      },
      "deleteLabourRule": {
        'method': 'DELETE',
        'url': urlString + 'labour-rule'
      },
      "getFormat": {
        'method': 'GET',
        'url': urlString + 'configuration/format'
      },
      "saveFormat": {
        'method': 'POST',
        'url': urlString + 'configuration/format'
      },
      "deleteFormat": {
        'method': 'DELETE',
        'url': urlString + 'configuration/format'
      },
      "getCategory": {
        'method': 'GET',
        'url': urlString + 'configuration/category'
      },
      "saveCategory": {
        'method': 'POST',
        'url': urlString + 'configuration/category'
      },
      "deleteCategory": {
        'method': 'DELETE',
        'url': urlString + 'configuration/category'
      },
      "getProjectMilestone": {
        'method': 'GET',
        'url': urlString + 'configuration/milestone/project'
      },
      "saveProjectMilestone": {
        'method': 'POST',
        'url': urlString + 'configuration/milestone'
      },
      "deleteProjectMilestone": {
        'method': 'DELETE',
        'url': urlString + 'configuration/milestone/project'
      },
      'getAllEventsByGroup': {
        'method': 'GET',
        'url': urlString + 'event/by-group'
      },
      "getEquipmentMilestone": {
        'method': 'GET',
        'url': urlString + 'configuration/milestone/equipment'
      },
      "saveEquipmentMilestone": {
        'method': 'POST',
        'url': urlString + 'configuration/milestone'
      },
      "deleteEquipmentMilestone": {
        'method': 'DELETE',
        'url': urlString + 'configuration/milestone/equipment'
      },
      "deleteEnvelope": {
        'method': 'DELETE',
        'url': urlString + 'digital-signature/envelope'
      },

      "getExpensesReportByStaffMemberId": {
        'method': 'GET',
        'url': urlString + '/perosnal-expenses-report/by-staff-member'
      },
      "getProjectsForExpensesReport": {
        'method': 'GET',
        'url': urlString + '/perosnal-expenses-report/projects/by-staff-member/'
      },
      "saveOrUpdateExpensesReport": {
        'method': 'POST',
        'url': urlString + '/perosnal-expenses-report'
      },
      "deleteExpensesReport": {
        'method': 'DELETE',
        'url': urlString + '/perosnal-expenses-report/'
      },
      "changesExpensesReportStatus": {
        'method': 'POST',
        'url': urlString + '/perosnal-expenses-report/change-status'
      },

      "findAllProjectTodoOrProgress": {
        'method': 'GET',
        'url': urlString + 'project/progress'
      },
      "saveBookingFromUserScheduler": {
        'method': 'POST',
        'url': urlString + 'user-booking/time-report'
      },
      "createRecurrenceEvent": {
        'method': 'POST',
        'url': urlString + 'event/recurrence'
      },
      "getPersonnelDocument": {
        'method': 'GET',
        'url': urlString + 'configuration/document-type'
      },
      "savePersonnelDocument": {
        'method': 'POST',
        'url': urlString + 'configuration/document-type'
      },
      "deletePersonnelDocument": {
        'method': 'DELETE',
        'url': urlString + 'configuration/document-type'
      },
      "getAllChannels": {
        'method': 'GET',
        'url': urlString + 'configuration/channel'
      },
      "saveOrUpdateChannel": {
        'method': 'POST',
        'url': urlString + 'configuration/channel'
      },
      "getChannelById": {
        'method': 'GET',
        'url': urlString + '/configuration/channel'
      },
      "deleteChannel": {
        'method': 'DELETE',
        'url': urlString + '/configuration/channel'
      },
      "getAllLeaveType": {
        'method': 'GET',
        'url': urlString + '/leave-type'
      },
      "saveOrUpdateLeaveType": {
        'method': 'POST',
        'url': urlString + '/leave-type'
      },
      "inActivateLeaveType": {
        'method': 'DELETE',
        'url': urlString + '/leave-type'
      },
      "findUserLeaveRecordByStaffId": {
        'method': 'GET',
        'url': urlString + '/user-leave-record'
      },
      "saveOrUpdateUserLeaveRecord": {
        'method': 'POST',
        'url': urlString + '/user-leave-record/leave-record'
      },
      "saveOrUpdateUserLeaveRequest": {
        'method': 'POST',
        'url': urlString + '/user-leave-record/leave-request'
      },

      "changeStatusOfLeaveRequest": {
        'method': 'POST',
        'url': urlString + '/user-leave-record/leave-request/status'
      },
      "getBookingOrderFormList": {
        'method': 'GET',
        'url': urlString + '/configuration/booking-order-form'
      },
      "saveBookingOrderForm": {
        'method': 'POST',
        'url': urlString + '/configuration/booking-order-form'
      },
      "deleteBookingOrderFormById": {
        'method': 'DELETE',
        'url': urlString + '/configuration/booking-order-form/'
      },
      "getProjectVolumeCharData": {
        'method': 'GET',
        'url': urlString + '/dashboard/booking-volume'
      },
      "getProjectVolumeSpreadsheetData": {
        'method': 'GET',
        'url': urlString + '/dashboard/booking-volume/export'
      },
      "getProjectRevenueData": {
        'method': 'GET',
        'url': urlString + 'dashboard/project-revenue'
      },
      "getProjectRevenueSpreadsheetData": {
        'method': 'GET',
        'url': urlString + '/dashboard/project-revenue/export'
      },
      "dashboadActualComparison":{
        'method':'GET',
        'url':urlString+'/dashboard/actual-comparison'
      },
      "getActualVolumnSpreadsheetData":{
        'method':'GET',
        'url':urlString+'/dashboard/actual-comparison/export'
      },
      "getBusinessFunctionCharData": {
        'method': 'GET',
        'url': urlString + '/dashboard/project-bussiness-function'
      },
      "getBusinessFunctionSpreadsheetData": {
        'method': 'GET',
        'url': urlString + '/dashboard/project-bussiness-function/export'
      },
      "getPersonnelSkill": {
        'method': 'GET',
        'url': urlString + 'configuration/skill'
      },
      "savePersonnelSkill": {
        'method': 'POST',
        'url': urlString + 'configuration/skill'
      },
      "deletePersonnelSkill": {
        'method': 'DELETE',
        'url': urlString + 'configuration/skill'
      },
      "dashboadActualDataApi":{
        'method':'GET',
        'url':urlString+'/dashboard/project-actual'
      },
      "getProjectActualSpreadsheetData":{
        'method':'GET',
        'url':urlString+'/dashboard/project-actual/export'
      },
      "printPDFForShowBudget": {
        'method': 'GET',
        'url': urlString + 'show/budget/pdf'
      },
      "dashboadBudgetDataApi":{
        'method':'GET',
        'url':urlString+'/dashboard/project-budgeting'
      },
      "getProjectBudgetSpreadsheetData":{
        'method':'GET',
        'url':urlString+'/dashboard/project-budgeting/export'
      },
      "getEditionTemplates":{
        'method':'GET',
        'url':urlString+'configuration/edition-template'        
      },
      "saveEditionTemplate":{
        'method':'POST',
        'url':urlString+'configuration/edition-template'        
      },
      "getEditionTemplatesById":{
        'method':'GET',
        'url':urlString+'configuration/edition-template'        
      },
      "deleteEditionTemplates":{
        'method':'DELETE',
        'url':urlString+'configuration/edition-template'        
      },
      "getFunctionUses":{
        'method':'GET',
        'url':urlString+'dashboard/functional-uses'        
      },
      "getFunctionSpreadsheetData":{
        'method':'GET',
        'url':urlString+'dashboard/functional-uses/export'        
      },
      "getKeywordList":{
        'method':'GET',
        'url':urlString+'configuration/keyword'        
      },
      "getKeywordById":{
        'method':'GET',
        'url':urlString+'configuration/keyword/'        
      },
      "deleteKeywordById":{
        'method':'DELETE',
        'url':urlString+'configuration/keyword/'        
      },
      "saveKeyword":{
        'method':'POST',
        'url':urlString+'configuration/keyword'        
      },
      "getCurrencyList":{
        'method':'GET',
        'url':urlString+'configuration/currency'        
      },
      "getCurrencyById":{
        'method':'GET',
        'url':urlString+'configuration/currency/'        
      },
      "getActiveCurrencyList":{
        'method':'GET',
        'url':urlString+'configuration/currency/status'        
      },
      "saveCurrency":{
        'method':'POST',
        'url':urlString+'configuration/currency'        
      },
      "saveCurrencyList":{
        'method':'POST',
        'url':urlString+'configuration/currency/list/update'        
      },
      "getTimeReportByWeek":{
        'method':'GET',
        'url':urlString+'/dashboard/week/time-report/export'     
      },
      "getAnnualPersonnelTimeReport":{
        'method':'GET',
        'url':urlString+'/dashboard/annual-personnel/time-report/export'     
      },
      "getWeeklyPersonnelTimeReport":{
        'method':'GET',
        'url':urlString+'/dashboard/weekly-personnel/time-report/export'     
      },
      "editUserProfile":{
        'method':'POST',
        'url':urlString+'/staff/edit-profile/'     
      },
      "getAllTimeZone":{
        'method':'GET',
        'url':urlString+'/time-zone'     
      },
      "getDigitalSignature":{
        'method':'GET',
        'url':urlString+'staff/digital-signature/'     
      },
      "saveDigitalSignature":{
        'method':'POST',
        'url':urlString+'staff/digital-signature'     
      },
      "getBookingConflictData":{
        'method':'GET',
        'url':urlString+'dashboard/booking-conflict'
      },
      "getExpensesReport":{
        'method':'GET',
        'url':urlString+'perosnal-expenses-report/pdf/expensereport/'
      }
    }
  }
}

