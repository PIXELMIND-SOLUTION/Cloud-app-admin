// utils/permissions.js
export const hasPermission = (componentId, action = null) => {
  // Check if user is Super Admin (full access)
  if (sessionStorage.getItem('adminAuth') === 'true') {
    return true;
  }

  // Get staff data from session
  const staffData = sessionStorage.getItem('subAdminData');
  if (!staffData) return false;

  const staff = JSON.parse(staffData);
  const permissions = staff.permissions || [];

  // Find permissions for the component
  const comp = permissions.find(p => p.componentId === componentId);
  if (!comp) return false;

  // If action is specified, check if it exists
  if (action) {
    return comp.actions.includes(action);
  }

  // If no action specified, check if any permission exists (view)
  return comp.actions.length > 0;
};

// Helper to check specific actions
export const canView = (componentId) => hasPermission(componentId, 'view');
export const canEdit = (componentId) => hasPermission(componentId, 'edit');
export const canDelete = (componentId) => hasPermission(componentId, 'delete');
export const canExport = (componentId) => hasPermission(componentId, 'export');