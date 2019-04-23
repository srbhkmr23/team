export const SidebarMenuItem = [
  {
    'title': 'Dashboard', 'img': '../../assets/img/dash-icon.png', 'activeImg': '../../assets/img/dash-icon-active.png', 'defaultUrl': '/teamium/dashboard', 'defaultSubmenuUrl': '/teamium/dashboard', 'defalutSubmenuOpen': 'true', 'children': [

      { title: 'Home', link: '/teamium/dashboard' },
      { title: 'User Dashboard', link: '/teamium/schedule-user' },
      { title: 'Vendor Dashboard', link: '/teamium/vendor-dashboard' },
      { title: 'Widgets', link: '/teamium/user-dashboard' },
      { title: 'Sequential Booking', link: '/teamium/dashboard-booking' },
    
    ]
  },
  {
    'title': 'Shows', 'img': '../../assets/img/sidebar/bar-icon.png', 'activeImg': '../../assets/img/sidebar/bar-icon-active.png', 'defaultUrl': '/teamium/show-list', 'defaultSubmenuUrl': '/teamium/show-edit', 'children': [
      { 'title': 'Budgeting', 'link': '/teamium/show-edit', 'pathVariable': 1, 'pathAttributes': ['showId'] , 'defaultSubmenuUrl': '/teamium/show-budgeting/call-sheet', 'subPathAttributes': ['showId'], 'children': [
        { 'title': 'Quotation', 'link': '/teamium/show-budgeting/call-sheet', 'pathVariable': 1, 'pathAttributes': ['showId'] },
      ]
    
      },
      { 'title': 'Project', 'link': '/teamium/show-projects', 'pathVariable': 1, 'pathAttributes': ['showId'] },
      { 'title': 'Scheduling' },
      { 'title': 'Calendar' },
      { 'title': 'Financial' },
    ]
  },
  {
    'title': 'Projects', 'img': '../../assets/img/sidebar/folder-icon.png', 'activeImg': '../../assets/img/sidebar/folder-icon-active.png', 'defaultUrl': '/teamium/project-list', 'defaultSubmenuUrl': '/teamium/project-budgeting', 'pathVariable': 1, 'children': [

      {
        'title': 'Budgeting', 'link': '/teamium/project-budgeting', 'pathVariable': 1, 'pathAttributes': ['budgetId'], 'defaultSubmenuUrl': '/teamium/budgeting/call-sheet', 'subPathAttributes': ['budgetId'], 'children': [
          { 'title': 'Quotation', 'link': '/teamium/budgeting/call-sheet', 'pathVariable': 1, 'pathAttributes': ['budgetId'] },
        ]
      },
      {
        'title': 'Booking', 'link': '/teamium/project-booking', 'pathVariable': 1, 'pathAttributes': ['projectId'], 'defaultSubmenuUrl': '/teamium/booking/call-sheet', 'subPathAttributes': ['projectId'], 'children': [
          { 'title': 'CallSheet', 'link': '/teamium/booking/call-sheet', 'pathVariable': 1, 'pathAttributes': ['projectId'] },
          { 'title': 'Packing List', 'link': '/teamium/booking/packing-list', 'pathVariable': 1, 'pathAttributes': ['projectId'] },
          { 'title': 'Production Statement', 'link': '/teamium/booking/production-statement', 'pathVariable': 1, 'pathAttributes': ['projectId'] }
        ]
      },
      { 'title': 'Scheduling', 'link': '/teamium/project-scheduler', 'pathVariable': 1, 'pathAttributes': ['projectId'] },

      { 'title': 'Calendar' },

      { 'title': 'Contract', 'link': '/teamium/freelance-contract', 'pathVariable': 1, 'pathAttributes': ['projectId'] },

      {
        'title': 'Procurement', 'link': '/teamium/project-procurement', 'pathVariable': 1, 'pathAttributes': ['projectId'], 'defaultSubmenuUrl': '/teamium/purchase-order', 'subPathAttributes': ['projectId'], 'children': [
          { 'title': 'Purchase Order', 'link': '/teamium/purchase-order', 'pathVariable': 1, 'pathAttributes': ['projectId'] }
        ]
      },

      { 'title': 'Financial', 'link': '/teamium/project-financial' },
      { 'title': 'Sequential Bookings', 'link': '/teamium/sequential-booking', 'pathVariable': 1, 'pathAttributes': ['projectId'] },
      { 'title': 'Invoicing', 'link': '/teamium/project-invoice', 'pathVariable': 1, 'pathAttributes': ['projectId'], 'defaultSubmenuUrl': '/teamium/project-invoice', 'subPathAttributes': ['projectId'], 'children': [
        { 'title': 'Invoice', 'link': '/teamium/project-invoice/invoice-details', 'pathVariable': 1, 'pathAttributes': ['projectId'] }
      ]
    },
      
    ]
  },
  {
    'title': 'Schedule', 'img': '../../assets/img/sidebar/calender-icon.png', 'activeImg': '../../assets/img/sidebar/calender-icon-active.png', 'defaultUrl': '/teamium/schedule-list', 'defaultSubmenuUrl': '/teamium/schedule-timeline', 'defalutSubmenuOpen': 'true', 'children': [
      { 'title': 'Timeline', 'link': '/teamium/schedule-timeline' },
      { 'title': 'Group Timeline', 'link': '/teamium/group-schedule' },
      { 'title': 'Planning', link: '/teamium/planning-event' },
      { 'title': 'Calendar', link: '/teamium/project-event' },
      { 'title': 'Project', link: '/teamium/project-agenda' },
      { 'title': 'Show', 'link': '/teamium/schedule-program' },
      { 'title': 'Roster', link: '/teamium/schedule-roster' }
    ]
  },
  {
    'title': 'Equipment', 'img': '../../assets/img/sidebar/video-icon.png', 'activeImg': '../../assets/img/sidebar/video-icon-active.png', 'defaultUrl': '/teamium/equipment-list', 'defaultSubmenuUrl': '/teamium/equipment-details', 'children': [
      { 'title': 'Edit', 'link': '/teamium/equipment-details', 'pathVariable': 1, 'pathAttributes': ['equipmentId'] },
      { 'title': 'Package', 'link': '/teamium/equipment-package', 'pathVariable': 1, 'pathAttributes': ['equipmentId'] },
      { 'title': 'Check-In' },
      { 'title': 'Maintenance' }
    ]
  },
  {
    'title': 'Personnel', 'img': '../../assets/img/sidebar/personal-icon.png', 'activeImg': '../../assets/img/sidebar/personal-icon-active.png', 'defaultUrl': '/teamium/staff-list', 'defaultSubmenuUrl': '/teamium/staff-details', 'pathVariable': 1, 'children': [
      { 'title': 'Edit', 'link': '/teamium/staff-details', 'pathVariable': 1, 'pathAttributes': ['staffId'] },
      { 'title': 'Show Reel', 'link': '/teamium/staff-show-reel', 'pathVariable': 1, 'pathAttributes': ['staffId'] },
      { 'title': 'Contract' },
      { 'title': 'Expenses', 'link': '/teamium/staff-expenses', 'pathVariable': 1, 'pathAttributes': ['staffId'] },
      { 'title': 'Leaves', 'link': '/teamium/staff-leave', 'pathVariable': 1, 'pathAttributes': ['staffId'] },
    ]
  },
  {
    'title': 'Report', 'img': '../../assets/img/sidebar/report-icon.png', 'activeImg': '../../assets/img/sidebar/report-icon-active.png', 'defaultUrl': '/teamium/report', 'defaultSubmenuUrl': '/teamium/report-edit', 'children': [
      { 'title': 'Edit', 'link': '/teamium/report-edit' }
    ]
  },
  {
    'title': 'Configuration', 'img': '../../assets/img/config-icon.png', 'activeImg': '../../assets/img/config-icon-active.png', 'defaultUrl': '/teamium/configuration', 'defaultSubmenuUrl': '/teamium/clients', 'defalutSubmenuOpen': 'true', 'children': [

      { 'title': 'Client', 'link': '/teamium/clients' },
      { 'title': 'Vendors', 'link': '/teamium/vendors' },
      { 'title': 'Rate card', 'link': '/teamium/rate-card' },
      { 'title': 'Function', 'link': '/teamium/create-function' },
      { 'title': 'Group', 'link': '/teamium/create-group' },
      { 'title': 'Log' },
      { 'title': 'Configuration', 'link': '/teamium/create-configuration' },
      { 'title': 'Notification Builder', 'link': '/teamium/notification-builder' },
      { 'title': 'Manage Role', 'link': '/teamium/role' },
    ]
  },
]